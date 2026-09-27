import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  alphaSpeed: number;
  alphaOffset: number;
  vy: number;
  vx: number;
  color: string;
}

export const GoldenDust: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    // 2. Check low-end mobile (touch device with narrow screen)
    if (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 1) &&
      window.innerWidth < 768
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isPaused = false;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const colors = [
      'rgba(201, 162, 75, ',
      'rgba(223, 191, 109, ',
      'rgba(255, 224, 130, ',
      'rgba(242, 208, 126, '
    ];

    // Create ~40 particles
    const particleCount = 42;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.7 + Math.random() * 1.5,
        baseAlpha: 0.12 + Math.random() * 0.32,
        alpha: 0.2,
        alphaSpeed: 0.001 + Math.random() * 0.002,
        alphaOffset: Math.random() * Math.PI * 2,
        vy: -(0.18 + Math.random() * 0.35), // Slow upward drift
        vx: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Pause on tab hidden to preserve CPU/battery
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (isPaused) return;

      const delta = Math.min((time - lastTime) / 16.667, 2.0); // normalize around 60fps
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Update position
        p.y += p.vy * delta;
        p.x += (p.vx + Math.sin(time * 0.0008 + p.alphaOffset) * 0.1) * delta;

        // Wrap around vertically
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
        }

        // Wrap around horizontally
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        // Subtle alpha breathing
        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(time * p.alphaSpeed + p.alphaOffset));

        // Draw particle with soft halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = 'rgba(201, 162, 75, 0.4)';
        ctx.shadowBlur = p.radius * 2;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-22 w-full h-full mix-blend-screen"
    />
  );
};
