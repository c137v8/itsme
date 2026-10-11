import { FaNodeJs, FaPython, FaReact, FaUnity } from "react-icons/fa";
import { SiC, SiCplusplus } from "react-icons/si";
import { skills } from "../config/profile.js";

// `key` in config/profile.js → icon
const ICONS = { unity: FaUnity, cpp: SiCplusplus, python: FaPython, c: SiC, react: FaReact, node: FaNodeJs };

export default function Skills() {
  return (
    <ul className="flex flex-wrap gap-3">
      {skills.map(({ key, name }) => {
        const Icon = ICONS[key];
        return (
          <li
            key={key}
            className="group inline-flex items-center gap-2.5 rounded-md border border-line bg-void/50 px-4 py-2.5 font-mono text-sm transition-colors hover:border-accent-line"
          >
            {Icon && <Icon aria-hidden="true" className="text-xl text-mute transition-colors group-hover:text-accent" />}
            {name}
          </li>
        );
      })}
    </ul>
  );
}
