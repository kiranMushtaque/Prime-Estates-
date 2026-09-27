import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WALKTHROUGH_ROOMS } from '../../data/realEstateData';
import { useWalkthroughAudio } from './useWalkthroughAudio';
import { GoldenDust } from './GoldenDust';
import { TextReveal } from '../TextReveal';
import { MagneticButton } from '../MagneticButton';
import { RoomHotspots } from './RoomHotspots';
import {
  ChevronDown,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { SunPathSimulator, SUN_PATH_MODES, SunPathModeId } from './SunPathSimulator';

gsap.registerPlugin(ScrollTrigger);

export { useWalkthroughAudio };

interface PhotoWalkthroughProps {
  onBookViewing?: (propertyTitle?: string) => void;
}

export const PhotoWalkthrough: React.FC<PhotoWalkthroughProps> = ({ onBookViewing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Sun Path Simulator State on Terrace (idx 6: dawn, midday, golden, twilight)
  const [sunPathMode, setSunPathMode] = useState<SunPathModeId>('golden');
  const activeSunPath = useMemo(() => {
    return SUN_PATH_MODES.find((m) => m.id === sunPathMode) || SUN_PATH_MODES[2];
  }, [sunPathMode]);

  // Auto Tour state (~45s smooth walkthrough progression)
  const [isAutoTouring, setIsAutoTouring] = useState(false);
  const isTourActiveRef = useRef(false);
  const autoTourTimerRef = useRef<number | null>(null);

  // Desktop Mouse Depth (max 12px shift opposite to mouse, zero on touch/mobile)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  // Check user prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Desktop 3D Mouse Depth Parallax loop
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      isReducedMotion
    ) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from center: -1 to +1
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      // Opposite shift capped at 12px
      mouseTargetRef.current = {
        x: -nx * 12,
        y: -ny * 12
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

    const tick = () => {
      mouseCurrentRef.current.x = lerp(mouseCurrentRef.current.x, mouseTargetRef.current.x, 0.08);
      mouseCurrentRef.current.y = lerp(mouseCurrentRef.current.y, mouseTargetRef.current.y, 0.08);

      setMouseParallax({
        x: parseFloat(mouseCurrentRef.current.x.toFixed(2)),
        y: parseFloat(mouseCurrentRef.current.y.toFixed(2))
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isReducedMotion]);

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (!containerRef.current || !stageRef.current) return;

    // Pinning the stage over 600vh with scrub: true
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stageRef.current,
      pinSpacing: false, // CSS sticky container inside 600vh wrapper guarantees zero jump/blank gap
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    // Refresh after layout mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      trigger.kill();
    };
  }, []);

  // Compute active room index (0 to 6)
  const totalRooms = WALKTHROUGH_ROOMS.length; // 7
  const maxIndex = totalRooms - 1; // 6
  
  // Normalized progress scaled across 6 transitions: 0.0 -> 6.0
  const continuousIndex = Math.min(Math.max(scrollProgress * maxIndex, 0), maxIndex);
  const activeRoomIndex = Math.min(Math.round(continuousIndex), maxIndex);
  const activeRoom = WALKTHROUGH_ROOMS[activeRoomIndex];

  // Custom hook: triggers subtle whoosh + soft door chime at each room transition point
  const { isAudioEnabled, toggleAudio } = useWalkthroughAudio(activeRoomIndex);

  // Navigate to room on click using Lenis smooth scroll
  const handleRoomClick = (index: number) => {
    if (!containerRef.current) return;

    const targetFraction = index / maxIndex;
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerTop + targetFraction * totalScrollableDistance;

    const winWithLenis = window as unknown as { lenis?: { scrollTo: (target: number) => void } };
    if (winWithLenis.lenis) {
      winWithLenis.lenis.scrollTo(targetScrollY);
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  };

  // Stop auto tour and clear scheduled steps
  const stopAutoTour = useCallback(() => {
    setIsAutoTouring(false);
    isTourActiveRef.current = false;
    if (autoTourTimerRef.current) {
      clearTimeout(autoTourTimerRef.current);
      autoTourTimerRef.current = null;
    }
  }, []);

  // Smoothly scrolls through the walkthrough automatically (~45 seconds total, pausing 2 seconds on each room)
  const startAutoTour = useCallback(() => {
    if (!containerRef.current) return;
    setIsAutoTouring(true);
    isTourActiveRef.current = true;

    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;

    let step = 0;

    const advanceStep = () => {
      if (!isTourActiveRef.current) return;

      if (step > maxIndex) {
        stopAutoTour();
        return;
      }

      const targetFraction = step / maxIndex;
      const targetScrollY = containerTop + targetFraction * totalScrollableDistance;

      const winWithLenis = window as unknown as {
        lenis?: {
          scrollTo: (
            target: number,
            opts?: { duration?: number; easing?: (t: number) => number }
          ) => void;
        };
      };

      if (winWithLenis.lenis) {
        winWithLenis.lenis.scrollTo(targetScrollY, {
          duration: 4.5,
          easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        });
      } else {
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }

      step++;

      // 4.5s transition scroll + 2.0s pause on room = 6.5s interval
      // Across 7 rooms, total tour length is ~45s
      autoTourTimerRef.current = window.setTimeout(() => {
        if (isTourActiveRef.current) {
          advanceStep();
        }
      }, 6500);
    };

    advanceStep();
  }, [maxIndex, stopAutoTour]);

  // Stops immediately if the user scrolls, clicks or presses any key
  useEffect(() => {
    if (!isAutoTouring) return;

    const handleInterruption = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-tour-control="true"]')) {
        return;
      }
      stopAutoTour();
    };

    window.addEventListener('wheel', handleInterruption, { passive: true });
    window.addEventListener('touchstart', handleInterruption, { passive: true });
    window.addEventListener('keydown', handleInterruption);
    window.addEventListener('mousedown', handleInterruption);

    return () => {
      window.removeEventListener('wheel', handleInterruption);
      window.removeEventListener('touchstart', handleInterruption);
      window.removeEventListener('keydown', handleInterruption);
      window.removeEventListener('mousedown', handleInterruption);
    };
  }, [isAutoTouring, stopAutoTour]);

  // Pre-calculate per-layer visual state (scale, opacity, z-index, flash)
  const layerStates = useMemo(() => {
    return WALKTHROUGH_ROOMS.map((_, i) => {
      // Distance from this room in index units
      const diff = continuousIndex - i;

      let opacity = 0;
      let scale = 1.0;
      let zIndex = 1;

      if (isReducedMotion) {
        // Simple crossfade fallback
        const dist = Math.abs(diff);
        opacity = Math.max(0, 1 - dist);
        return { opacity, scale: 1, zIndex: Math.round(opacity * 10) };
      }

      if (diff >= 0 && diff < 1) {
        // Room i is current or fading out as user walks deeper into room i+1
        // Scale expands from 1.0 up to 1.20 (walking forward through the space)
        scale = 1.0 + diff * 0.20;
        opacity = 1.0 - Math.pow(diff, 1.8);
        zIndex = 10;
      } else if (diff < 0 && diff > -1) {
        // Room i is the upcoming room fading in
        // Next image fades in and scales from 0.85 up to 1.0 (feels like walking through doorway)
        const incoming = 1 + diff; // 0 -> 1
        scale = 0.85 + incoming * 0.15;
        opacity = Math.pow(incoming, 1.4);
        zIndex = 20;
      } else if (Math.abs(diff) < 0.001) {
        opacity = 1;
        scale = 1.0;
        zIndex = 30;
      } else {
        opacity = 0;
        scale = 0.85;
        zIndex = 0;
      }

      return {
        opacity: Math.max(0, Math.min(1, opacity)),
        scale,
        zIndex
      };
    });
  }, [continuousIndex, isReducedMotion]);

  // Flash / vignette intensity at transition thresholds
  // Peaks when continuousIndex is near half-steps (0.5, 1.5, 2.5, etc.)
  const transitionDistanceToNearestHalf = Math.abs((continuousIndex % 1) - 0.5);
  const flashIntensity = Math.max(0, (0.25 - transitionDistanceToNearestHalf) / 0.25);

  return (
    <section
      id="walkthrough"
      ref={containerRef}
      style={{ height: '600vh' }}
      className="relative w-full h-[600vh] bg-[#090a0f]"
      aria-label="Cinematic Photo Walkthrough"
    >
      {/* Pinned Sticky Stage (h-screen, sticky top-0) */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Full-Screen Photo Layers */}
        <div className="absolute inset-0 z-0 bg-[#090a0f] pointer-events-none select-none">
          {WALKTHROUGH_ROOMS.map((room, idx) => {
            const state = layerStates[idx];
            return (
              <div
                key={room.id}
                className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-75"
                style={{
                  opacity: state.opacity,
                  zIndex: state.zIndex,
                  visibility: state.opacity > 0.005 ? 'visible' : 'hidden'
                }}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center will-change-transform ${
                    !isReducedMotion ? 'animate-slow-ambient-drift' : ''
                  }`}
                  style={{
                    transform: `scale(${state.scale * 1.03}) translate3d(${mouseParallax.x}px, ${mouseParallax.y}px, 0)`,
                    transformOrigin: '50% 50%'
                  }}
                />

                {/* Night View Transition on Terrace (07) when Twilight Blue Hour is active */}
                {room.id === 'terrace' && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
                    style={{
                      opacity: sunPathMode === 'twilight' ? 0.85 : 0
                    }}
                  >
                    <img
                      src="/src/assets/images/walkthrough/08-exterior-night.jpg"
                      alt={`${room.name} Twilight Blue Hour View`}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      style={{
                        transform: `scale(${state.scale * 1.03}) translate3d(${mouseParallax.x}px, ${mouseParallax.y}px, 0)`,
                        transformOrigin: '50% 50%'
                      }}
                    />
                  </div>
                )}

                {/* Sun Path Simulator Lighting Overlay on Terrace (07) */}
                {room.id === 'terrace' && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
                    style={{
                      background: activeSunPath.gradientOverlay,
                      mixBlendMode: activeSunPath.mixBlendMode,
                      filter: activeSunPath.filterStyle
                    }}
                  />
                )}

                {/* Room Interactive Hotspots (active when room is prominently in view) */}
                {state.opacity > 0.5 && (
                  <RoomHotspots
                    hotspots={room.hotspots}
                    roomName={room.name}
                  />
                )}
              </div>
            );
          })}

          {/* Golden Dust: ~40 floating subtle gold particles */}
          <GoldenDust />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090a0f] via-transparent to-[#090a0f]/80 z-25" />
          <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-70 z-25" />

          {/* Light Glow Flash on Doorway Transitions */}
          <div
            className="absolute inset-0 pointer-events-none z-28 transition-opacity duration-150 bg-gradient-to-b from-[#C9A24B]/20 via-[#DFBF6D]/15 to-transparent mix-blend-screen"
            style={{ opacity: flashIntensity * 0.4 }}
          />
        </div>

        {/* Ambient Top Subtle Status Bar */}
        <div className="relative z-30 pt-16 sm:pt-18 lg:pt-20 px-4 sm:px-8 md:px-12 pr-12 sm:pr-14 lg:pr-48 xl:pr-56 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase truncate">
              The Cliffside Villa · Coral Ridge
            </span>
          </div>

          {/* Unified Compact Experience Toolbar (Auto Tour + Ambient Audio) */}
          <div className="flex items-center p-1 rounded-full bg-black/80 border border-[#C9A24B]/40 shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(201,162,75,0.15)] backdrop-blur-xl pointer-events-auto shrink-0">
            {/* Auto Tour Toggle */}
            <button
              type="button"
              data-tour-control="true"
              onClick={isAutoTouring ? stopAutoTour : startAutoTour}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer text-[11px] font-mono select-none ${
                isAutoTouring
                  ? 'bg-[#C9A24B] text-black font-semibold shadow-[0_0_10px_rgba(201,162,75,0.7)] animate-pulse'
                  : 'text-[#DFBF6D] hover:text-white hover:bg-white/10'
              }`}
              title={isAutoTouring ? "Stop auto tour" : "Start automatic 45-second tour"}
              aria-label={isAutoTouring ? "Stop Tour" : "Start Auto Tour"}
            >
              {isAutoTouring ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-[#C9A24B] shrink-0" />
                  <span className="hidden sm:inline">Tour</span>
                </>
              )}
            </button>

            <span className="w-px h-3.5 bg-white/15 mx-0.5" />

            {/* Audio Ambient Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
                isAudioEnabled
                  ? 'text-[#DFBF6D] hover:text-white hover:bg-white/10'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
              title={isAudioEnabled ? "Mute ambient audio" : "Unmute ambient audio"}
              aria-label={isAudioEnabled ? "Mute audio" : "Unmute audio"}
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                  <span className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 h-1.5 bg-[#DFBF6D] rounded-full animate-pulse" />
                    <span className="w-0.5 h-2.5 bg-[#DFBF6D] rounded-full animate-pulse delay-75" />
                    <span className="w-0.5 h-2 bg-[#DFBF6D] rounded-full animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Center / Bottom Glass Text Cards per room */}
        <div className="relative z-30 px-4 sm:px-8 md:px-12 pb-4 sm:pb-6 md:pb-8 max-w-xl lg:max-w-2xl xl:max-w-3xl pr-12 sm:pr-14 lg:pr-48 xl:pr-56 pointer-events-auto max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-none">
          {WALKTHROUGH_ROOMS.map((room, idx) => {
            const isCurrent = idx === activeRoomIndex;
            const diff = continuousIndex - idx;
            // Opacity curve for text card: visible only when within 0.45 of current room
            const cardOpacity = Math.max(0, 1 - Math.abs(diff) * 2.2);

            if (cardOpacity < 0.01) return null;

            return (
              <div
                key={`card-${room.id}`}
                className="transition-all duration-300 transform"
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${diff * 20}px)`
                }}
              >
                {/* Room Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#C9A24B]/40 backdrop-blur-md mb-2 sm:mb-2.5 text-[11px] font-mono text-[#DFBF6D]">
                  <Sparkles className="w-3 h-3 text-[#C9A24B]" />
                  <span>{room.badge}</span>
                  {room.specs && (
                    <span className="border-l border-white/20 pl-2 text-stone-300">
                      {room.specs}
                    </span>
                  )}
                </div>

                {/* Main Headline with Text Reveal */}
                <div className="mb-2 sm:mb-2.5">
                  <TextReveal
                    key={`reveal-${room.id}`}
                    text={room.headline}
                    as="h1"
                    className={
                      idx === 6
                        ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-medium text-white tracking-tight leading-tight text-shadow"
                        : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-tight text-shadow"
                    }
                  />
                </div>

                {/* Room Architectural Narrative */}
                <p className={
                  idx === 6
                    ? "text-xs sm:text-sm text-stone-300 max-w-xl font-light leading-relaxed mb-2 backdrop-blur-xs bg-black/20 p-2 rounded-xl border border-white/5 line-clamp-2"
                    : "text-xs sm:text-sm md:text-base text-stone-300 max-w-xl lg:max-w-2xl font-light leading-relaxed mb-3 sm:mb-4 backdrop-blur-xs bg-black/20 p-2 sm:p-2.5 rounded-xl border border-white/5"
                }>
                  {room.description}
                </p>

                {/* Features Pills */}
                <div className={
                  idx === 6
                    ? "hidden sm:flex flex-wrap items-center gap-1.5 mb-2"
                    : "flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4"
                }>
                  {room.features.map((feat, fidx) => (
                    <span
                      key={fidx}
                      className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md text-stone-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Room 07 (Sunset Terrace) Final Grand CTA & Lighting Control */}
                {idx === 6 && (
                  <div className="mt-2 sm:mt-2.5 flex flex-col gap-2 sm:gap-2.5 max-w-xl animate-fadeIn">
                    {/* Sun Path Simulator Interactive Celestial Dial */}
                    <SunPathSimulator
                      currentMode={sunPathMode}
                      onModeChange={setSunPathMode}
                    />

                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090a0f]/95 border border-[#C9A24B] shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(201,162,75,0.25)] backdrop-blur-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-[#C9A24B]/20 pb-2 mb-2.5">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#DFBF6D] block">
                            Acquisition Price
                          </span>
                          <div className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
                            PKR 28.5 Crore
                          </div>
                        </div>
                        <div className="sm:text-right bg-white/[0.03] sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg sm:rounded-none border border-white/5 sm:border-0 flex sm:flex-col justify-between items-baseline sm:items-end">
                          <span className="text-xs sm:text-sm text-stone-200 font-medium block">
                            5 Beds · 6 Baths · 4,800 Sq Ft
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#C9A24B] font-mono tracking-wide">
                            Coral Ridge Oceanfront
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
                        <MagneticButton
                          onClick={() => onBookViewing?.('The Cliffside Villa, Coral Ridge')}
                          className="w-full sm:flex-1 py-2 sm:py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(201,162,75,0.4)] cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Book a Private Viewing</span>
                        </MagneticButton>

                        <a
                          href="#featured"
                          className="w-full sm:w-auto py-2 sm:py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>More Listings</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Side Progress Indicator (Right Edge) */}
        <div className="fixed right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md shadow-2xl">
          {WALKTHROUGH_ROOMS.map((room, idx) => {
            const isCurrent = idx === activeRoomIndex;
            return (
              <button
                key={room.id}
                onClick={() => handleRoomClick(idx)}
                className={`group flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C9A24B]/20 border border-[#C9A24B]/50'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                title={`Jump to ${room.name}`}
              >
                {/* Step dot */}
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#C9A24B] scale-125 shadow-[0_0_10px_#C9A24B]'
                      : 'bg-white/30 group-hover:bg-white/60'
                  }`}
                />

                {/* Room Name label (visible on xl: 1280px+ or hover) */}
                <span
                  className={`hidden xl:inline text-[11px] font-mono tracking-wide transition-colors ${
                    isCurrent
                      ? 'text-[#DFBF6D] font-medium'
                      : 'text-stone-400 group-hover:text-stone-200'
                  }`}
                >
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Scroll Cue: visible only at initial scroll to start journey */}
        {scrollProgress < 0.08 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-[10px] sm:text-[11px] font-mono text-stone-400 pointer-events-none animate-bounce">
            <span>Scroll to walk deeper</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#C9A24B]" />
          </div>
        )}
      </div>
    </section>
  );
};
