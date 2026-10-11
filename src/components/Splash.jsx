import { useEffect, useRef } from "react";
import { m } from "framer-motion";

const SHOW_MS = 3000; // time on screen before the fade-out starts
const FADE_S = 1;
const QUOTE = '🪞 "Magic mirror on the shelf, does it reflect them all or just myself?"';
const AUDIO_SRC = `${import.meta.env.BASE_URL}fixed-d.mp3`;

export default function Splash({ onDone }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {}); // browsers may block autoplay; that's fine
    const timer = setTimeout(onDone, SHOW_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <m.div
      className="flex min-h-screen items-center justify-center px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: FADE_S }}
    >
      <m.h1
        className="max-w-2xl text-balance text-center text-2xl font-bold sm:text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: FADE_S }}
      >
        {QUOTE}
      </m.h1>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />
    </m.div>
  );
}
