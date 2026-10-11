// Everything on the page that isn't a project lives here.

export const profile = {
  name: "Ibrahim",
  brand: "ibrahim", // top-left wordmark
  tags: ["engineering", "developer", "musician"],
  intro:
    "Engineering student, developer and musician. This page collects what I've built, what I build it with, and where to find me.",
};

// Keys must match an icon in components/Skills.jsx
export const skills = [
  { key: "unity", name: "Unity" },
  { key: "cpp", name: "C++" },
  { key: "python", name: "Python" },
  { key: "c", name: "C" },
  { key: "react", name: "React" },
  { key: "node", name: "Node.js" },
];

export const socials = [
  { label: "GitHub", handle: "c137v8", href: "https://github.com/c137v8" },
  { label: "LinkedIn", handle: "cv8", href: "https://linkedin.com/in/cv8" },
  { label: "Instagram", handle: "raidmaar", href: "https://instagram.com/raidmaar" },
];

export const resume = {
  label: "Resume",
  handle: "PDF",
  href: `${import.meta.env.BASE_URL}Resume_29_07_2025_08_15_58_pm.pdf`,
};

// Order matters: it drives the header nav, the SECTIONS rail and the numbering.
export const sections = [
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
];
