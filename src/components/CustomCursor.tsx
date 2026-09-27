import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInWalkthrough, setIsInWalkthrough] = useState(true);

  // Position refs for 60fps lerp
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    // Detect touch-only device
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0)
    ) {
      isTouchRef.current = true;
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Update dot position immediately (no lag for precise pointer)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if mouse is over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [data-cursor-hover], [role="button"]')
        );
        setIsHovered(isInteractive);

        // Check if inside walkthrough
        const walkthroughEl = target.closest('#walkthrough');
        setIsInWalkthrough(Boolean(walkthroughEl));
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for the outer follower ring and spotlight
    let animId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Lerp ring towards mouse position
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.18);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${mousePos.current.x}px ${mousePos.current.y}px, rgba(201,162,75,0.075), transparent 70%)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchRef.current || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Soft spotlight following cursor in walkthrough */}
      <div
        ref={spotlightRef}
        className={`fixed inset-0 pointer-events-none z-35 transition-opacity duration-300 ${
          isInWalkthrough ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Small Gold Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#DFBF6D] shadow-[0_0_8px_#C9A24B] pointer-events-none z-[9999] will-change-transform"
      />

      {/* Outer Soft Glowing Ring with Lerp & Grow on hover */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full pointer-events-none z-[9998] will-change-transform transition-[width,height,border-color,background-color] duration-200 ease-out border flex items-center justify-center ${
          isHovered
            ? 'w-14 h-14 -ml-7 -mt-7 border-[#DFBF6D] bg-[#C9A24B]/10 shadow-[0_0_25px_rgba(201,162,75,0.4)] scale-110'
            : 'w-10 h-10 border-[#C9A24B]/60 bg-transparent shadow-[0_0_12px_rgba(201,162,75,0.2)] scale-100'
        }`}
      />
    </>
  );
};
