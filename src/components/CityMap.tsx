import React, { useState } from 'react';
import { MAP_LOCATIONS } from '../data/realEstateData';
import { MapPin, Navigation, Clock, ShieldCheck, Waves, Plane, Anchor } from 'lucide-react';
import { TextReveal } from './TextReveal';

export const CityMap: React.FC = () => {
  const [activePin, setActivePin] = useState(MAP_LOCATIONS[0].id);

  const selectedLocation = MAP_LOCATIONS.find((loc) => loc.id === activePin) || MAP_LOCATIONS[0];

  return (
    <section id="map" className="py-24 bg-[#07080c] relative text-white overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center max-w-3xl">
        <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
          AZURE BAY MASTER TERRITORY
        </span>
        <div className="mb-3">
          <TextReveal
            text="Coastal Enclaves & Corridors"
            as="h2"
            className="font-serif text-3xl md:text-5xl font-bold text-white"
          />
        </div>
        <p className="text-stone-300 text-sm leading-relaxed">
          Interactive master map tracing the premier residential sectors of Azure Bay from the dramatic bluffs of Coral Ridge to Marina Crest and the Old Harbour District.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* SVG Interactive Map (2 Columns) */}
        <div className="lg:col-span-2 relative bg-[#0e1017] rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f2433_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          {/* SVG Canvas Map */}
          <div className="relative w-full aspect-[16/10] min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gold Glow filter for pins */}
                <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="bayOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#081426" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0a1a33" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#DFBF6D" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Ocean Bay Water Body */}
              <path
                d="M 0 0 L 220 0 Q 240 180 180 320 Q 140 420 0 500 Z"
                fill="url(#bayOceanGrad)"
                stroke="#1e3a5f"
                strokeWidth="1.5"
              />
              <path
                d="M 0 60 Q 200 200 120 460"
                stroke="#2563eb"
                strokeWidth="1"
                strokeDasharray="8 8"
                opacity="0.3"
              />
              <text x="30" y="240" fill="#3b82f6" fontSize="13" letterSpacing="4" fontFamily="sans-serif" opacity="0.6">
                PACIFIC AZURE BAY
              </text>

              {/* Coastal Reef / Shoal Contours */}
              <path
                d="M 190 60 Q 240 240 170 380"
                stroke="#C9A24B"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.35"
              />

              {/* Invented Coastal Highway (Ocean Boulevard) */}
              <path
                d="M 210 20 Q 250 180 200 340 L 260 480"
                stroke="#2a3245"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 210 20 Q 250 180 200 340 L 260 480"
                stroke="#3e4a66"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text x="215" y="160" fill="#64748b" fontSize="10" transform="rotate(75 215 160)">
                Pacific Coast Highway
              </text>

              {/* Invented East-West Expressway: Palm Heights to Marina */}
              <path
                d="M 210 180 L 460 240 L 640 100"
                stroke="#2a3245"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text x="350" y="215" fill="#64748b" fontSize="10">
                Azure Bay Parkway
              </text>

              {/* Marina Canal & Basin */}
              <rect x="420" y="210" width="90" height="60" rx="10" fill="#0d1b2e" stroke="#1d4ed8" strokeWidth="1" />
              <text x="430" y="245" fill="#60a5fa" fontSize="10" letterSpacing="1">
                YACHT BASIN
              </text>

              {/* Old Harbour Quayside Streets */}
              <path
                d="M 460 270 L 580 325 L 680 430"
                stroke="#2a3245"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <text x="540" y="320" fill="#64748b" fontSize="9" transform="rotate(25 540 320)">
                Old Quayside Road
              </text>

              {/* Palm Heights Foothill Contours */}
              <path
                d="M 300 40 Q 380 90 420 50 T 560 60"
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.25"
              />
              <text x="360" y="45" fill="#22c55e" fontSize="9" letterSpacing="2" opacity="0.5">
                PALM PRESERVE
              </text>

              {/* Animated Glowing Golden Route from Airport to Coral Ridge */}
              <path
                d="M 640 100 Q 480 200 340 170 T 210 170"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeDasharray="10 8"
                className="animate-dash"
                opacity="0.9"
              />

              {/* Animated Route from Marina Crest to Old Harbour */}
              <path
                d="M 465 240 L 575 325"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                className="animate-dash"
                opacity="0.8"
              />

              {/* Map Pins (Render 5 Fictional Pins) */}
              {MAP_LOCATIONS.map((loc, idx) => {
                const isSelected = loc.id === activePin;
                // Scale coordinates 0-100% to 800x500
                const px = (loc.coords.x / 100) * 800;
                const py = (loc.coords.y / 100) * 500;

                return (
                  <g
                    key={loc.id}
                    onClick={() => setActivePin(loc.id)}
                    className="cursor-pointer transition-transform duration-300"
                    style={{
                      transformOrigin: `${px}px ${py}px`,
                      animation: `fadeIn 0.5s ease-out ${idx * 0.15}s both`
                    }}
                  >
                    {/* Pulsing halo */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? '24' : '14'}
                      fill={isSelected ? '#C9A24B' : '#DFBF6D'}
                      opacity={isSelected ? 0.3 : 0.15}
                      className={isSelected ? 'animate-ping' : ''}
                      style={{ animationDuration: '2.5s' }}
                    />

                    {/* Outer glow ring */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? '16' : '10'}
                      fill={isSelected ? '#090a0f' : '#12141c'}
                      stroke={isSelected ? '#DFBF6D' : '#C9A24B'}
                      strokeWidth={isSelected ? '3' : '2'}
                      filter={isSelected ? 'url(#goldGlow)' : undefined}
                    />

                    {/* Inner glowing center */}
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? '6' : '4'}
                      fill={isSelected ? '#DFBF6D' : '#C9A24B'}
                    />

                    {/* Pin Label Card in SVG */}
                    <g transform={`translate(${px}, ${py - 30})`}>
                      <rect
                        x="-70"
                        y="-12"
                        width="140"
                        height="24"
                        rx="12"
                        fill={isSelected ? '#090a0f' : '#12141c'}
                        stroke={isSelected ? '#DFBF6D' : 'rgba(255,255,255,0.15)'}
                        strokeWidth="1.5"
                        opacity={isSelected ? 1 : 0.9}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? '#DFBF6D' : '#e2e8f0'}
                        fontSize="10"
                        fontWeight={isSelected ? 'bold' : '500'}
                        fontFamily="sans-serif"
                      >
                        {loc.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-stone-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DFBF6D] shadow-[0_0_8px_#C9A24B]" />
                <span className="text-stone-300">Selected Enclave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#C9A24B] border-t border-dashed border-[#DFBF6D]" />
                <span className="text-stone-300">Transit Corridor</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-stone-300">
              Interactive Territory Map · Click any pin
            </div>
          </div>
        </div>

        {/* Selected Sector Details Sidebar */}
        <div className="rounded-3xl bg-[#0e1017] border border-[#C9A24B]/40 p-6 md:p-8 shadow-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/30 text-xs font-mono text-[#DFBF6D] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>{selectedLocation.district}</span>
          </div>

          <h3 className="font-serif text-3xl font-bold text-white mb-2">
            {selectedLocation.name}
          </h3>

          <div className="text-xs font-mono text-[#C9A24B] mb-4">
            Featured Asset: {selectedLocation.tag}
          </div>

          <p className="text-stone-300 text-sm leading-relaxed mb-6">
            {selectedLocation.description}
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Expressway Transit</span>
              </span>
              <span className="font-semibold text-white">Direct Ocean Blvd</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>To Azure Bay Airport</span>
              </span>
              <span className="font-semibold text-white">15-18 Minutes</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Enclave Security</span>
              </span>
              <span className="font-semibold text-emerald-400">24/7 Gated Perimeter</span>
            </div>
          </div>

          {/* Quick Select Tabs for the 5 Pins */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {MAP_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActivePin(loc.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  loc.id === activePin
                    ? 'bg-[#C9A24B]/20 border-[#C9A24B] text-white font-medium'
                    : 'bg-white/5 border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/10'
                }`}
              >
                <div className="font-medium truncate">{loc.name}</div>
                <div className="text-[10px] text-stone-300 truncate">{loc.district}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
