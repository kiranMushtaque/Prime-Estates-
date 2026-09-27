import React, { useEffect, useState } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'fade-in' | 'draw-line' | 'splitting' | 'done'>('fade-in');

  useEffect(() => {
    // Check if already viewed in this session
    const viewed = sessionStorage.getItem('meridian_intro_viewed');
    if (viewed === 'true') {
      onComplete();
      return;
    }

    // Sequence timing (total ~3.2 seconds)
    // T = 0ms: Logo fades in with subtle scale
    // T = 800ms: Line starts drawing
    // T = 2200ms: Curtains split open
    // T = 3200ms: Finished, unmount and call onComplete

    const timerLine = setTimeout(() => {
      setPhase('draw-line');
    }, 800);

    const timerSplit = setTimeout(() => {
      setPhase('splitting');
    }, 2200);

    const timerDone = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('meridian_intro_viewed', 'true');
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timerLine);
      clearTimeout(timerSplit);
      clearTimeout(timerDone);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('meridian_intro_viewed', 'true');
    setPhase('done');
    onComplete();
  };

  if (phase === 'done') return null;

  const isSplitting = phase === 'splitting';

  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto overflow-hidden">
      {/* Left Curtain */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#07080c] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] z-10 border-r border-[#C9A24B]/20 ${
          isSplitting ? '-translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Right Curtain */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-[#07080c] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] z-10 border-l border-[#C9A24B]/20 ${
          isSplitting ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Center Brand & Logo Content */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
          isSplitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative flex flex-col items-center text-center px-6 max-w-lg">
          {/* Subtle Ambient Gold Radial Behind Monogram */}
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.18)_0%,transparent_70%)] pointer-events-none animate-pulse" />

          {/* Monogram Seal */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-full border border-[#C9A24B]/50 flex items-center justify-center relative shadow-[0_0_40px_rgba(201,162,75,0.35)]">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#C9A24B]/80 flex items-center justify-center bg-black/40 backdrop-blur-md">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#DFBF6D] font-bold">
                M
              </span>
            </div>
            {/* Rotating halo tick */}
            <div
              className="absolute inset-0 rounded-full border-t-2 border-[#FFE082] animate-spin"
              style={{ animationDuration: '3.5s' }}
            />
          </div>

          {/* Brand Name */}
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#C9A24B] mb-2 block">
            PREMIER ARCHITECTURAL REAL ESTATE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2">
            MERIDIAN ESTATES
          </h1>
          <p className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-stone-300 mb-6 font-light">
            AZURE BAY CINEMATIC RESIDENCES
          </p>

          {/* Thin gold line drawing under logo */}
          <div className="w-64 sm:w-80 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full shadow-[0_0_12px_rgba(201,162,75,0.5)]">
            <div
              className={`h-full bg-gradient-to-r from-transparent via-[#FFE082] to-[#C9A24B] transition-all duration-1000 ease-out ${
                phase === 'fade-in' ? 'w-0' : 'w-full'
              }`}
            />
          </div>

          <span className="text-[10px] font-mono tracking-widest text-stone-300 mt-4 uppercase">
            AN ARCHITECTURAL JOURNEY
          </span>
        </div>
      </div>

      {/* Skip button (top-right) */}
      <button
        onClick={handleSkip}
        className={`absolute top-6 right-8 z-30 pointer-events-auto px-4 py-1.5 rounded-full border border-white/20 hover:border-[#C9A24B] bg-black/50 hover:bg-[#C9A24B]/15 text-stone-400 hover:text-[#DFBF6D] text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer backdrop-blur-md ${
          isSplitting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        Skip Intro ➔
      </button>
    </div>
  );
};
