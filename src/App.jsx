import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import PurpleRain from './PurpleRain';

export default function App() {
  const [repos, setRepos] = useState([]);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bootMessages, setBootMessages] = useState([
    "[    0.000000] Booting Linux kernel 5.15.0-86-generic...",
    "[    0.000000] Initializing cgroup subsys cpuset",
    "[    0.000000] Initializing cgroup subsys cpu",
    "[    0.000000] Linux version 5.15.0-86-generic (gcc version 11.4.0)",
    "[  OK  ] Started Load Kernel Modules.",
    "[  OK  ] Mounted /sysroot.",
    "[  OK  ] Reached target Local File Systems.",
    "[  OK  ] Started Remount Root and Kernel File Systems.",
    "[  OK  ] Started Load/Save Random Seed.",
    "[FAILED] Failed to start Network Manager.",
    "[  OK  ] Started udev Kernel Device Manager.",
    "[  OK  ] Started Create Volatile Files and Directories.",
    "[  OK  ] Started Update UTMP about System Boot/Shutdown.",
    "[  OK  ] Reached target System Initialization.",
    "[  OK  ] Started Daily Cleanup of Temporary Directories.",
    "[  OK  ] Reached target Timers.",
    "[  OK  ] Listening on D-Bus System Message Bus Socket.",
    "[  OK  ] Reached target Sockets.",
    "[  OK  ] Reached target Basic System.",
    "[  OK  ] Started Login Service.",
    "[  OK  ] Started Permit User Sessions.",
    "[  OK  ] Started GNOME Display Manager.",
    "[  OK  ] Reached target Graphical Interface.",
    "[  OK  ] Started Application Boot Sequence.",
    "[  OK  ] Initializing Projects UI...",
    "[  OK  ] Loading Portfolio Data...",
  ]);

  const [bootIndex, setBootIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setBootIndex((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => setBootComplete(true), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    Promise.all([
      fetch('https://api.github.com/users/c137v8/repos')
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(repo => repo.description);
          setRepos(filtered);
          const sorted = [...filtered].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
          setRecentRepos(sorted.slice(0, 3));
        }),
      fetch('https://gh-pinned-repos.egoist.dev/?username=c137v8')
        .then(res => res.json())
        .then(setPinnedRepos)
    ]).finally(() => {
      setTimeout(() => setLoading(false), 2000);
    });
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <>
      <AnimatePresence>
        {!bootComplete && loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="fixed inset-0 z-50"
          >
            <div className="fixed inset-0 flex items-center justify-center z-20">
              <pre className="text-purple-400 text-6xl md:text-xl font-semibold font-sans">
                {"\"sup(page load hora hai🤔🤔...)\""}
              </pre>
            </div>
            <PurpleRain />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <div className="bg-gradient-to-br from-black via-purple-950 to-black text-white min-h-screen font-sans">
          <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-lg px-6 py-4 flex justify-center gap-8 border-b border-purple-800 shadow-md">
            <a href="#about" className="hover:text-purple-400 transition duration-300">About</a>
            <a href="#projects" className="hover:text-purple-400 transition duration-300">Projects</a>
            <a href="#skills" className="hover:text-purple-400 transition duration-300">Skills</a>
          </nav>

          <motion.section
            id="about"
            className="h-screen flex flex-col justify-center items-center px-4 text-center"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h1 className="text-5xl font-bold mb-4 text-purple-300">Hi 👋, I am Ibrahim.</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Im a 3rd year Computer Science Engeerning student at National Institue of Technology, Srinagar.
            </p>
            <div className="mt-6 flex justify-center gap-10">
              <motion.a
                href="https://www.instagram.com/raidmaar"
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:underline"
                variants={itemVariants}
                custom={0}
              >
                Instagram
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/cv8"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
                variants={itemVariants}
                custom={1}
              >
                LinkedIn
              </motion.a>
            </div>
          </motion.section>

          <section id="projects" className="p-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-bold mb-8 text-center text-purple-300">Projects</h2>

              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-6 text-center text-purple-200">Top repositories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pinnedRepos.map((repo, index) => {
                    const cleanName = repo.repo.trim();
                    const url = `https://github.com/c137v8/${encodeURIComponent(cleanName)}`;

                    return (
                      <motion.a
                        key={repo.repo}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-zinc-900/70 p-6 rounded-xl border border-purple-700 hover:shadow-2xl hover:scale-[1.02] transition duration-300 backdrop-blur-md hover:border-purple-400 block"
                        variants={itemVariants}
                        custom={index * 0.2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <h4 className="text-xl font-semibold mb-2 text-purple-300">{cleanName}</h4>
                        <p className="text-sm text-zinc-400">{repo.description}</p>
                      </motion.a>
                    );
                  })}
                </div>
              </div>



            </motion.div>
          </section>

          <motion.section
            id="skills"
            className="p-10 text-center"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-bold mb-6 text-purple-300">Skills(What im good at)</h2>
            <motion.ul className="list-disc list-inside text-zinc-400 max-w-md mx-auto">
              {["Data structures and algorithms(C++)", "Game development(Unity)", "Music(Fingerstyle guitar)", "Frontend(Node+react)", "UI/UX Design & Git"].map((skill, index) => (
                <motion.li
                  key={skill}
                  variants={itemVariants}
                  custom={index}
                >
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        </div>
      )}
    </>
  );
}
