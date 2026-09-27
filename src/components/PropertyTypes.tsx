import React, { useRef, useState } from 'react';
import { PROPERTY_TYPES } from '../data/realEstateData';
import { PropertyTypeCategory } from '../types';
import { Home, Building2, Compass, Briefcase, ArrowUpRight } from 'lucide-react';
import { TextReveal } from './TextReveal';

interface TiltCardProps {
  item: PropertyTypeCategory;
  index: number;
  onSelect: (typeId: string) => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ item, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glareStyle, setGlareStyle] = useState<string>('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle(
      `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(201, 162, 75, 0.15), transparent 60%)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle('none');
  };

  const renderIcon = () => {
    switch (item.iconName) {
      case 'Home':
        return <Home className="w-6 h-6 text-[#C9A24B]" />;
      case 'Building':
        return <Building2 className="w-6 h-6 text-[#C9A24B]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#C9A24B]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-[#C9A24B]" />;
      default:
        return <Home className="w-6 h-6 text-[#C9A24B]" />;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item.id)}
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        willChange: 'transform'
      }}
      className="group relative cursor-pointer rounded-2xl p-5 sm:p-7 bg-[#12141c]/80 border border-white/10 hover:border-[#C9A24B]/60 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between min-h-[290px] sm:min-h-[330px]"
    >
      {/* Glare spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
        style={{ background: glareStyle }}
      />

      {/* Background subtle watermark & motif */}
      <div className="absolute top-4 right-4 text-stone-600/30 font-serif text-5xl select-none font-bold">
        0{index + 1}
      </div>

      <div>
        {/* Icon & Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {renderIcon()}
          </div>
          <span className="text-xs font-mono text-[#DFBF6D] bg-[#C9A24B]/10 px-3 py-1 rounded-full border border-[#C9A24B]/20">
            {item.count}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-serif text-2xl font-bold text-white mb-1 group-hover:text-[#DFBF6D] transition-colors">
          {item.title}
        </h3>
        <p className="text-xs uppercase tracking-wider text-[#C9A24B] font-mono mb-3">
          {item.subtitle}
        </p>

        {/* Description */}
        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-5">
          {item.description}
        </p>

        {/* Feature bullets */}
        <div className="space-y-1.5 pt-3 border-t border-white/5">
          {item.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer of Card */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="block text-[11px] text-stone-400 font-mono uppercase">Starting From</span>
          <span className="text-sm font-semibold text-white">{item.avgPrice}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C9A24B] group-hover:text-black transition-colors">
          <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-black" />
        </div>
      </div>
    </div>
  );
};

export const PropertyTypes: React.FC<{ onFilterSelect?: (type: string) => void }> = ({ onFilterSelect }) => {
  return (
    <section id="properties" className="relative py-28 px-6 bg-[#090a0f] text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A24B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
            AZURE BAY PORTFOLIO
          </span>
          <div className="mb-4">
            <TextReveal
              text="Curated Architectural Enclaves"
              as="h2"
              className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight"
            />
          </div>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            From ocean-facing cliffside villas to sky penthouses and high-yield marina hubs, explore verified luxury holdings across Azure Bay's celebrated coastline.
          </p>
        </div>

        {/* 4 Glass Cards Grid with Parallax & Hover Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROPERTY_TYPES.map((item, idx) => (
            <TiltCard
              key={item.id}
              item={item}
              index={idx}
              onSelect={(id) => {
                onFilterSelect?.(id);
                const featuredEl = document.getElementById('featured');
                featuredEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
