import { profile, resume, skills, socials } from "../config/profile.js";

function MetaRow({ label, children }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <dt className="pt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-dim">{label}</dt>
      <dd className="flex flex-wrap gap-2">{children}</dd>
    </div>
  );
}

export default function Hero() {
  return (
    <div id="top" className="scroll-mt-24">
      <h1 className="text-4xl font-bold tracking-tight text-white">{profile.name}</h1>

      <ul className="mt-4 flex flex-wrap gap-2.5">
        {profile.tags.map((tag) => (
          <li key={tag} className="tag">
            #{tag}
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-4 rounded-lg border border-line bg-void/50 p-5">
        <MetaRow label="Stack">
          {skills.map(({ name }) => (
            <span key={name} className="chip">
              {name.toLowerCase()}
            </span>
          ))}
        </MetaRow>
        <MetaRow label="Elsewhere">
          {[...socials, resume].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="chip-link">
              {label.toLowerCase()}
            </a>
          ))}
        </MetaRow>
      </dl>

      <p className="mt-8 max-w-[72ch] text-[17px] leading-[1.75]">{profile.intro}</p>
    </div>
  );
}
