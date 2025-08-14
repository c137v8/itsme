import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaUnity,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SiCplusplus, SiC } from "react-icons/si";

// Reveal animation component
function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Navbar
function Navbar() {
  const links = ["About", "Projects", "Skills", "Contact"];
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur z-50 flex justify-center gap-8 py-4 text-lg">
      {links.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          className="hover:text-purple-400 transition-colors"
        >
          {link}
        </a>
      ))}
    </nav>
  );
}

// About Section
function About() {
  return (
    <section
      id="about"
      className="h-screen flex flex-col justify-center items-center px-6"
    >
      <RevealOnScroll>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold mb-4">I am Ibrahim</h1>
          <p className="max-w-lg text-gray-300 text-lg">
            Engineering Student | Developer | Musician
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}

// Projects Section
function Projects({ repos, loading, error }) {
  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col justify-center items-center px-6 py-20"
    >
      <RevealOnScroll>
        <h1 className="text-4xl font-bold mb-10 text-center">
          Top Starred Projects
        </h1>
        {loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : error ? (
          <p className="text-red-400">
            Failed to load projects. Please try again later.
          </p>
        ) : repos.length === 0 ? (
          <p className="text-gray-400">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-shadow group"
              >
                <img
                  src={
                    repo.preview_image ||
                    "https://static.vecteezy.com/system/resources/previews/005/746/378/non_2x/digital-project-management-gradient-icon-for-dark-theme-organising-resources-managing-online-projects-thin-line-color-symbol-modern-style-pictogram-isolated-outline-drawing-vector.jpg"
                  }
                  alt={repo.name}
                  className="w-full h-48 object-cover filter grayscale group-hover:grayscale-0 transition"
                />
                <div className="p-4">
                  <h2 className="text-purple-300 group-hover:text-purple-400 font-semibold text-lg">
                    {repo.name} ⭐ {repo.stargazers_count}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {repo.description || "No description available."}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </RevealOnScroll>
    </section>
  );
}

// Skills Section
function Skills() {
  const skills = [
    { icon: <FaUnity />, name: "Unity" },
    { icon: <SiCplusplus />, name: "C++" },
    { icon: <FaPython />, name: "Python" },
    { icon: <SiC />, name: "C" },
    { icon: <FaReact />, name: "React" },
    { icon: <FaNodeJs />, name: "Node.js" },
  ];

  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col justify-center items-center px-6 py-20"
    >
      <RevealOnScroll>
        <h1 className="text-4xl font-bold mb-10 text-center">Skills</h1>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 text-6xl place-items-center">
          {skills.map(({ icon, name }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
              title={name}
              className="text-white-300 hover:text-white-400 cursor-pointer"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}

// Contact Section
function Contact() {
  const socials = [
    { icon: <FaGithub />, url: "https://github.com/c137v8" },
    { icon: <FaLinkedin />, url: "https://linkedin.com/in/cv8" },
    { icon: <FaInstagram />, url: "https://instagram.com/raidmaar" },
  ];

  return (
    <section
      id="contact"
      className="h-screen flex flex-col justify-center items-center px-6"
    >
      <RevealOnScroll>
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
        <div className="flex gap-6 text-3xl">
          {socials.map(({ icon, url }, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-300 hover:text-white-400 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}

// Main App
export default function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.github.com/users/c137v8/repos?sort=stars&per_page=6"
        );
        if (!res.ok) throw new Error("GitHub API error");
        const data = await res.json();

        // Fetch first image from each repo's root
        const reposWithImages = await Promise.all(
          data.map(async (repo) => {
            try {
              const contentsRes = await fetch(
                `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/`
              );
              if (!contentsRes.ok) throw new Error();
              const contents = await contentsRes.json();

              const imageFile = contents.find(
                (file) =>
                  file.type === "file" &&
                  /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name)
              );

              return {
                ...repo,
                preview_image: imageFile ? imageFile.download_url : null,
              };
            } catch {
              return { ...repo, preview_image: null };
            }
          })
        );

        setRepos(reposWithImages);
        setError(false);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  return (
    <div className="bg-black text-white font-sans scroll-smooth">
      <Navbar />
      <About />
      <Projects repos={repos} loading={loading} error={error} />
      <Skills />
      <Contact />
    </div>
  );
}
