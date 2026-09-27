import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { TextReveal } from './TextReveal';

interface LookbookItem {
  id: string;
  name: string;
  atelier: string;
  category: string;
  description: string;
  image: string;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'sectional',
    name: 'Aethelgard Monolith Modular Sectional',
    atelier: 'Atelier Verrone (Bespoke Commission)',
    category: 'Living Atrium',
    description: 'Custom low-profile Italian modular seating enveloped in cashmere-bouclé upholstery with concealed walnut plinth.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'kitchen-suite',
    name: 'Atelier Solis Induction & Teppanyaki Suite',
    atelier: 'Solis Metallics (Custom Fabricated)',
    category: 'Gourmet Kitchen',
    description: 'Seamless flush-mounted matte obsidian ceramic induction cooktops with integrated magnetic downdraft extraction.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'pendant-lighting',
    name: 'Cascata Molten Amber Chandeliers',
    atelier: 'Vetreria Aurelia (Venice Atelier)',
    category: 'Dining Atrium',
    description: 'Eighteen hand-blown molten amber glass spheres suspended at undulating architectural heights with gold braided wiring.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'sculpture',
    name: 'Elysian Form No. IV Bronze Monolith',
    atelier: 'Studio Valen (Commission 1 of 1)',
    category: 'Entrance Portal',
    description: 'One-of-one cast bronze monolithic sculpture commissioned exclusively for the double-height entrance atrium.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'silk-rug',
    name: 'Mirage Hand-Knotted Silk & Wool Tapestry',
    atelier: 'Atelier Kashan (Generational Master)',
    category: 'Master Suite',
    description: 'Artisan hand-knotted 300-knot Himalayan wool and raw mulberry silk floor tapestry evoking ocean wave contours.',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'watercraft-fixtures',
    name: 'Aurelia Concealed Watercraft Fixtures',
    atelier: 'Fontana di Luce (Custom Lathed)',
    category: 'Spa Bath Suite',
    description: 'Fluted bronzed architectural faucets with touchless laminar flow technology and concealed quiet aerators.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'credenza',
    name: 'Vesper Smoked Eucalyptus & Travertine Credenza',
    atelier: 'Vesper Studio (Hand-Carved)',
    category: 'Formal Dining',
    description: 'Sculptural floating dining credenza crafted from dark figured eucalyptus and hand-relieved travertine fascia.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'audio-sanctuary',
    name: 'Sonus Archival Ribbon Audio Sanctuary',
    atelier: 'Sonus Acustica (Acoustic Engineering)',
    category: 'Listening Lounge',
    description: 'Flush architectural planar ribbon transducers calibrated specifically to the spatial acoustics of the living room.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80'
  }
];

export const DesignerLookbook: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollByAmount = (amount: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag-to-scroll mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="lookbook"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/5 overflow-hidden"
      aria-label="Curated Furnishings and Art Lookbook"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header + Nav Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
              <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase">
                Turnkey Interior Atelier
              </span>
            </div>

            <TextReveal
              text="Curated Furnishings & Art"
              as="h2"
              className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight leading-tight mb-4"
            />

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Available as a fully furnished turnkey acquisition. Each bespoke piece was commissioned from European ateliers specifically to complement the villa's oceanfront volumes.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs font-mono text-stone-400 mr-2">
              Drag or Swipe
            </span>
            <button
              type="button"
              onClick={() => scrollByAmount(-380)}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-[#C9A24B]/50 bg-black/60 text-[#DFBF6D] hover:bg-[#C9A24B] hover:text-black hover:border-[#C9A24B]'
                  : 'border-white/10 bg-white/[0.02] text-stone-600 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous bespoke items"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(380)}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-[#C9A24B]/50 bg-black/60 text-[#DFBF6D] hover:bg-[#C9A24B] hover:text-black hover:border-[#C9A24B]'
                  : 'border-white/10 bg-white/[0.02] text-stone-600 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next bespoke items"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Drag/Swipe Carousel Container */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {/* Edge Fades for Ultra-Smooth Visual Continuity */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#090a0f] to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#090a0f] to-transparent pointer-events-none z-20" />

          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {LOOKBOOK_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                className="group relative flex-none w-[300px] sm:w-[360px] snap-start rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#C9A24B]/60 p-5 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(201,162,75,0.15)] flex flex-col justify-between"
              >
                <div>
                  {/* Photo with subtle Ken-burns zoom */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-5 bg-[#0e1017] border border-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-106 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Room Category Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#DFBF6D]">
                      {item.category}
                    </div>

                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-stone-400 bg-black/60 px-2 py-0.5 rounded">
                      0{idx + 1} / 08
                    </div>
                  </div>

                  {/* Atelier Origin */}
                  <span className="text-[11px] font-mono text-[#C9A24B] tracking-wide block mb-1">
                    {item.atelier}
                  </span>

                  {/* Item Name */}
                  <h3 className="text-lg font-display font-medium text-white group-hover:text-[#DFBF6D] transition-colors mb-2.5 leading-snug">
                    {item.name}
                  </h3>

                  {/* One-Line Description */}
                  <p className="text-xs sm:text-[13px] text-stone-300 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Status Footnote */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Compass className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>Included in Turnkey Sale</span>
                  </span>
                  <span className="text-[#C9A24B] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
