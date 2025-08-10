import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// =====================
// Animation Variants
// =====================

// Section fade-in
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Items in a staggered list
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15 },
  }),
};

export default function App() {
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // Fetch GitHub Top-Starred Repos
  // =====================
  useEffect(() => {
    fetch(
      "https://api.github.com/users/c137v8/repos?sort=stars&direction=desc&per_page=5"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (repo) => repo.description && repo.description.trim() !== ""
        );
        setPinnedRepos(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("GitHub fetch failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* =====================
          Hero Section
         ===================== */}
      <section
        id="home"
        className="h-screen flex flex-col justify-center items-center text-center p-10"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="text-5xl font-bold text-purple-300"
        >
          Welcome to My Portfolio
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="mt-4 text-lg text-zinc-400"
        >
          Full Stack Developer | Game Dev | Fitness Enthusiast
        </motion.p>
      </section>

      {/* =====================
          Projects Section
         ===================== */}
      <section id="projects" className="h-screen p-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">
            Projects
          </h2>

          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-center text-purple-200">
              Top Starred Repositories
            </h3>

            {loading ? (
              <p className="text-center text-zinc-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pinnedRepos.map((repo, index) => {
                  const cleanName = repo.name.trim();
                  const url = `https://github.com/${repo.owner.login}/${encodeURIComponent(
                    cleanName
                  )}`;

                  return (
                    <motion.a
                      key={repo.id}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-zinc-900/70 p-6 rounded-xl border border-purple-700 hover:shadow-2xl hover:scale-[1.02] transition duration-300 backdrop-blur-md hover:border-purple-400 block"
                      variants={itemVariants}
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <h4 className="text-xl font-semibold mb-2 text-purple-300">
                        {cleanName}
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {repo.description}
                      </p>
                      <p className="mt-2 text-yellow-400">
                        ⭐ {repo.stargazers_count}
                      </p>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
