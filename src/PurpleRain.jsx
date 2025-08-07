import { useEffect, useRef } from 'react';

export default function PurpleRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 100 + 20,
      length: Math.random() * 20 + 5,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const drop of drops) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(200, 0, 255, ${drop.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(200, 0, 255, 0.7)';
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }
      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    return () => cancelAnimationFrame(draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 bg-black"
      style={{ display: 'block' }}
    />
  );
}
