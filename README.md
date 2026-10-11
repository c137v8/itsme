# Portfolio

React + Vite + Tailwind. Deployed to GitHub Pages at <https://c137v8.github.io/itsme>.

```bash
npm install
npm run dev       # local dev server (syncs projects first if data is stale)
npm run deploy    # sync projects → build → publish to gh-pages
```

## Editing content

| What | Where |
| --- | --- |
| Name, tags, intro, skills, social links, section order | `src/config/profile.js` |
| Which GitHub repos appear under Projects | `src/config/projects.js` |
| Colours and fonts | `tailwind.config.js` |

## Choosing projects

Open `src/config/projects.js` and list the repos you want, in the order you want them:

```js
export const owner = "c137v8";

export const projects = [
  "ShellGen",                       // → github.com/c137v8/ShellGen
  "someone-else/their-repo",        // any public repo
  {
    repo: "kShield",
    description: "Replaces the GitHub description.",
    image: "https://example.com/shot.png",
    links: [{ label: "writeup", href: "https://example.com/post" }],
  },
];
```

Then run `npm run sync` (it also runs automatically before `dev`, `build` and `deploy`).
For each repo the script fetches, with no manual input:

- **Description**: the repo's About text, or the first paragraph of its README if empty
- **Links**: repo, README, and the repo's homepage URL as "live" if one is set
- **Preview image**: first non-badge image in the README, otherwise the best-looking
  screenshot/banner/demo image in the repo, otherwise GitHub's generated social card
- **Language, topics, star count**

Anything you set in the object form (`title`, `description`, `image`, `demo`, `links`) wins over what was fetched.

Results are written to `src/data/projects.generated.json` and bundled into the site, so visitors
never hit the GitHub API. Commit that file; it is the fallback if GitHub is unreachable
during a build.

### Rate limits

Anonymous GitHub API access allows 60 requests/hour per IP, and each project uses 2–3.
If you sync a lot or from a shared network, set a token:

```bash
GITHUB_TOKEN=ghp_xxx npm run sync
```

A public-repo read-only token is enough. If a repo fails to sync, the build continues with
its last synced data.

## Structure

```
scripts/sync-projects.mjs      GitHub → projects.generated.json
src/config/                    the two files you edit
src/data/                      generated; don't edit by hand
src/components/                Splash, Site, Header, SectionsRail, Hero, Projects, Skills, Contact
src/hooks/useActiveSection.js  scroll-spy for the nav and the SECTIONS rail
```
