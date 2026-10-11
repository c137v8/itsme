import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { sections } from "../config/profile.js";

const ITEMS = [{ id: "top", title: "Overview" }, ...sections];

/** Left-edge "SECTIONS" tab that opens a table of contents (desktop only). */
export default function SectionsRail({ active }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <aside className="fixed left-0 top-[42vh] z-30 hidden lg:block">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sections-panel"
        onClick={() => setOpen((v) => !v)}
        className="rounded-r-lg border border-l-0 border-line bg-panel px-2.5 py-5 font-mono text-xs uppercase tracking-[0.2em] text-dim transition-colors [writing-mode:vertical-rl] hover:text-white"
      >
        Sections
      </button>

      <AnimatePresence>
        {open && (
          <m.nav
            id="sections-panel"
            aria-label="Sections"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-2 w-52 rounded-lg border border-line bg-panel p-1.5 shadow-2xl shadow-black/60"
          >
            <ul>
              {ITEMS.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === id ? "true" : undefined}
                    className="block rounded px-3 py-2 text-sm text-mute transition-colors hover:bg-chip hover:text-white aria-[current=true]:text-accent"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </aside>
  );
}
