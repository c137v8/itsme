import { profile, sections } from "../config/profile.js";
import { useActiveSection } from "../hooks/useActiveSection.js";
import Contact from "./Contact.jsx";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import Projects from "./Projects.jsx";
import Section from "./Section.jsx";
import SectionsRail from "./SectionsRail.jsx";
import Skills from "./Skills.jsx";

// Section id (from config/profile.js) → component. Reorder sections in the config.
const BODIES = { projects: Projects, skills: Skills, contact: Contact };
const IDS = ["top", ...sections.map((s) => s.id)];

export default function Site() {
  const active = useActiveSection(IDS);

  return (
    <>
      <Header active={active} />
      <SectionsRail active={active} />

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-[calc(62px+3rem)] sm:px-6 lg:px-14">
        <article className="rounded-xl border border-line bg-panel px-6 py-10 sm:px-12 sm:py-12">
          <Hero />
          {sections.map(({ id, title }, i) => {
            const Body = BODIES[id];
            return (
              <Section key={id} id={id} n={i + 1} title={title}>
                <Body />
              </Section>
            );
          })}
        </article>

        <footer className="mt-8 text-center font-mono text-xs text-dim">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </>
  );
}
