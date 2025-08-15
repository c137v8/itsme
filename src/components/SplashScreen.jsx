// components/SplashScreen.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as PIXI from "pixijs";

export default function SplashScreen({ onFinish }) {
  const pixiContainerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Setup PixiJS application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      antialias: true,
    });

    pixiContainerRef.current.appendChild(app.view);

    // Draw stick figure


    // Play music
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 1000);

    return () => {
      clearTimeout(timer);
      app.destroy(true, { children: true });
    };
  }, [onFinish]);

  return (

    <motion.div
      className="flex h-screen w-screen items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* PixiJS Canvas */}
      <div ref={pixiContainerRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Audio */}
      <audio ref={audioRef} src="/fixed-d.mp3" preload="auto" loop />

      {/* Title overlay */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 1, yoyo: Infinity }}
        className="text-3xl font-bold mix-blend-difference "
      >
        its me
      </motion.h1>
    </motion.div>
  );
}
