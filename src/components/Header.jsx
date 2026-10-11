import { profile, sections } from "../config/profile.js";

const LINKS = [{ id: "top", title: "Home" }, ...sections];

export default function Header({ active }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="flex h-[62px] items-center justify-between px-5 sm:px-10">
        <a href="#top" className="font-mono text-[15px] font-bold tracking-[0.2em] text-white">
          {profile.brand}
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 text-[15px] sm:gap-8">
            {LINKS.map(({ id, title }) => (
              <li key={id} className={id === "top" ? "hidden sm:block" : undefined}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className="text-mute transition-colors hover:text-white aria-[current=true]:text-white"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
