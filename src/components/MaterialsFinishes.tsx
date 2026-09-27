import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, ShieldCheck, ZoomIn } from 'lucide-react';
import { TextReveal } from './TextReveal';

interface MaterialItem {
  id: string;
  name: string;
  classification: string;
  provenance: string;
  treatment: string;
  image: string;
  textureHint: string;
}

const MATERIALS_DATA: MaterialItem[] = [
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold Italian Marble',
    classification: 'Italian Metamorphic Stone',
    provenance: 'Quarried in Carrara, Italy · Bookmatched slabs with warm gold veining and radiant subfloor heating calibration.',
    treatment: 'Honed Satin Finish · Fluoropolymer Nano-Seal',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Warm gold & charcoal veining over crystalline white ground'
  },
  {
    id: 'bronzed-brass',
    name: 'Hand-Brushed Bronzed Brass',
    classification: 'Architectural Metallurgical Alloy',
    provenance: 'Hand-finished in Tuscany · Custom metallurgical patina crafted to age gracefully under maritime ocean mist.',
    treatment: 'Directional Hand-Brush · Micro-Wax Passive Sealing',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Linear satin grain with deep warm amber specular reflections'
  },
  {
    id: 'smoked-oak',
    name: 'French Smoked Oak Herringbone',
    classification: 'Burgundian Engineered Hardwood',
    provenance: 'Harvested from Burgundy reserves · Naturally fumed with tree tannins and wire-brushed for deep thermal warmth.',
    treatment: 'Organic Tannin Smoked · Breathable Matte Hard-Wax Oil',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Tight European grain with charcoal undertones and tactile wire relief'
  },
  {
    id: 'fluted-cedar',
    name: 'Acoustic Fluted Cedar',
    classification: 'Acoustic Architectural Millwork',
    provenance: 'Old-growth Western Red Cedar · Micro-perforated acoustic baffling that neutralizes maritime ocean reverberation.',
    treatment: '18mm Convex Fluting · Zero-VOC Matte Fire-Retardant Finish',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Vertical shadow fluting with natural cedar aromatics'
  },
  {
    id: 'honed-travertine',
    name: 'Honed Travertine',
    classification: 'Tivoli Geothermal Sedimentary Stone',
    provenance: 'Quarried in Tivoli, Italy · Cross-cut honed surface with natural geothermal fissures sealed with volcanic powder.',
    treatment: 'Cross-Cut Honed · Slip-Resistant Maritime Acid-Wash',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Earthy cream-sand striations with micro-cavity volcanic fills'
  },
  {
    id: 'brushed-quartzite',
    name: 'Brushed Quartzite',
    classification: 'Metamorphic Crystal Slab',
    provenance: 'Extracted from Bahia, Brazil · Ultra-dense translucent crystal matrix calibrated for internal 2700K ambient illumination.',
    treatment: 'Diamond-Brushed Texture · Precision Backlight Calibration',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80',
    textureHint: 'Luminous crystalline depth with high scratch and heat immunity'
  }
];

export const MaterialsFinishes: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/5 overflow-hidden"
      aria-label="Materials and Finishes Showcase"
    >
      {/* Subtle Ambient Gold Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A24B]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
            <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase">
              Architectural Specifications & Provenance
            </span>
          </div>

          <TextReveal
            text="Crafted From the Finest"
            as="h2"
            className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight leading-tight mb-4"
          />

          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl">
            Every surface of The Cliffside Villa has been sourced from generational European quarries and artisan workshops, chosen for enduring tactile permanence, low environmental impact, and acoustic harmony.
          </p>
        </div>

        {/* 6 Material Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MATERIALS_DATA.map((mat, idx) => {
            const delayMs = idx * 100;
            return (
              <div
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className={`group relative rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#C9A24B]/60 p-5 sm:p-6 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm hover:shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(201,162,75,0.15)] flex flex-col justify-between ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${delayMs}ms`
                }}
              >
                {/* Top Image Container with Soft Zoom */}
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 bg-[#0e1017] border border-white/5">
                    <img
                      src={mat.image}
                      alt={mat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient Overlay for Macro Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Classification Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-stone-300">
                      {mat.classification}
                    </div>

                    {/* Subtle Zoom Hint Icon */}
                    <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#DFBF6D] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Material Name */}
                  <h3 className="text-lg sm:text-xl font-display font-medium text-white group-hover:text-[#DFBF6D] transition-colors mb-2.5">
                    {mat.name}
                  </h3>

                  {/* One-Line Provenance Note */}
                  <p className="text-xs sm:text-[13px] text-stone-300 font-light leading-relaxed mb-4">
                    {mat.provenance}
                  </p>
                </div>

                {/* Treatment / Specification Footnote */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{mat.treatment}</span>
                  </span>
                  <span className="text-[#C9A24B] opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for In-Depth Macro Inspection */}
        {selectedMaterial && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn"
            onClick={() => setSelectedMaterial(null)}
          >
            <div
              className="relative max-w-xl w-full rounded-2xl bg-[#0e1017] border border-[#C9A24B]/70 p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(201,162,75,0.2)] text-left max-h-[90vh] overflow-y-auto scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 border border-white/10">
                <img
                  src={selectedMaterial.image}
                  alt={selectedMaterial.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 text-xs font-mono text-[#DFBF6D]">
                  {selectedMaterial.textureHint}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#C9A24B] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{selectedMaterial.classification}</span>
              </div>

              <h4 className="text-2xl font-display font-medium text-white mb-3">
                {selectedMaterial.name}
              </h4>

              <p className="text-sm text-stone-300 leading-relaxed font-light mb-6">
                {selectedMaterial.provenance}
              </p>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-6 text-xs text-stone-300 flex items-center justify-between">
                <span className="font-mono text-stone-400">Surface Engineering</span>
                <span className="text-white font-medium">{selectedMaterial.treatment}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="w-full py-3 rounded-xl bg-[#C9A24B] hover:bg-[#DFBF6D] text-black font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close Specimen Detail
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
