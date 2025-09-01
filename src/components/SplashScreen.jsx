// components/SplashScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as PIXI from "pixijs"; // ✅ correct import

export default function SplashScreen({ onFinish }) {
  const pixiContainerRef = useRef(null);
  const audioRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Setup PixiJS application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
    });

    pixiContainerRef.current.appendChild(app.view);

    // Play music
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    // Trigger exit after 3s
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Wait for fade-out before finishing
      setTimeout(onFinish, 1000); // 1s = fade duration
    }, 3000);

    return () => {
      clearTimeout(timer);
      app.destroy(true, { children: true });
    };
  }, [onFinish]);

  return (
    <motion.div
      className="flex h-screen w-screen items-center justify-center bg-black text-white relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      {/* PixiJS Canvas */}
      <div
        ref={pixiContainerRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      {/* Audio */}
      <audio ref={audioRef} src="/fixed-d.mp3" preload="auto" loop />

      {/* Title overlay */}
      <motion.h1
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1,  repeatType: "reverse" }}
        className="relative z-10 text-3xl font-bold mix-blend-difference text-center px-4"
      >
        🪞 "Magic mirror on the shelf, does it reflect them all or just myself?"
      </motion.h1>
    </motion.div>
  );
}
