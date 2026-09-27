import React, { useState, useEffect } from 'react';
import { NEIGHBORHOODS } from '../data/realEstateData';
import { Plane, Compass, Sparkles, Shield, Anchor } from 'lucide-react';
import { TextReveal } from './TextReveal';

export const Neighborhoods: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle preview every 6s unless manually interacted
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NEIGHBORHOODS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeNeighborhood = NEIGHBORHOODS[activeIndex];

  return (
    <section id="neighborhoods" className="py-24 bg-[#090a0f] text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
            PREMIER COASTAL DISTRICTS
          </span>
          <div className="mb-3">
            <TextReveal
              text="The Enclaves of Azure Bay"
              as="h2"
              className="font-serif text-3xl md:text-5xl font-bold text-white"
            />
          </div>
          <p className="text-stone-300 text-sm leading-relaxed">
            Every enclave in Azure Bay possesses an unmistakable coastal character—from dramatic sunset cliffs along Coral Ridge to the yacht culture of Marina Crest and tree-lined family avenues of Palm Heights.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {NEIGHBORHOODS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'bg-[#C9A24B] text-black shadow-[0_0_20px_rgba(201,162,75,0.4)] font-semibold'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Neighborhood Showcase with Crossfading Visual & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12141c]/70 rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Visual Showcase Box (7 cols) */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-white/10">
            {NEIGHBORHOODS.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isSelected ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />

                  {/* Contrast Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Overlay Tag info */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="px-3 py-1 rounded bg-[#C9A24B] text-black text-xs font-mono font-bold tracking-wider uppercase mb-2 inline-block">
                      {item.district}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {item.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* District Highlights & Information (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#DFBF6D] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>{activeNeighborhood.district}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                {activeNeighborhood.headline}
              </h3>

              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                {activeNeighborhood.description}
              </p>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mb-6">
                <div>
                  <span className="text-[11px] font-mono uppercase text-stone-400 block mb-0.5">
                    Benchmark Value
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {activeNeighborhood.avgPriceKanal}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-stone-400 block mb-0.5">
                    Airport Transit
                  </span>
                  <span className="text-sm font-semibold text-[#DFBF6D] flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-[#C9A24B]" />
                    {activeNeighborhood.transitTime}
                  </span>
                </div>
              </div>

              {/* Highlights Bullets */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C9A24B] block mb-2">
                  Enclave Hallmarks
                </span>
                {activeNeighborhood.highlights.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] mt-1 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              className="py-3 px-6 rounded-xl bg-white/5 hover:bg-[#C9A24B]/20 border border-white/10 hover:border-[#C9A24B]/50 text-white font-medium text-xs text-center transition-all cursor-pointer"
            >
              Request Private District Dossier
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
