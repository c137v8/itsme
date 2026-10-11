import { resume, socials } from "../config/profile.js";

export default function Contact() {
  return (
    <ul className="space-y-3 text-[17px]">
      {[...socials, resume].map(({ label, handle, href }) => (
        <li
          key={label}
          className="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:size-1.5 before:rounded-full before:bg-accent"
        >
          <strong className="font-semibold text-white">{label}</strong> —{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="prose-link">
            {handle}
          </a>
        </li>
      ))}
    </ul>
  );
}
