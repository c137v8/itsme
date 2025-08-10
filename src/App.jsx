import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaPython, FaUnity } from "react-icons/fa";
import { SiCplusplus, SiC } from "react-icons/si";

// Reveal-on-scroll animation wrapper
function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
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

export default function App() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch top starred repos from GitHub API
  useEffect(() => {
    fetch("https://api.github.com/users/c137v8/repos?sort=stars&per_page=6")
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API error");
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur z-50 flex justify-center gap-8 py-4">
        <a href="#about" className="hover:text-purple-400">About</a>
        <a href="#projects" className="hover:text-purple-400">Projects</a>
        <a href="#skills" className="hover:text-purple-400">Skills</a>
        <a href="#contact" className="hover:text-purple-400">Contact</a>
      </nav>

      {/* About Section */}
      <section id="about" className="h-screen flex flex-col justify-center items-center px-6">
        <RevealOnScroll>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-bold mb-6">I am Ibrahim</h1>
            <p className="max-w-lg text-center text-gray-300">
              Engineering Student | Developer | Musician
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* Projects Section */}
      <section id="projects" className="h-screen flex flex-col justify-center items-center px-6">
        <RevealOnScroll>
          <h1 className="text-4xl font-bold mb-6">Top Starred Projects</h1>

          {loading ? (
            <p className="text-gray-400">Loading projects...</p>
          ) : error ? (
            <p className="text-red-400">
              Failed to load projects. Please try again later.
            </p>
          ) : repos.length === 0 ? (
            <p className="text-gray-400">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                  <img
                    src="https://raw.githubusercontent.com/c137v8/subsonic_subway/refs/heads/main/graph.png"
                    alt={repo.name}
                    className="w-full h-48 object-cover filter grayscale"
                  />
                  <div className="p-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-400 font-semibold text-lg"
                    >
                      {repo.name} ⭐ {repo.stargazers_count}
                    </a>
                    <p className="text-gray-400 text-sm mt-2">
                      {repo.description || "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RevealOnScroll>
      </section>

      {/* Skills Section */}
   <section id="skills" className="h-screen flex flex-col justify-center items-center px-6">
  <RevealOnScroll>
    <div className="flex flex-col items-center"> {/* Added this wrapper div */}
      <h1 className="text-4xl font-bold mb-6 text-center">Skills</h1> {/* Added text-center */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 text-white-400 text-6xl place-items-center">
        {/* Added place-items-center to center grid items */}
        <FaUnity title="Unity" />
        <SiCplusplus title="C++" />
        <FaPython title="Python" />
        <SiC title="C" />
        <FaReact title="React" />
        <FaNodeJs title="Node.js" />
      </div>
    </div>
  </RevealOnScroll>
</section>

      {/* Contact Section */}
      <section id="contact" className="h-screen flex flex-col justify-center items-center px-6">
        <RevealOnScroll>
          <h1 className="text-4xl font-bold mb-6">Contact</h1>
          <p className="text-gray-300">Email: me@example.com</p>
        </RevealOnScroll>
      </section>
    </div>
  );
}
