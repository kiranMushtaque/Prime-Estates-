import React from 'react';
import { Sun, Sunset, Sunrise, Moon } from 'lucide-react';

export type SunPathModeId = 'dawn' | 'midday' | 'golden' | 'twilight';

export interface SunPathMode {
  id: SunPathModeId;
  name: string;
  timeTag: string;
  angle: number; // in degrees for dial visualization
  caption: string;
  gradientOverlay: string;
  mixBlendMode: 'screen' | 'overlay' | 'color-dodge' | 'multiply';
  filterStyle: string;
}

export const SUN_PATH_MODES: SunPathMode[] = [
  {
    id: 'dawn',
    name: 'Morning Dawn',
    timeTag: '06:45 AM',
    angle: 25,
    caption: 'Soft rose-gold dawn light breaks across the Pacific, casting elongated soft shadows and cool maritime mist.',
    gradientOverlay: 'linear-gradient(135deg, rgba(255, 175, 120, 0.42) 0%, rgba(255, 120, 160, 0.25) 45%, rgba(30, 20, 60, 0.5) 100%)',
    mixBlendMode: 'screen',
    filterStyle: 'brightness(1.05) saturate(1.2) hue-rotate(-8deg)'
  },
  {
    id: 'midday',
    name: 'Midday Radiance',
    timeTag: '12:30 PM',
    angle: 90,
    caption: 'High zenith clarity with sparkling azure ocean reflections, revealing the vibrant coral seabed below.',
    gradientOverlay: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(160, 220, 255, 0.15) 50%, rgba(10, 25, 45, 0.3) 100%)',
    mixBlendMode: 'overlay',
    filterStyle: 'brightness(1.15) contrast(1.06) saturate(1.1)'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    timeTag: '06:15 PM',
    angle: 155,
    caption: 'Breathtaking 24K amber rays illuminate the cantilevered infinity terrace and volcanic masonry facade.',
    gradientOverlay: 'linear-gradient(110deg, rgba(255, 170, 20, 0.55) 0%, rgba(201, 162, 75, 0.45) 50%, rgba(60, 20, 5, 0.6) 100%)',
    mixBlendMode: 'color-dodge',
    filterStyle: 'brightness(1.08) saturate(1.35) contrast(1.06)'
  },
  {
    id: 'twilight',
    name: 'Twilight Blue Hour',
    timeTag: '07:45 PM',
    angle: 220,
    caption: 'Deep indigo twilight descends; architectural low-voltage cove lighting illuminates the infinity rim.',
    gradientOverlay: 'linear-gradient(180deg, rgba(10, 18, 45, 0.72) 0%, rgba(20, 32, 70, 0.55) 50%, rgba(4, 7, 18, 0.85) 100%)',
    mixBlendMode: 'multiply',
    filterStyle: 'brightness(0.85) contrast(1.18) saturate(1.25)'
  }
];

interface SunPathSimulatorProps {
  currentMode: SunPathModeId;
  onModeChange: (mode: SunPathModeId) => void;
}

export const SunPathSimulator: React.FC<SunPathSimulatorProps> = ({
  currentMode,
  onModeChange
}) => {
  const activeMode = SUN_PATH_MODES.find((m) => m.id === currentMode) || SUN_PATH_MODES[2];

  const renderIcon = (id: SunPathModeId) => {
    switch (id) {
      case 'dawn':
        return <Sunrise className="w-3.5 h-3.5" />;
      case 'midday':
        return <Sun className="w-3.5 h-3.5" />;
      case 'golden':
        return <Sunset className="w-3.5 h-3.5" />;
      case 'twilight':
        return <Moon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="rounded-xl bg-[#090a0f]/95 border border-[#C9A24B]/40 p-2.5 sm:p-3.5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(201,162,75,0.15)] w-full">
      {/* Top Bar: Title + Active Time */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C9A24B] animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#DFBF6D]">
            Terrace Sun Path Simulator
          </span>
        </div>
        <span className="text-[10px] font-mono text-stone-300 bg-black/60 px-2 py-0.5 rounded border border-white/10 shrink-0">
          {activeMode.timeTag}
        </span>
      </div>

      {/* Interactive 4-Position Gold Segmented Dial/Bar */}
      <div className="relative p-1 rounded-xl bg-black/60 border border-white/10 mb-2 sm:mb-2.5">
        {/* 4 Segment Buttons */}
        <div className="grid grid-cols-4 gap-1 relative z-10">
          {SUN_PATH_MODES.map((mode) => {
            const isSelected = mode.id === currentMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg text-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] text-black font-semibold shadow-[0_0_15px_rgba(201,162,75,0.5)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
                title={`Switch to ${mode.name}`}
              >
                <span className={isSelected ? 'text-black' : 'text-[#C9A24B]'}>
                  {renderIcon(mode.id)}
                </span>
                <span className="text-[9px] sm:text-[11px] font-mono tracking-tight leading-tight truncate">
                  {mode.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Caption for the Selected Light Position */}
      <div className="flex items-start gap-1.5 sm:gap-2 bg-white/[0.02] p-1.5 sm:p-2 rounded-lg border border-white/5">
        <span className="text-[#C9A24B] text-[11px] font-mono shrink-0 mt-0.5">✦</span>
        <p className="text-[10px] sm:text-xs text-stone-300 font-light leading-relaxed transition-all duration-300">
          {activeMode.caption}
        </p>
      </div>
    </div>
  );
};
