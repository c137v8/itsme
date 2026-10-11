// ──────────────────────────────────────────────────────────────────────────
// Which GitHub repos appear in the Projects section.
//
// Add a repo name below and run `npm run sync` (this also happens automatically
// on `npm run dev`, `build` and `deploy`). The sync script fetches each repo's
// description, topics, language, stars, README link and a preview image from
// GitHub, so a plain string is all you need:
//
//   "ShellGen"                  → github.com/<owner>/ShellGen
//   "someone-else/their-repo"   → any other public repo
//
// To override anything that was fetched, use an object instead:
//
//   {
//     repo: "ShellGen",
//     title: "Shell Generator",                      // display name
//     description: "One line that beats the repo's.",
//     image: "https://example.com/shot.png",         // replaces auto-detected image
//     demo: "https://example.com",                   // replaces the repo's homepage URL
//     links: [{ label: "writeup", href: "https://example.com/post" }],
//   }
//
// Order here = order on the page.
// ──────────────────────────────────────────────────────────────────────────

export const owner = "c137v8";

export const projects = [
  "AgentEdge",
  "ShellGen",
  "kShield",
  "Owl-Launcher-",
  "voidframe2",
  "CemFormer",
];
