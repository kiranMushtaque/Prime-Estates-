import React, { useEffect, useRef, useState } from 'react';
import { AGENCY_STATS } from '../data/realEstateData';
import { TextReveal } from './TextReveal';

export const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(AGENCY_STATS.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate count-up
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const nextCounts = AGENCY_STATS.map((stat) =>
              Math.floor(stat.value * easeProgress)
            );
            setCounts(nextCounts);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCounts(AGENCY_STATS.map((s) => s.value));
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#090a0f] border-t border-white/5 relative overflow-hidden"
    >
      {/* Subtle gold glow behind stats */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[250px] bg-[#C9A24B]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
            PROVEN TRACK RECORD
          </span>
          <div className="mb-2">
            <TextReveal
              text="A Legacy of Coastal Trust"
              as="h2"
              className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight"
            />
          </div>
          <p className="text-stone-300 text-sm">
            Setting benchmarks in ultra-prime residential advisory across Azure Bay.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AGENCY_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#12141c]/60 border border-white/10 hover:border-[#C9A24B]/40 transition-all backdrop-blur-md flex flex-col justify-between text-center group"
            >
              <div className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white group-hover:text-[#DFBF6D] transition-colors mb-2 tabular-nums">
                {counts[idx]}
                <span className="text-[#C9A24B]">{stat.suffix}</span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-white mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-stone-400 font-mono">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
