import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, SkipForward, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface GenesisIntroProps {
  onComplete: () => void;
}

const PHASES = [
  { start: 0, end: 1.5, label: 'PHASE 01 // TOPOGRAPHICAL SITE GRID' },
  { start: 1.5, end: 3.0, label: 'PHASE 02 // FOUNDATION & STRUCTURE' },
  { start: 3.0, end: 4.5, label: 'PHASE 03 // CANOPY & COLUMNS' },
  { start: 4.5, end: 6.0, label: 'PHASE 04 // POOL & PERGOLA' },
  { start: 6.0, end: 99, label: 'PHASE 05 // THE CLIFFSIDE SANCTUARY' },
];

export const GenesisIntro: React.FC<GenesisIntroProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [activePhase, setActivePhase] = useState(PHASES[0]);

  // Complete and hand off into walkthrough
  const finishIntro = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setShowSoundPrompt(false);

    try {
      sessionStorage.setItem('meridian_genesis_viewed', 'true');
    } catch {}

    // Smooth 250ms transition out to photo walkthrough
    setTimeout(() => {
      onComplete();
    }, 250);
  }, [isExiting, onComplete]);

  // Auto-dismiss the "Tap for Sound" badge after 3.2 seconds
  useEffect(() => {
    const promptTimer = setTimeout(() => {
      setShowSoundPrompt(false);
    }, 3200);
    return () => clearTimeout(promptTimer);
  }, []);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        setIsFallbackMode(true);
        setHeadlineVisible(true);
        setShowSoundPrompt(false);
        return;
      }
    } catch {}
  }, []);

  // Handle video canplay / ready
  const handleCanPlay = () => {
    setIsVideoReady(true);
    if (videoRef.current && !isFallbackMode) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {
            setIsFallbackMode(true);
            setHeadlineVisible(true);
            setShowSoundPrompt(false);
          });
        }
      });
    }
  };

  // Handle video error fallback
  const handleVideoError = () => {
    setIsFallbackMode(true);
    setHeadlineVisible(true);
    setShowSoundPrompt(false);
  };

  // Handle time update for progress bar, phase HUD and headline reveal
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 8.0;
    const pct = Math.min(100, (current / duration) * 100);
    setProgress(pct);

    // Update active construction phase telemetry
    const matchedPhase = PHASES.find(p => current >= p.start && current < p.end) || PHASES[PHASES.length - 1];
    if (matchedPhase && matchedPhase.label !== activePhase.label) {
      setActivePhase(matchedPhase);
    }

    // Auto-hide sound prompt after 3s of playback
    if (current > 3.0 && showSoundPrompt) {
      setShowSoundPrompt(false);
    }

    // When reaching the final crossfade into the photographic exterior (approx ~6.0s / 75%)
    if (current >= duration - 2.0 && !headlineVisible) {
      setHeadlineVisible(true);
    }
  };

  // Handle video completion
  const handleVideoEnded = () => {
    setProgress(100);
    setHeadlineVisible(true);
    setShowSoundPrompt(false);
  };

  // Toggle sound
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSoundPrompt(false);
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted) {
      videoRef.current.volume = 0.85;
    }
  };

  // Allow user to click anywhere or scroll to start once headline is visible
  useEffect(() => {
    if (!headlineVisible) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 15) {
        finishIntro();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        finishIntro();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [headlineVisible, finishIntro]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-[#07080c] select-none pointer-events-auto overflow-hidden transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Cinematic Genesis Villa Construction Reveal"
    >
      {/* 1. Underlying Real Photographic Exterior Base Layer (01-exterior.jpg) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/walkthrough/01-exterior.jpg"
          alt="The Cliffside Villa Exterior"
          className="w-full h-full object-cover object-center scale-101"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/60" />
      </div>

      {/* 2. Full-Screen Cinematic Video Element */}
      {!isFallbackMode && (
        <video
          ref={videoRef}
          src="/assets/genesis-reveal.mp4"
          poster="/src/assets/images/genesis_blueprint_grid_1790502827469.jpg"
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          onError={handleVideoError}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover object-center z-20 pointer-events-none transition-opacity duration-700 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3. Cinematic 2.39:1 Anamorphic Letterbox Bars with Golden Glow Lines & Integrated Progress */}
      <div
        className={`fixed top-0 inset-x-0 h-10 sm:h-14 md:h-16 lg:h-20 bg-black/95 z-35 border-b border-[#C9A24B]/40 shadow-[0_4px_25px_rgba(201,162,75,0.3)] transition-all duration-700 ease-out pointer-events-none ${
          isVideoReady && !headlineVisible && !isExiting
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#DFBF6D] to-transparent opacity-75" />
      </div>

      <div
        className={`fixed bottom-0 inset-x-0 h-10 sm:h-14 md:h-16 lg:h-20 bg-black/95 z-35 border-t border-[#C9A24B]/40 shadow-[0_-4px_25px_rgba(201,162,75,0.3)] transition-all duration-700 ease-out pointer-events-none ${
          isVideoReady && !headlineVisible && !isExiting
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {/* Clean, elegant golden timeline progress indicator along the letterbox border without stray text */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#8C6D23] via-[#DFBF6D] to-[#FFE082] transition-all duration-100 shadow-[0_0_10px_rgba(201,162,75,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 4. Phase HUD Telemetry Overlay (Top-Left, subtle gold monospace: ONLY the intended phase labels) */}
      {!isFallbackMode && (
        <div
          className={`absolute top-20 sm:top-24 left-4 sm:left-8 md:left-12 z-40 pointer-events-none transition-all duration-700 ${
            isVideoReady && !headlineVisible && !isExiting
              ? 'opacity-85 translate-x-0'
              : 'opacity-0 -translate-x-3'
          }`}
        >
          <div className="flex items-center gap-2 border-l-2 border-[#C9A24B]/70 pl-3 py-1 bg-black/60 backdrop-blur-md rounded-r-md shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFBF6D] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase font-semibold transition-all duration-300">
              {activePhase.label}
            </span>
          </div>
        </div>
      )}

      {/* 5. Top Controls Bar: Monogram, Sound Toggle, Unmute Prompt & Skip Button */}
      <div className="relative z-40 pt-7 sm:pt-9 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#C9A24B] flex items-center justify-center bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(201,162,75,0.3)]">
            <span className="font-serif text-sm font-bold text-[#DFBF6D]">M</span>
          </div>
          <div>
            <span className="text-xs font-mono tracking-widest text-[#DFBF6D] uppercase block font-semibold">
              Meridian Estates
            </span>
          </div>
        </div>

        {/* Right Controls: Cinema Audio, Unmute Prompt & Skip Button */}
        <div className="relative flex items-center gap-2">
          {!isFallbackMode && (
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-mono cursor-pointer backdrop-blur-md ${
                  !isMuted
                    ? 'border-[#C9A24B]/60 bg-[#C9A24B]/20 text-[#DFBF6D] hover:bg-[#C9A24B]/30 hover:text-white'
                    : 'border-white/15 bg-black/75 text-stone-400 hover:text-stone-200'
                }`}
                title={!isMuted ? 'Mute cinematic sound' : 'Enable cinematic sound'}
              >
                {!isMuted ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                    <span className="hidden sm:inline">Muted</span>
                  </>
                )}
              </button>

              {/* Pulsing "Tap for Sound" badge during the first 2-3 seconds */}
              {isMuted && showSoundPrompt && isVideoReady && !headlineVisible && (
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute -bottom-9 right-0 sm:right-auto sm:-left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-[#C9A24B]/70 text-[#DFBF6D] hover:text-white text-[10px] font-mono tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(201,162,75,0.45)] animate-bounce cursor-pointer whitespace-nowrap z-50 transition-opacity duration-300"
                  title="Turn on spatial audio"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE082] animate-ping" />
                  <span>Tap for Sound</span>
                </button>
              )}
            </div>
          )}

          {/* Skip Button - Always visible during playback */}
          <button
            type="button"
            onClick={finishIntro}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A24B]/50 hover:border-[#C9A24B] bg-black/80 hover:bg-[#C9A24B]/20 text-xs font-mono text-[#DFBF6D] hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(201,162,75,0.25)]"
            title="Skip to residence walkthrough"
            aria-label="Skip Genesis Intro"
          >
            <span>Skip</span>
            <SkipForward className="w-3.5 h-3.5 text-[#C9A24B]" />
          </button>
        </div>
      </div>

      {/* 6. Center Headline: "Built for those who arrive." & "Scroll to begin the journey" prompt */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none transition-all duration-1000 transform ${
          headlineVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/80 border border-[#C9A24B]/40 backdrop-blur-md mb-3 shadow-[0_0_20px_rgba(201,162,75,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase">
            Architectural Sovereign Sanctuary
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-3 sm:mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-3xl">
          Built for those who arrive.
        </h1>

        <p className="text-xs sm:text-sm font-sans tracking-[0.25em] uppercase text-stone-300 font-light mb-6 sm:mb-8 max-w-lg drop-shadow">
          The Cliffside Villa · Azure Bay
        </p>

        {/* Scroll To Begin Journey Prompt */}
        <button
          type="button"
          onClick={finishIntro}
          className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C9A24B] hover:bg-[#DFBF6D] text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(201,162,75,0.6)] cursor-pointer animate-bounce"
        >
          <span>Scroll to begin the journey</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
