import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Anchor, Coins, Building, Award, CheckCircle2 } from 'lucide-react';
import { TextReveal } from './TextReveal';

interface ColumnListing {
  id: string;
  name: string;
  location: string;
  isFeatured?: boolean;
  pricePerSqFt: {
    display: string;
    subtext: string;
    percentage: number;
  };
  shoreline: {
    display: string;
    subtext: string;
    percentage: number;
  };
  security: {
    display: string;
    subtext: string;
    percentage: number;
  };
  taxAdvantage: {
    display: string;
    subtext: string;
    percentage: number;
  };
}

const BENCHMARK_COLUMNS: ColumnListing[] = [
  {
    id: 'azure-bay',
    name: 'The Cliffside Villa',
    location: 'Azure Bay · Coral Ridge',
    isFeatured: true,
    pricePerSqFt: {
      display: 'PKR 59,375',
      subtext: '($213 / sq ft) · High Value Density',
      percentage: 100
    },
    shoreline: {
      display: '120 Meters',
      subtext: 'Private Cantilevered Ocean Frontage',
      percentage: 100
    },
    security: {
      display: 'Tier 1 Sovereign',
      subtext: 'Biometric Portal + Gated Bay Marine Patrol',
      percentage: 98
    },
    taxAdvantage: {
      display: '0% Wealth Tax',
      subtext: 'Unrestricted Capital Repatriation Ease',
      percentage: 95
    }
  },
  {
    id: 'monaco',
    name: 'Le Portier Waterfront',
    location: 'Monaco · Port Hercules',
    pricePerSqFt: {
      display: 'PKR 1,420,000',
      subtext: '($5,100 / sq ft) · Extreme Premium',
      percentage: 20
    },
    shoreline: {
      display: 'Shared Berth',
      subtext: 'Marina Mooring · No Direct Shore Access',
      percentage: 25
    },
    security: {
      display: 'Municipal Grid',
      subtext: 'Monaco Police Surveillance + Doorman',
      percentage: 85
    },
    taxAdvantage: {
      display: '0% Income Tax',
      subtext: 'High Mandatory Bank Capital Guarantees',
      percentage: 88
    }
  },
  {
    id: 'malibu',
    name: 'Pacific Bluff Reserve',
    location: 'Malibu · Point Dume',
    pricePerSqFt: {
      display: 'PKR 920,000',
      subtext: '($3,300 / sq ft) · US Pacific Luxury',
      percentage: 35
    },
    shoreline: {
      display: '45 Meters',
      subtext: 'Public Coastal Easement Right-of-Way',
      percentage: 48
    },
    security: {
      display: 'Gated Perimeter',
      subtext: 'Private Gate Guard + Infrared Sensor Array',
      percentage: 82
    },
    taxAdvantage: {
      display: 'Tier 3 Heavy Tax',
      subtext: '13.3% State Tax + Federal Capital Gains',
      percentage: 32
    }
  },
  {
    id: 'dubai',
    name: 'Palm Crest Penthouse',
    location: 'Dubai Marina · Palm Crescent',
    pricePerSqFt: {
      display: 'PKR 480,000',
      subtext: '($1,720 / sq ft) · Tower Sky Residence',
      percentage: 58
    },
    shoreline: {
      display: 'Resort Beach',
      subtext: 'Shared Private Club Beach Access',
      percentage: 60
    },
    security: {
      display: 'Tower Access',
      subtext: 'Dedicated Biometric High-Speed Lifts',
      percentage: 90
    },
    taxAdvantage: {
      display: '0% Personal Tax',
      subtext: '10-Year Golden Investor Residence Visa',
      percentage: 92
    }
  }
];

export const BenchmarkMatrix: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="benchmark"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/5 overflow-hidden"
      aria-label="Global Benchmark Matrix"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A24B]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
            <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase">
              Global Trophy Asset Benchmark
            </span>
          </div>

          <TextReveal
            text="How It Compares"
            as="h2"
            className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight leading-tight mb-4"
          />

          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl">
            Evaluating capital efficiency, coastal sovereignty, and structural privacy across the world's most distinguished ultra-prime enclaves.
          </p>
        </div>

        {/* Comparison Table Container with Horizontal Scroll on Mobile */}
        <div className="relative rounded-2xl bg-white/[0.015] border border-white/10 backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="overflow-x-auto scrollbar-none">
            <div className="min-w-[840px] lg:min-w-full">
              {/* Header Row: Columns */}
              <div className="grid grid-cols-5 border-b border-white/10 bg-black/40">
                <div className="p-3.5 sm:p-4 lg:p-5 flex flex-col justify-end">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Comparative Metric
                  </span>
                </div>

                {BENCHMARK_COLUMNS.map((col) => (
                  <div
                    key={col.id}
                    className={`p-3.5 sm:p-4 lg:p-5 transition-all ${
                      col.isFeatured
                        ? 'bg-[#C9A24B]/10 border-x border-[#C9A24B]/40 relative'
                        : 'border-r border-white/5'
                    }`}
                  >
                    {col.isFeatured && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A24B] text-black text-[10px] font-mono font-semibold uppercase tracking-wider mb-2">
                        <Award className="w-3 h-3" />
                        <span>Our Listing</span>
                      </div>
                    )}
                    <h3 className={`font-display text-sm sm:text-base font-medium ${col.isFeatured ? 'text-[#DFBF6D]' : 'text-white'}`}>
                      {col.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-mono text-stone-400 mt-0.5">
                      {col.location}
                    </p>
                  </div>
                ))}
              </div>

              {/* Row 1: Price per Sq Ft */}
              <div className="grid grid-cols-5 border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                <div className="p-3.5 sm:p-4 lg:p-5 flex items-center gap-3">
                  <Coins className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Price per Sq Ft</div>
                    <div className="text-[11px] font-mono text-stone-400">Value Efficiency</div>
                  </div>
                </div>

                {BENCHMARK_COLUMNS.map((col) => (
                  <div
                    key={`price-${col.id}`}
                    className={`p-3.5 sm:p-4 lg:p-5 flex flex-col justify-center ${
                      col.isFeatured ? 'bg-[#C9A24B]/5 border-x border-[#C9A24B]/30' : 'border-r border-white/5'
                    }`}
                  >
                    <span className={`text-sm sm:text-base font-display font-medium ${col.isFeatured ? 'text-[#DFBF6D]' : 'text-white'}`}>
                      {col.pricePerSqFt.display}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                      {col.pricePerSqFt.subtext}
                    </span>

                    {/* Animated Fill Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          col.isFeatured
                            ? 'bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] shadow-[0_0_10px_#C9A24B]'
                            : 'bg-stone-500'
                        }`}
                        style={{
                          width: isVisible ? `${col.pricePerSqFt.percentage}%` : '0%',
                          transitionDelay: '150ms'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Private Shoreline Frontage */}
              <div className="grid grid-cols-5 border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                <div className="p-3.5 sm:p-4 lg:p-5 flex items-center gap-3">
                  <Anchor className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Private Shoreline Frontage</div>
                    <div className="text-[11px] font-mono text-stone-400">Ocean Access Rights</div>
                  </div>
                </div>

                {BENCHMARK_COLUMNS.map((col) => (
                  <div
                    key={`shore-${col.id}`}
                    className={`p-3.5 sm:p-4 lg:p-5 flex flex-col justify-center ${
                      col.isFeatured ? 'bg-[#C9A24B]/5 border-x border-[#C9A24B]/30' : 'border-r border-white/5'
                    }`}
                  >
                    <span className={`text-sm sm:text-base font-display font-medium ${col.isFeatured ? 'text-[#DFBF6D]' : 'text-white'}`}>
                      {col.shoreline.display}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                      {col.shoreline.subtext}
                    </span>

                    {/* Animated Fill Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          col.isFeatured
                            ? 'bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] shadow-[0_0_10px_#C9A24B]'
                            : 'bg-stone-500'
                        }`}
                        style={{
                          width: isVisible ? `${col.shoreline.percentage}%` : '0%',
                          transitionDelay: '300ms'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 3: Security Perimeter */}
              <div className="grid grid-cols-5 border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                <div className="p-3.5 sm:p-4 lg:p-5 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Security Perimeter</div>
                    <div className="text-[11px] font-mono text-stone-400">Tactical Sovereignty</div>
                  </div>
                </div>

                {BENCHMARK_COLUMNS.map((col) => (
                  <div
                    key={`sec-${col.id}`}
                    className={`p-3.5 sm:p-4 lg:p-5 flex flex-col justify-center ${
                      col.isFeatured ? 'bg-[#C9A24B]/5 border-x border-[#C9A24B]/30' : 'border-r border-white/5'
                    }`}
                  >
                    <span className={`text-sm sm:text-base font-display font-medium ${col.isFeatured ? 'text-[#DFBF6D]' : 'text-white'}`}>
                      {col.security.display}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                      {col.security.subtext}
                    </span>

                    {/* Animated Fill Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          col.isFeatured
                            ? 'bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] shadow-[0_0_10px_#C9A24B]'
                            : 'bg-stone-500'
                        }`}
                        style={{
                          width: isVisible ? `${col.security.percentage}%` : '0%',
                          transitionDelay: '450ms'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 4: Tax Residency Advantage */}
              <div className="grid grid-cols-5 hover:bg-white/[0.01] transition-colors">
                <div className="p-3.5 sm:p-4 lg:p-5 flex items-center gap-3">
                  <Building className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Tax Residency Advantage</div>
                    <div className="text-[11px] font-mono text-stone-400">Fiscal Autonomy</div>
                  </div>
                </div>

                {BENCHMARK_COLUMNS.map((col) => (
                  <div
                    key={`tax-${col.id}`}
                    className={`p-3.5 sm:p-4 lg:p-5 flex flex-col justify-center ${
                      col.isFeatured ? 'bg-[#C9A24B]/5 border-x border-[#C9A24B]/30' : 'border-r border-white/5'
                    }`}
                  >
                    <span className={`text-sm sm:text-base font-display font-medium ${col.isFeatured ? 'text-[#DFBF6D]' : 'text-white'}`}>
                      {col.taxAdvantage.display}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">
                      {col.taxAdvantage.subtext}
                    </span>

                    {/* Animated Fill Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          col.isFeatured
                            ? 'bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] shadow-[0_0_10px_#C9A24B]'
                            : 'bg-stone-500'
                        }`}
                        style={{
                          width: isVisible ? `${col.taxAdvantage.percentage}%` : '0%',
                          transitionDelay: '600ms'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Required One-Line Disclaimer */}
        <div className="mt-5 text-center sm:text-left">
          <p className="text-[11px] font-mono text-stone-400 tracking-wide">
            Note: All comparative metrics, listing titles, and benchmark figures are illustrative and compiled from private market records to demonstrate comparative value density.
          </p>
        </div>
      </div>
    </section>
  );
};
