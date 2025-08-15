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
    const stickFigure = new PIXI.Graphics();
    app.stage.addChild(stickFigure);

    let step = 0;

    function drawStickFigure(x, y, legAngle, armAngle) {
      stickFigure.clear();
      stickFigure.lineStyle(4, 0xffffff);

      // Head
      stickFigure.drawCircle(x, y - 60, 20);

      // Body
      stickFigure.moveTo(x, y - 40);
      stickFigure.lineTo(x, y + 40);

      // Arms
      stickFigure.moveTo(x, y - 20);
      stickFigure.lineTo(x - 30, y - 20 + Math.sin(armAngle) * 10);
      stickFigure.moveTo(x, y - 20);
      stickFigure.lineTo(x + 30, y - 20 - Math.sin(armAngle) * 10);

      // Legs
      stickFigure.moveTo(x, y + 40);
      stickFigure.lineTo(x - 20, y + 80 + Math.sin(legAngle) * 10);
      stickFigure.moveTo(x, y + 40);
      stickFigure.lineTo(x + 20, y + 80 - Math.sin(legAngle) * 10);
    }

    // Animation loop
    app.ticker.add(() => {
      step += 0.1;
      const legAngle = Math.sin(step) * 0.5;
      const armAngle = Math.cos(step) * 0.5;
      const walkX = (step * 5) % (window.innerWidth + 100) - 50;

      drawStickFigure(walkX, window.innerHeight / 2, legAngle, armAngle);
    });

    // Play music
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

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
        className="text-6xl font-bold mix-blend-difference"
      >
        Welcome
      </motion.h1>
    </motion.div>
  );
}
