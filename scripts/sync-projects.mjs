#!/usr/bin/env node
/**
 * Reads the repo list in src/config/projects.js, asks GitHub for each repo's
 * details, and writes src/data/projects.generated.json for the site to import.
 *
 *   npm run sync                  always refresh
 *   node scripts/sync-projects.mjs --if-stale
 *                                 skip if config is unchanged and data < 1h old
 *                                 (used by predev / prebuild)
 *
 * Set GITHUB_TOKEN (or GH_TOKEN) to lift the 60 requests/hour anonymous limit.
 * A failed repo never breaks the build: it falls back to its last synced data,
 * or to a minimal card built from the config alone.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_FILE = path.join(ROOT, "src/config/projects.js");
const OUT_FILE = path.join(ROOT, "src/data/projects.generated.json");

const API = process.env.GITHUB_API_URL ?? "https://api.github.com";
const RAW = process.env.GITHUB_RAW_URL ?? "https://raw.githubusercontent.com";
const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const STALE_AFTER_MS = 60 * 60 * 1000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const log = (msg) => console.log(`[sync] ${msg}`);
const warn = (msg) => console.warn(`[sync] ⚠ ${msg}`);

// ── GitHub helpers ─────────────────────────────────────────────────────────

async function gh(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    signal: AbortSignal.timeout(15_000),
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "portfolio-sync",
      ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
    },
  });
  if (!res.ok) {
    const err = new Error(`${res.status} ${res.statusText} for ${endpoint}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** Like gh(), but a 404 means "doesn't exist" rather than "failed". */
async function ghOptional(endpoint) {
  try {
    return await gh(endpoint);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

/** "Owl-Launcher-" → "Owl-Launcher" (repo names often end in a stray separator). */
const displayName = (name) => name.replace(/[-_.]+$/, "");

// ── Config ─────────────────────────────────────────────────────────────────

function normalise(entry, owner) {
  const spec = typeof entry === "string" ? { repo: entry } : entry;
  if (!spec?.repo) throw new Error(`Invalid entry in projects.js: ${JSON.stringify(entry)}`);
  return { ...spec, repo: spec.repo.includes("/") ? spec.repo : `${owner}/${spec.repo}` };
}

// ── Extracting content from a README ───────────────────────────────────────

const NOT_A_PREVIEW =
  /shields\.io|badge|travis-ci|codecov|coveralls|\/actions\/|\/workflows\/|vercel\.com\/button|netlify\.com|buymeacoffee|ko-fi|sponsors|\.(mp4|webm|mov)(\?|$)/i;

/** First non-badge image in the README, resolved to an absolute URL. */
function firstReadmeImage(markdown, { repo, branch, dir }) {
  // ![alt](url)  |  ![alt](<url with spaces>)  |  <img src="url">
  const pattern = /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^)\s]+))[^)]*\)|<img[^>]+src=["']([^"']+)["']/gi;
  for (const match of markdown.matchAll(pattern)) {
    const src = (match[1] ?? match[2] ?? match[3])?.trim();
    if (!src || src.startsWith("data:") || NOT_A_PREVIEW.test(src)) continue;
    if (/^https?:\/\//i.test(src)) return src;
    const base = src.startsWith("/") ? `${RAW}/${repo}/${branch}/` : `${RAW}/${repo}/${branch}/${dir}`;
    return new URL(src.replace(/^\//, ""), base).href;
  }
  return null;
}

/** First real sentence-ish paragraph, stripped of markdown, for repos without a description. */
function firstReadmeParagraph(markdown) {
  const plain = (s) =>
    s
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/[*_`>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const block = markdown
    .split(/\n\s*\n/)
    .find((b) => !/^\s*(#|!\[|\[!\[|<|\||```|---|===)/.test(b) && plain(b).length >= 30);
  if (!block) return null;
  const text = plain(block);
  return text.length <= 180 ? text : `${text.slice(0, 177).replace(/\s+\S*$/, "")}…`;
}

// ── Finding a preview image in the repo tree (when the README has none) ────

const IMAGE_FILE = /\.(png|jpe?g|gif|webp|avif)$/i;
const JUNK_PATH = /node_modules|vendor|test|favicon|icon|sprite|thumb|mipmap|drawable|\/res\/|\.github\//i;
const PREVIEW_NAME = /preview|screenshot|demo|banner|cover|hero|showcase|overview/i;
const MEDIA_DIR = /^(assets|docs|images|img|screenshots|media|public)\//i;

function bestTreeImage(tree) {
  const scored = tree
    .filter((n) => n.type === "blob" && IMAGE_FILE.test(n.path) && !JUNK_PATH.test(n.path) && (n.size ?? 0) <= MAX_IMAGE_BYTES)
    .map((n) => {
      const depth = n.path.split("/").length - 1;
      const score =
        (PREVIEW_NAME.test(n.path.split("/").pop()) ? 5 : 0) +
        (depth === 0 ? 2 : 0) +
        (MEDIA_DIR.test(n.path) ? 2 : 0);
      return { path: n.path, depth, score };
    })
    .filter((n) => n.score >= 2)
    .sort((a, b) => b.score - a.score || a.depth - b.depth);
  return scored[0]?.path ?? null;
}

const rawUrl = (repo, branch, file) =>
  `${RAW}/${repo}/${branch}/${file.split("/").map(encodeURIComponent).join("/")}`;

// ── Build one project entry ────────────────────────────────────────────────

async function fetchProject(spec) {
  const { repo } = spec;
  const [meta, readme] = await Promise.all([gh(`/repos/${repo}`), ghOptional(`/repos/${repo}/readme`)]);
  const branch = meta.default_branch;

  const markdown = readme ? Buffer.from(readme.content, "base64").toString("utf8") : "";
  const readmeDir = readme?.path?.includes("/") ? readme.path.replace(/[^/]+$/, "") : "";

  let image = spec.image ?? firstReadmeImage(markdown, { repo, branch, dir: readmeDir });
  if (!image) {
    const tree = await ghOptional(`/repos/${repo}/git/trees/${branch}?recursive=1`);
    const file = tree && bestTreeImage(tree.tree ?? []);
    if (file) image = rawUrl(repo, branch, file);
  }

  return {
    repo,
    title: spec.title ?? displayName(meta.name),
    description: spec.description ?? (meta.description || firstReadmeParagraph(markdown)) ?? "",
    url: meta.html_url,
    readmeUrl: readme?.html_url ?? null,
    demo: spec.demo ?? (meta.homepage || null),
    image: image ?? null,
    language: meta.language ?? null,
    topics: meta.topics ?? [],
    stars: meta.stargazers_count ?? 0,
    links: spec.links ?? [],
  };
}

/** Last resort: a card built only from what the config says. */
function fallbackProject(spec, previous) {
  return {
    repo: spec.repo,
    title: spec.title ?? previous?.title ?? displayName(spec.repo.split("/")[1]),
    description: spec.description ?? previous?.description ?? "",
    url: previous?.url ?? `https://github.com/${spec.repo}`,
    readmeUrl: previous?.readmeUrl ?? `https://github.com/${spec.repo}#readme`,
    demo: spec.demo ?? previous?.demo ?? null,
    image: spec.image ?? previous?.image ?? null,
    language: previous?.language ?? null,
    topics: previous?.topics ?? [],
    stars: previous?.stars ?? 0,
    links: spec.links ?? [],
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT_FILE, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const { owner, projects: entries } = await import(pathToFileURL(CONFIG_FILE).href);
  const specs = entries.map((entry) => normalise(entry, owner));
  const configHash = createHash("sha1").update(JSON.stringify(specs)).digest("hex");

  const previous = await readPrevious();
  const ifStale = process.argv.includes("--if-stale");
  const isFresh = previous?.complete && previous.configHash === configHash && Date.now() - Date.parse(previous.syncedAt) < STALE_AFTER_MS;
  if (ifStale && isFresh) {
    log("up to date, skipping (run `npm run sync` to force)");
    return;
  }

  const cached = new Map((previous?.projects ?? []).map((p) => [p.repo, p]));
  let rateLimited = false;
  let failed = 0;

  const projects = await Promise.all(
    specs.map(async (spec) => {
      try {
        const project = await fetchProject(spec);
        log(`✓ ${spec.repo}${project.image ? "" : " (no image found)"}`);
        return project;
      } catch (err) {
        failed += 1;
        rateLimited ||= err.status === 403 || err.status === 429;
        warn(`${spec.repo}: ${err.message}. Using ${cached.has(spec.repo) ? "last synced data" : "config only"}.`);
        return fallbackProject(spec, cached.get(spec.repo));
      }
    }),
  );

  if (rateLimited && !TOKEN) warn("GitHub rate limit hit. Set GITHUB_TOKEN to raise it from 60 to 5000 requests/hour.");

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify({ syncedAt: new Date().toISOString(), complete: failed === 0, configHash, projects }, null, 2)}\n`);
  log(`wrote ${projects.length} projects → ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  // Never block a build because of the sync step
  warn(err.message);
});
