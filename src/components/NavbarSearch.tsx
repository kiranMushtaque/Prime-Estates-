import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, MapPin, Sparkles, ArrowRight, Bed, Bath } from 'lucide-react';
import { FEATURED_PROPERTIES } from '../data/realEstateData';
import { Property } from '../types';

interface NavbarSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProperty?: (propertyTitle: string) => void;
}

const PREMIER_ENCLAVES = ['Coral Ridge', 'Marina Crest', 'Palm Heights', 'Old Harbour'];

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSelectProperty
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter listings dynamically based on title, district, location, tag or features
  const matchingProperties = useMemo(() => {
    if (!searchQuery.trim()) {
      return FEATURED_PROPERTIES.slice(0, 4);
    }
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

  const scrollToFeatured = () => {
    const featuredEl = document.getElementById('featured');
    if (featuredEl) {
      const winWithLenis = window as unknown as { lenis?: { scrollTo: (target: HTMLElement, opts?: { duration?: number }) => void } };
      if (winWithLenis.lenis) {
        winWithLenis.lenis.scrollTo(featuredEl, { duration: 1.2 });
      } else {
        featuredEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectEnclave = (enclave: string) => {
    onSearchChange(enclave);
    setIsOpen(false);
    scrollToFeatured();
  };

  const handleSelectProperty = (property: Property) => {
    onSearchChange(property.title);
    onSelectProperty?.(property.title);
    setIsOpen(false);
    scrollToFeatured();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      scrollToFeatured();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-[#C9A24B] flex items-center justify-center">
          <Search className="w-3.5 h-3.5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search name or neighborhood..."
          aria-label="Search listings by name or neighborhood"
          className="w-32 sm:w-40 md:w-48 lg:w-52 xl:w-56 focus:w-44 sm:focus:w-52 md:focus:w-60 lg:focus:w-64 transition-all duration-300 bg-white/5 hover:bg-white/10 focus:bg-[#090a0f] border border-white/10 focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B]/40 rounded-full py-1.5 pl-8.5 pr-7 text-xs text-white placeholder-stone-400 outline-none backdrop-blur-md font-sans"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-0.5 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-3 h-3" />
          </button>
        ) : null}
      </div>

      {/* Dynamic Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 sm:right-auto sm:left-0 w-80 sm:w-96 rounded-2xl bg-[#090a0f]/95 border border-[#C9A24B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,162,75,0.25)] backdrop-blur-2xl p-4 z-50 animate-fadeIn">
          {/* Section 1: Quick Enclave filters */}
          <div className="mb-3.5 pb-3 border-b border-white/10">
            <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400 block mb-2">
              Filter by Enclave
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {PREMIER_ENCLAVES.map((enclave) => {
                const isSelected = searchQuery.toLowerCase() === enclave.toLowerCase();
                return (
                  <button
                    key={enclave}
                    type="button"
                    onClick={() => handleSelectEnclave(enclave)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C9A24B] text-black border-[#C9A24B] font-semibold'
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-[#DFBF6D] border-white/10 hover:border-[#C9A24B]/40'
                    }`}
                  >
                    {enclave}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dynamic Matching Residences List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400">
                {searchQuery.trim() ? (
                  <>
                    Matches ({matchingProperties.length})
                  </>
                ) : (
                  'Featured Enclave Residences'
                )}
              </span>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    scrollToFeatured();
                  }}
                  className="text-[10px] font-mono text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {matchingProperties.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {matchingProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => handleSelectProperty(prop)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A24B]/15 border border-white/5 hover:border-[#C9A24B]/40 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
                      {prop.imageUrl ? (
                        <img
                          src={prop.imageUrl}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C9A24B]">
                          <MapPin className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-serif font-medium text-white truncate group-hover:text-[#DFBF6D] transition-colors">
                          {prop.title}
                        </h5>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 border border-white/10 text-[#DFBF6D] font-mono shrink-0">
                          {prop.district}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-0.5">
                        <span className="text-stone-300 font-medium">
                          {prop.priceFormatted}
                        </span>
                        <span className="text-stone-400 font-mono text-[10px] flex items-center gap-1.5">
                          <span>{prop.bedrooms} Bed</span>
                          <span>·</span>
                          <span>{prop.bathrooms} Bath</span>
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#C9A24B] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-stone-400">
                <MapPin className="w-6 h-6 text-[#C9A24B]/60 mx-auto mb-2" />
                <p className="text-xs">No residences match &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-[10px] text-stone-500 mt-1">
                  Try searching for Coral Ridge, Marina Crest, or Palm Heights
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Bottom Action prompt */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-400">
            <span>Press Enter to explore in listings</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                scrollToFeatured();
              }}
              className="text-[#DFBF6D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Listings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
