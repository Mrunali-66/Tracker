import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const COLORS = ["#3F6B4F", "#C98A3B", "#8FAE93", "#E7C77C", "#2A4A36"];

const Confetti = forwardRef(function Confetti(props, ref) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useImperativeHandle(ref, () => ({
    fire() {
      const reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const particles = [];
      const count = 90;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 120,
          y: canvas.height * 0.35 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 9,
          vy: -Math.random() * 8 - 3,
          size: 5 + Math.random() * 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.3,
        });
      }
      const start = performance.now();
      function frame(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.vy += 0.22;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vrot;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        if (elapsed < 1700) {
          requestAnimationFrame(frame);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      requestAnimationFrame(frame);
    },
  }));

  return <canvas id="confetti-canvas" ref={canvasRef} />;
});

export default Confetti;
