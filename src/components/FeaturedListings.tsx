import React, { useRef, useState, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { FEATURED_PROPERTIES } from '../data/realEstateData';
import { Property } from '../types';
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize2, MapPin, X, Eye, Phone, MessageSquare, Heart } from 'lucide-react';
import { TextReveal } from './TextReveal';

gsap.registerPlugin(Flip);

interface FeaturedListingsProps {
  onScheduleViewing: (propertyTitle: string) => void;
  favorites?: string[];
  onToggleFavorite?: (propertyId: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectNeighborhood?: (neighborhood: string) => void;
}

interface PropertyCardProps {
  prop: Property;
  isFavorite: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  onSelect: (property: Property) => void;
}

/**
 * Tactile, magnetic-like 3D tilt property card with context-aware GSAP transforms
 * and dynamic specular gold lighting.
 */
const FeaturedPropertyCard: React.FC<PropertyCardProps> = ({
  prop,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  // QuickTo animators for 60/120fps fluid cursor tracking
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotYTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window)
    ) {
      isTouchRef.current = true;
    }

    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      // Set perspective and transform style on parent for 3D depth
      gsap.set(cardRef.current, {
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      });

      xTo.current = gsap.quickTo(cardRef.current, 'x', { duration: 0.3, ease: 'power2.out' });
      yTo.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.3, ease: 'power2.out' });
      rotXTo.current = gsap.quickTo(cardRef.current, 'rotationX', { duration: 0.3, ease: 'power2.out' });
      rotYTo.current = gsap.quickTo(cardRef.current, 'rotationY', { duration: 0.3, ease: 'power2.out' });
      scaleTo.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.3, ease: 'power2.out' });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current || !cardRef.current) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    // Normalized coordinates from -1 to +1
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Subtle magnetic attraction (pull card up to ±7px toward mouse)
    const magneticX = normX * 7;
    const magneticY = normY * 7;

    // Subtle 3D angular tilt (weighted luxury feel, max ±5.5 degrees)
    const tiltX = -normY * 5.5;
    const tiltY = normX * 5.5;

    if (xTo.current && yTo.current && rotXTo.current && rotYTo.current && scaleTo.current) {
      xTo.current(magneticX);
      yTo.current(magneticY);
      rotXTo.current(tiltX);
      rotYTo.current(tiltY);
      scaleTo.current(1.025);
    }

    // Dynamic specular gold glare tracking the cursor position
    if (glareRef.current) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle 300px at ${glareX}% ${glareY}%, rgba(223, 191, 109, 0.16), transparent 75%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current || !cardRef.current) return;
    const el = cardRef.current;

    gsap.to(el, {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      data-flip-id={`prop-card-${prop.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="featured-property-card snap-start shrink-0 w-[340px] sm:w-[400px] rounded-2xl bg-[#12141c]/90 border border-white/10 hover:border-[#C9A24B]/60 transition-colors duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col group relative will-change-transform"
      style={{ willChange: 'transform' }}
    >
      {/* Specular Interactive Glare Highlight */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 opacity-0"
      />

      {/* Architectural Visual Container */}
      <div className={`relative h-60 w-full bg-gradient-to-br ${prop.imageFallbackGradient} overflow-hidden`}>
        {prop.imageUrl ? (
          <img
            src={prop.imageUrl}
            alt={prop.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-mono uppercase tracking-widest">
            Architectural Render
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-black/30" />

        {/* Status / Category Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-[#DFBF6D]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
          <span>{prop.tag}</span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(prop.id);
          }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg z-20 ${
            isFavorite
              ? 'bg-[#C9A24B] border-[#C9A24B] text-black scale-105'
              : 'bg-black/60 border-white/20 text-white/70 hover:text-white hover:border-[#C9A24B]/50'
          }`}
          aria-label={isFavorite ? 'Remove from saved' : 'Save to favorites'}
          title={isFavorite ? 'Saved' : 'Save'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-black text-black' : 'fill-none'
            }`}
          />
        </button>

        {/* Price pill */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xl font-bold font-serif text-white tracking-tight drop-shadow-md">
            {prop.priceFormatted}
          </span>
        </div>
      </div>

      {/* Information Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#C9A24B] font-mono mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{prop.location}</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-[#DFBF6D] transition-colors">
            {prop.title}
          </h3>
          <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed mb-4 font-light">
            {prop.description}
          </p>
        </div>

        <div>
          {/* Property Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-xs mb-5 font-mono">
            <div className="flex flex-col items-center">
              <span className="text-stone-400 flex items-center gap-1 mb-0.5">
                <Bed className="w-3.5 h-3.5 text-[#C9A24B]" /> Beds
              </span>
              <span className="font-semibold text-white">{prop.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-stone-400 flex items-center gap-1 mb-0.5">
                <Bath className="w-3.5 h-3.5 text-[#C9A24B]" /> Baths
              </span>
              <span className="font-semibold text-white">{prop.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-stone-400 flex items-center gap-1 mb-0.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#C9A24B]" /> Area
              </span>
              <span className="font-semibold text-white">{prop.area}</span>
            </div>
          </div>

          {/* View Details CTA */}
          <button
            type="button"
            onClick={() => onSelect(prop)}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#C9A24B] hover:text-black border border-white/15 hover:border-[#C9A24B] text-xs font-semibold tracking-wider uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-[0_4px_15px_rgba(201,162,75,0.25)]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({
  onScheduleViewing,
  favorites = [],
  onToggleFavorite,
  searchQuery = '',
  onClearSearch,
  onSelectNeighborhood
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Dynamically filter listings by title, district, location, tag or features
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return FEATURED_PROPERTIES;
    const q = searchQuery.toLowerCase().trim();
    return FEATURED_PROPERTIES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // GSAP Flip animation when search filters change the card list
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.querySelectorAll('.featured-property-card');
    if (cards.length > 0) {
      Flip.from(Flip.getState(cards), {
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.04,
        scale: true,
      });
    }
  }, [filteredProperties]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -420 : 420;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const openWhatsApp = (prop: Property) => {
    const text = encodeURIComponent(
      `Hello Meridian Estates, I am interested in inquiring about "${prop.title}" in ${prop.location} listed for ${prop.priceFormatted}. Please share details and arrange a private tour.`
    );
    window.open(`https://wa.me/920000000000?text=${text}`, '_blank');
  };

  return (
    <section id="featured" className="py-24 bg-[#090a0f] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
            PREMIER RESIDENCES · AZURE BAY
          </span>
          <div className="mb-1">
            <TextReveal
              text="Featured Listings"
              as="h2"
              className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight"
            />
          </div>
          <p className="text-stone-300 text-sm mt-2 max-w-xl">
            Swipe through handpicked turnkey estates and prime penthouses currently open for discrete private acquisitions.
          </p>
        </div>

        {/* Scroll navigation controls */}
        {filteredProperties.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-[#C9A24B] hover:text-black hover:border-[#C9A24B] transition-all flex items-center justify-center text-white cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-[#C9A24B] hover:text-black hover:border-[#C9A24B] transition-all flex items-center justify-center text-white cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Active Search & Filter Indicator */}
      {searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="p-3.5 rounded-xl bg-[#12141c] border border-[#C9A24B]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-[#DFBF6D]">
              <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-pulse" />
              <span>
                Filtered by &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;
              </span>
              <span className="text-stone-400">
                — {filteredProperties.length} {filteredProperties.length === 1 ? 'residence' : 'residences'} found
              </span>
            </div>
            <button
              type="button"
              onClick={onClearSearch}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State when no properties match search query */}
      {filteredProperties.length === 0 ? (
        <div className="max-w-2xl mx-auto px-6 py-16 text-center rounded-2xl bg-[#12141c]/60 border border-dashed border-[#C9A24B]/30 my-4 backdrop-blur-md">
          <MapPin className="w-10 h-10 text-[#C9A24B] mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-serif font-bold text-white mb-2">No residences found</h3>
          <p className="text-stone-300 text-xs mb-6 max-w-md mx-auto leading-relaxed">
            No properties in Azure Bay matched &ldquo;{searchQuery}&rdquo;. Try browsing our celebrated coastal enclaves:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {['Coral Ridge', 'Marina Crest', 'Palm Heights', 'Old Harbour'].map((enclave) => (
              <button
                key={enclave}
                type="button"
                onClick={() => onSelectNeighborhood?.(enclave)}
                className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#C9A24B] hover:text-[#DFBF6D] text-xs font-mono text-stone-200 transition-colors cursor-pointer"
              >
                {enclave}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClearSearch}
            className="px-5 py-2 rounded-full bg-[#C9A24B] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#DFBF6D] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Horizontal-Scroll Row with 3D Perspective Context */
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 px-6 max-w-7xl mx-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', perspective: 1200 }}
        >
          {filteredProperties.map((prop) => (
            <FeaturedPropertyCard
              key={prop.id}
              prop={prop}
              isFavorite={favorites.includes(prop.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={(p) => setSelectedProperty(p)}
            />
          ))}
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#12141c] border border-[#C9A24B]/40 rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Preview if available */}
            {selectedProperty.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-white/10">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs font-mono text-[#C9A24B] uppercase tracking-wider block mb-1">
                {selectedProperty.district} · {selectedProperty.tag}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">
                {selectedProperty.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>{selectedProperty.location}</span>
              </div>
            </div>

            {/* Price Badge */}
            <div className="p-4 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-between mb-6">
              <div>
                <span className="text-stone-400 text-xs uppercase tracking-wider block">Asking Price (PKR)</span>
                <span className="font-serif text-2xl font-bold text-[#DFBF6D]">
                  {selectedProperty.priceFormatted}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                Verified CDA Clear
              </span>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <span className="text-stone-400 text-xs block">Bedrooms</span>
                <span className="text-base font-semibold text-white">{selectedProperty.bedrooms} En-Suite</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <span className="text-stone-400 text-xs block">Bathrooms</span>
                <span className="text-base font-semibold text-white">{selectedProperty.bathrooms}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <span className="text-stone-400 text-xs block">Plot & Covered</span>
                <span className="text-base font-semibold text-white">{selectedProperty.area}</span>
              </div>
            </div>

            {/* Architectural Features */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#C9A24B] mb-3">
                Key Architectural Amenities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                {selectedProperty.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-300 text-sm leading-relaxed mb-6 font-light">
              {selectedProperty.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onScheduleViewing(selectedProperty.title);
                  setSelectedProperty(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-lg"
              >
                <Phone className="w-4 h-4 text-black" />
                <span>Schedule Private Viewing</span>
              </button>

              <button
                onClick={() => openWhatsApp(selectedProperty)}
                className="py-3 px-5 rounded-xl bg-white/5 border border-[#C9A24B]/40 text-[#DFBF6D] hover:bg-[#C9A24B]/15 hover:border-[#C9A24B] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A24B]" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
