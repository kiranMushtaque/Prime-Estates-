import React, { useState, useEffect, useRef } from 'react';
import { RoomHotspot } from '../../types';
import { X, Sparkles } from 'lucide-react';

interface RoomHotspotsProps {
  hotspots?: RoomHotspot[];
  roomName: string;
}

export const RoomHotspots: React.FC<RoomHotspotsProps> = ({ hotspots, roomName }) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close active card on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveHotspotId(null);
      }
    };

    if (activeHotspotId) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [activeHotspotId]);

  // Reset active hotspot when room changes
  useEffect(() => {
    setActiveHotspotId(null);
  }, [roomName]);

  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden"
      aria-label={`Interactive architectural hotspots for ${roomName}`}
    >
      {hotspots.map((spot) => {
        const isActive = activeHotspotId === spot.id;

        // Position adjustment so card doesn't run off screen edges
        const isNearRight = spot.x > 65;
        const isNearBottom = spot.y > 65;

        return (
          <div
            key={spot.id}
            className="absolute"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Pulsing Gold Dot Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspotId(isActive ? null : spot.id);
              }}
              className="relative group pointer-events-auto flex items-center justify-center p-2 cursor-pointer focus:outline-none"
              aria-label={`Inspect feature: ${spot.title}`}
              aria-expanded={isActive}
            >
              {/* Outer pulsing ring */}
              <span className="absolute w-8 h-8 rounded-full bg-[#C9A24B]/30 animate-ping pointer-events-none" />
              
              {/* Soft glow halo */}
              <span className="absolute w-6 h-6 rounded-full bg-[#DFBF6D]/20 blur-xs transition-transform duration-300 group-hover:scale-150" />

              {/* Core gold dot */}
              <span
                className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'bg-white border-[#C9A24B] scale-125 shadow-[0_0_16px_#C9A24B]'
                    : 'bg-[#C9A24B] border-black/80 group-hover:scale-110 shadow-[0_0_12px_rgba(201,162,75,0.7)]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black/80" />
              </span>

              {/* Subtle hover mini-label when not active */}
              {!isActive && (
                <span className="hidden md:block absolute left-full ml-2 px-2 py-0.5 rounded-md bg-black/80 border border-[#C9A24B]/40 text-[10px] font-mono text-[#DFBF6D] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                  {spot.title}
                </span>
              )}
            </button>

            {/* Glass Hotspot Info Card */}
            {isActive && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute z-40 pointer-events-auto w-64 sm:w-72 p-3.5 rounded-2xl bg-[#090a0f]/90 border border-[#C9A24B]/60 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(201,162,75,0.25)] backdrop-blur-xl animate-fadeIn ${
                  isNearRight ? 'right-0' : 'left-0'
                } ${isNearBottom ? 'bottom-full mb-3' : 'top-full mt-3'}`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#C9A24B]/20 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                    <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#DFBF6D] leading-tight">
                      {spot.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(null);
                    }}
                    className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    aria-label="Close hotspot card"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {spot.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
