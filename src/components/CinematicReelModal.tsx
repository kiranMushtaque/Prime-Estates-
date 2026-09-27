import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface ReelSlide {
  id: string;
  title: string;
  room: string;
  image: string;
  quote: string;
}

const REEL_SLIDES: ReelSlide[] = [
  {
    id: 'exterior',
    title: 'The Cliffside Villa',
    room: 'Oceanfront Exterior',
    image: '/src/assets/images/walkthrough/01-exterior.jpg',
    quote: 'Where pure architectural geometry meets the vast Pacific surf.'
  },
  {
    id: 'entrance',
    title: 'The Architectural Portal',
    room: '12-Ft Pivot Atrium',
    image: '/src/assets/images/walkthrough/02-entrance.jpg',
    quote: 'An oversized solid teak pivot welcoming you into double-height stone volume.'
  },
  {
    id: 'living',
    title: 'The Ocean Living Atrium',
    room: 'Living Room · 24 × 18 ft',
    image: '/src/assets/images/walkthrough/03-living.jpg',
    quote: 'Uninterrupted horizons framed by low-iron, UV-shielded structural glazing.'
  },
  {
    id: 'kitchen',
    title: 'The Culinary Atelier',
    room: 'Chef Kitchen & Island',
    image: '/src/assets/images/walkthrough/04-kitchen.jpg',
    quote: 'Honed Cristallo quartzite slabs and flush induction elegance.'
  },
  {
    id: 'bedroom',
    title: 'The Master Sanctuary',
    room: 'Primary Suite Horizon',
    image: '/src/assets/images/walkthrough/05-bedroom.jpg',
    quote: 'Awaken to panoramic dawn reflections across Azure Bay.'
  },
  {
    id: 'bathroom',
    title: 'The Wellness Spa Atrium',
    room: 'Master Bath & Wet Room',
    image: '/src/assets/images/walkthrough/06-bathroom.jpg',
    quote: 'Monolithic travertine baths overlooking secluded private gardens.'
  },
  {
    id: 'terrace',
    title: 'The Sunset Terrace',
    room: 'Cantilevered Infinity Deck',
    image: '/src/assets/images/walkthrough/07-terrace.jpg',
    quote: 'An 18m heated saltwater lap pool suspended between stone and ocean.'
  }
];

const SLIDE_DURATION_MS = 5500;

interface CinematicReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CinematicReelModal: React.FC<CinematicReelModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Keyboard navigation & ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % REEL_SLIDES.length);
        setProgress(0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + REEL_SLIDES.length) % REEL_SLIDES.length);
        setProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Ambient Drone & Subtle Sound Synthesis (unloads when closed)
  useEffect(() => {
    if (!isOpen || isMuted) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft warm low-frequency drone (D2 = 73.42Hz & A2 = 110Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(73.42, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.0, ctx.currentTime);

      // Low pass filter for velvet sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      return () => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close().catch(() => {});
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio not supported or blocked by policy
    }
  }, [isOpen, isMuted]);

  // Slide advancement timer & continuous progress bar
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalStep / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          setCurrentIndex((curr) => (curr + 1) % REEL_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  // When closed, render null so zero CPU/GPU or memory is used!
  if (!isOpen) return null;

  const currentSlide = REEL_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REEL_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REEL_SLIDES.length) % REEL_SLIDES.length);
    setProgress(0);
  };

  return (
    <div
      className="fixed inset-0 z-[100] w-screen h-screen bg-[#090a0f] flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Architectural Reel"
    >
      {/* 
        Standard Full Aspect Ratio Slides (Full Screen, NOT letterboxed)
        Ken Burns slow zoom and smooth crossfades
      */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {REEL_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-108 translate-y-[-1%]' : 'scale-100 translate-y-0'
                }`}
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
            </div>
          );
        })}

        {/* Subtle Film Grain Noise Overlay Only (No Letterbox bars) */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-[0.045] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-30 pt-6 px-6 sm:px-12 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-ping" />
          <span className="text-xs font-mono tracking-widest text-[#DFBF6D] uppercase">
            Meridian Estates · Architectural Reel
          </span>
          <span className="hidden sm:inline border-l border-white/20 pl-3 text-xs font-mono text-stone-400">
            4K Ultra-Prime Preview
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-[#C9A24B] flex items-center justify-center text-stone-300 hover:text-[#DFBF6D] transition-all cursor-pointer backdrop-blur-md"
            title={isMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C9A24B]" />}
          </button>

          {/* Close Modal (X) Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/60 border border-[#C9A24B]/50 hover:bg-[#C9A24B] text-[#DFBF6D] hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(201,162,75,0.3)]"
            title="Close Reel (Esc)"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Subtle Slide Navigation Arrows */}
      <div className="relative z-30 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 hover:border-[#C9A24B] text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#DFBF6D]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 hover:border-[#C9A24B] text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-[#DFBF6D]" />
        </button>
      </div>

      {/* Bottom Architectural Caption & Timeline Controls */}
      <div className="relative z-30 px-4 sm:px-8 md:px-12 pb-6 sm:pb-8 pointer-events-auto max-w-4xl max-h-[55vh] overflow-y-auto scrollbar-none">
        {/* Slide Counter & Room Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-[#C9A24B]/40 backdrop-blur-md mb-2 text-xs font-mono text-[#DFBF6D]">
          <Sparkles className="w-3 h-3 text-[#C9A24B]" />
          <span>{currentSlide.room}</span>
          <span className="border-l border-white/20 pl-2 text-stone-300">
            0{currentIndex + 1} / 0{REEL_SLIDES.length}
          </span>
        </div>

        {/* Slide Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-medium text-white tracking-tight mb-1.5 drop-shadow-md">
          {currentSlide.title}
        </h2>

        {/* Narrative Quote */}
        <p className="text-xs sm:text-sm md:text-base text-stone-300 font-light leading-relaxed mb-3 sm:mb-5 max-w-2xl drop-shadow">
          "{currentSlide.quote}"
        </p>

        {/* Play/Pause Button & Continuous Progress Bar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-[#C9A24B] hover:bg-[#DFBF6D] text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(201,162,75,0.4)] shrink-0"
            title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Segmented Timeline Indicators */}
          <div className="flex items-center gap-1.5 flex-1">
            {REEL_SLIDES.map((slide, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                  }}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors"
                  title={`Jump to ${slide.title}`}
                >
                  <div
                    className={`h-full bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] transition-all ${
                      isPast ? 'w-full' : isCurrent ? '' : 'w-0'
                    }`}
                    style={{
                      width: isCurrent ? `${progress}%` : undefined
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
