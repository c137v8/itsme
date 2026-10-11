import { useState } from "react";
import data from "../data/projects.generated.json";

const MAX_TOPICS = 3;

function ProjectCard({ project: p }) {
  // Try the project's own image first, then GitHub's generated social card
  const sources = [p.image, `https://opengraph.githubassets.com/1/${p.repo}`].filter(Boolean);
  const [attempt, setAttempt] = useState(0);
  const src = sources[attempt];

  const links = [
    { label: "repo", href: p.url },
    p.readmeUrl && { label: "readme", href: p.readmeUrl },
    p.demo && { label: "live", href: p.demo },
    ...p.links,
  ].filter(Boolean);
  const tags = [p.language, ...p.topics.slice(0, MAX_TOPICS)].filter(Boolean);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-void/50 transition-colors hover:border-accent-line">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="block aspect-video overflow-hidden border-b border-line bg-chip"
      >
        {src ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setAttempt((n) => n + 1)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="grid h-full place-items-center font-mono text-xs text-dim">no preview</span>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-mono text-[15px] font-medium text-white">{p.title}</h3>
          {p.stars > 0 && (
            <span className="shrink-0 font-mono text-xs text-mute" title={`${p.stars} GitHub stars`}>
              ★ {p.stars}
            </span>
          )}
        </div>

        {p.description && <p className="text-[15px] leading-relaxed text-mute">{p.description}</p>}

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="chip">
                {tag.toLowerCase()}
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-auto flex flex-wrap gap-2 pt-1">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="chip-link">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Projects() {
  if (data.projects.length === 0) {
    return (
      <p className="text-mute">
        No projects yet. Add repos to <code className="code">src/config/projects.js</code> and run{" "}
        <code className="code">npm run sync</code>.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {data.projects.map((project) => (
        <li key={project.repo}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
