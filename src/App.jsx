import { useCallback, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import Splash from "./components/Splash.jsx";
import Site from "./components/Site.jsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const finishSplash = useCallback(() => setReady(true), []);

  return (
    // LazyMotion + `m` keeps framer-motion's bundle cost to the DOM-animation subset
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="starfield" aria-hidden="true" />
        {/* mode="wait": the splash finishes fading out before the site fades in */}
        <AnimatePresence mode="wait">
          {ready ? (
            <m.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <Site />
            </m.div>
          ) : (
            <Splash key="splash" onDone={finishSplash} />
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
