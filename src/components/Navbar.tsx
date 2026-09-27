import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MagneticButton } from './MagneticButton';
import {
  Heart,
  Sparkles,
  X,
  Menu,
  PhoneCall,
  Compass,
  Building2,
  Calculator,
  ChevronDown,
  ArrowRight,
  MapPin,
  Home,
  Building,
  Briefcase,
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NavbarSearch } from './NavbarSearch';
import { PROPERTY_TYPES, NEIGHBORHOODS, FEATURED_PROPERTIES } from '../data/realEstateData';

interface NavbarProps {
  onBookViewingClick: () => void;
  favoritesCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectProperty?: (propertyTitle: string) => void;
}

const NAV_SECTIONS = [
  { id: 'walkthrough', label: 'Walkthrough' },
  { id: 'properties', label: 'Residences', hasMegaMenu: true },
  { id: 'materials', label: 'Finishes' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'featured', label: 'Featured' },
  { id: 'map', label: 'Map', hideOnSmallXl: true },
  { id: 'neighborhoods', label: 'Enclaves', hideOnSmallXl: true },
  { id: 'benchmark', label: 'Comparison' },
  { id: 'calculator', label: 'Calculator', hideOnSmallXl: true },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onBookViewingClick,
  favoritesCount = 0,
  searchQuery = '',
  onSearchChange = () => {},
  onSelectProperty,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('walkthrough');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear pending close timers and open mega menu
  const handleMegaMenuEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  // Grace period before closing so cursor can move between nav and dropdown
  const handleMegaMenuLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 220);
  };

  // Smooth scroll handler using Lenis or native smooth scroll
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMegaMenuOpen(false);
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      const winWithLenis = window as unknown as { lenis?: { scrollTo: (target: HTMLElement, opts?: { duration?: number }) => void } };
      if (winWithLenis.lenis) {
        winWithLenis.lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  // Filter or jump to category
  const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
    setIsMegaMenuOpen(false);
    if (categoryId === 'villas') onSearchChange('Coral Ridge');
    else if (categoryId === 'apartments') onSearchChange('Marina Crest');
    else if (categoryId === 'plots') onSearchChange('Palm Heights');
    else if (categoryId === 'commercial') onSearchChange('Old Harbour');
    else onSearchChange(categoryTitle);

    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Jump to neighborhood
  const handleNeighborhoodSelect = (neighborhoodName: string) => {
    setIsMegaMenuOpen(false);
    onSearchChange(neighborhoodName);
    const el = document.getElementById('neighborhoods') || document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll listener for blur transition, scroll progress and section spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);

      // Calculate total reading/scroll progress
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / totalScrollable) * 100));
        setScrollProgress(pct);
      }

      // Detect active section for navigation highlighting
      const sectionElements = NAV_SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      const scrollPosition = scrollY + 200;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const featuredSpotlight = FEATURED_PROPERTIES[0];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled || isMegaMenuOpen
          ? 'bg-[#07080c]/95 backdrop-blur-2xl border-b border-[#C9A24B]/20 shadow-[0_10px_35px_rgba(0,0,0,0.65)] py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4 sm:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* Zone 1: Monogram Wordmark & Availability Telemetry */}
        <a
          href="#walkthrough"
          onClick={(e) => handleNavClick(e, 'walkthrough')}
          className="group flex items-center gap-2.5 sm:gap-3 shrink-0 select-none"
        >
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9A24B]/70 group-hover:border-[#DFBF6D] flex items-center justify-center font-serif text-[11px] sm:text-xs font-bold text-[#DFBF6D] bg-[#07080c]/90 transition-all duration-300 shadow-[0_0_12px_rgba(201,162,75,0.25)]">
              M
            </div>
            <div className="absolute inset-0 rounded-full bg-[#C9A24B]/20 blur-sm -z-10 group-hover:bg-[#C9A24B]/40 transition-colors" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-[#DFBF6D] transition-colors whitespace-nowrap">
              Meridian Estates
            </span>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-stone-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Azure Bay · 4 Sanctuaries Available</span>
            </div>
          </div>
        </a>

        {/* Zone 2: Navigation Links with Mega Menu Trigger */}
        <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[11px] 2xl:text-xs font-medium">
          {NAV_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;

            if (section.hasMegaMenu) {
              return (
                <div
                  key={section.id}
                  className="relative py-1.5"
                  onMouseEnter={handleMegaMenuEnter}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    className={`flex items-center gap-1 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive || isMegaMenuOpen
                        ? 'text-[#DFBF6D] font-semibold drop-shadow-[0_0_10px_rgba(201,162,75,0.4)]'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#C9A24B] transition-transform duration-300 ${
                        isMegaMenuOpen ? 'rotate-180 text-[#DFBF6D]' : ''
                      }`}
                    />
                  </a>
                  {/* Active micro indicator dot */}
                  {(isActive || isMegaMenuOpen) && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#DFBF6D] shadow-[0_0_6px_rgba(201,162,75,0.9)]" />
                  )}
                </div>
              );
            }

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleNavClick(e, section.id)}
                className={`relative py-1.5 transition-all duration-200 whitespace-nowrap ${
                  section.hideOnSmallXl ? 'hidden 2xl:inline' : 'inline'
                } ${
                  isActive
                    ? 'text-[#DFBF6D] font-semibold drop-shadow-[0_0_10px_rgba(201,162,75,0.4)]'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span>{section.label}</span>
                {/* Active micro indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#DFBF6D] shadow-[0_0_6px_rgba(201,162,75,0.9)]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Search, Replay Genesis, Favorites & Booking CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dynamic Search Bar (Desktop & Tablet) */}
          <div className="hidden sm:block">
            <NavbarSearch
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onSelectProperty={onSelectProperty}
            />
          </div>

          {/* Saved Favorites Indicator */}
          <a
            href="#featured"
            onClick={(e) => handleNavClick(e, 'featured')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A24B]/40 transition-all text-xs font-mono text-stone-200 hover:text-[#DFBF6D] cursor-pointer"
            title="Saved favorite residences"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                favoritesCount > 0
                  ? 'text-[#C9A24B] fill-[#C9A24B]'
                  : 'text-stone-400'
              }`}
            />
            <span className="hidden md:inline">Saved</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums transition-colors ${
                favoritesCount > 0
                  ? 'bg-[#C9A24B] text-black font-bold'
                  : 'bg-white/10 text-stone-400'
              }`}
            >
              {favoritesCount}
            </span>
          </a>

          {/* Primary Book Viewing CTA */}
          <MagneticButton
            onClick={onBookViewingClick}
            className="px-3.5 sm:px-5 py-2 sm:py-2 rounded-full bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black font-semibold text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_2px_15px_rgba(201,162,75,0.35)] cursor-pointer whitespace-nowrap shrink-0"
          >
            Book Viewing
          </MagneticButton>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#DFBF6D]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Global Reading / Scroll Progress Bar at the very bottom edge of navbar */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white/5 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#8C6D23] via-[#C9A24B] to-[#FFE082] transition-all duration-75 shadow-[0_0_8px_rgba(201,162,75,0.7)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH GLASSMORPHISM MEGA MENU (Desktop & Wide Displays) */}
      {/* ========================================================================= */}
      <div
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
        className={`navbar-mega-menu ${
          isMegaMenuOpen ? 'is-open' : ''
        } hidden xl:block absolute top-full inset-x-0 w-full transition-all duration-350 ease-out transform pointer-events-auto ${
          isMegaMenuOpen
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-3 invisible pointer-events-none'
        }`}
      >
        {/* Luminous Top Gold Horizon Rim */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DFBF6D] to-transparent shadow-[0_0_15px_rgba(223,191,109,0.7)]" />

        {/* Ambient Subtle Radial Gold Depth Fill */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,162,75,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* COLUMN 1: PROPERTY CATEGORIES (Architectural Typologies) */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '40ms' : '0ms',
                }}
                className={`flex items-center justify-between pb-2 border-b border-white/10 transition-all duration-300 ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-2 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Property Typologies</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">4 Sectors</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {PROPERTY_TYPES.map((type, index) => {
                  const Icon =
                    type.id === 'villas'
                      ? Home
                      : type.id === 'apartments'
                      ? Building
                      : type.id === 'plots'
                      ? Compass
                      : Briefcase;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleCategorySelect(type.id, type.title)}
                      style={{
                        '--link-index': index,
                        transitionDelay: isMegaMenuOpen ? `calc(${index} * 65ms + 60ms)` : '0ms',
                        animationDelay: isMegaMenuOpen ? `calc(${index} * 65ms + 60ms)` : '0ms',
                      } as React.CSSProperties}
                      className={`mega-category-link ${
                        isMegaMenuOpen ? 'is-visible' : ''
                      } group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/40 hover:bg-gradient-to-r hover:from-[#C9A24B]/15 hover:to-transparent text-left cursor-pointer transition-all duration-400 ease-out transform`}
                    >
                      <div className="p-2 rounded-lg bg-black/60 border border-white/10 group-hover/item:border-[#DFBF6D] group-hover/item:text-[#DFBF6D] group-hover/item:bg-[#C9A24B]/20 group-hover/item:shadow-[0_0_14px_rgba(201,162,75,0.35)] group-hover/item:scale-105 text-stone-400 transition-all duration-200 shrink-0">
                        <Icon className="w-4 h-4 transition-transform group-hover/item:rotate-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-serif font-medium text-white group-hover/item:text-[#DFBF6D] group-hover/item:translate-x-1 transition-all truncate">
                            {type.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#DFBF6D]/80 group-hover/item:text-[#DFBF6D] group-hover/item:translate-x-0.5 transition-all shrink-0">
                            {type.count}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 font-light truncate mt-0.5 group-hover/item:text-stone-300 transition-colors">
                          {type.subtitle}
                        </p>
                        <div className="text-[10px] font-mono text-stone-400 mt-1 group-hover/item:text-[#DFBF6D]/90 transition-colors">
                          {type.avgPrice}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <a
                href="#properties"
                onClick={(e) => handleNavClick(e, 'properties')}
                style={{
                  transitionDelay: isMegaMenuOpen ? '320ms' : '0ms',
                }}
                className={`mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-[#DFBF6D] hover:text-white transition-all duration-300 group ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span>Browse All 4 Architectural Portfolios</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* COLUMN 2: NEIGHBORHOOD ENCLAVES */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '60ms' : '0ms',
                }}
                className={`flex items-center justify-between pb-2 border-b border-white/10 transition-all duration-300 ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-2 font-semibold">
                  <Compass className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Premier Enclaves</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">Azure Bay</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {NEIGHBORHOODS.map((hood, index) => (
                  <button
                    key={hood.id}
                    type="button"
                    onClick={() => handleNeighborhoodSelect(hood.name)}
                    style={{
                      transitionDelay: isMegaMenuOpen ? `${100 + index * 55}ms` : '0ms',
                    }}
                    className={`group/hood flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/40 hover:bg-gradient-to-r hover:from-[#C9A24B]/10 hover:to-transparent text-left cursor-pointer transition-all duration-400 ease-out transform ${
                      isMegaMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 relative group-hover/hood:border-[#C9A24B]/50 transition-colors">
                      <img
                        src={hood.imageUrl}
                        alt={hood.name}
                        className="w-full h-full object-cover group-hover/hood:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover/hood:bg-transparent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-medium text-white group-hover/hood:text-[#DFBF6D] transition-colors truncate">
                          {hood.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">
                          {hood.transitTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-light truncate mt-0.5 group-hover/hood:text-stone-300 transition-colors">
                        {hood.district}
                      </p>
                      <div className="text-[10px] font-mono text-[#DFBF6D]/90 mt-1">
                        {hood.avgPriceKanal}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Additional 4th district link */}
                <button
                  type="button"
                  onClick={() => handleNeighborhoodSelect('Old Harbour')}
                  style={{
                    transitionDelay: isMegaMenuOpen ? `${100 + NEIGHBORHOODS.length * 55}ms` : '0ms',
                  }}
                  className={`group/hood flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/40 hover:bg-gradient-to-r hover:from-[#C9A24B]/10 hover:to-transparent text-left cursor-pointer transition-all duration-400 ease-out transform ${
                    isMegaMenuOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 relative bg-stone-900 flex items-center justify-center group-hover/hood:border-[#C9A24B]/50 transition-colors">
                    <MapPin className="w-5 h-5 text-[#DFBF6D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-serif font-medium text-white group-hover/hood:text-[#DFBF6D] transition-colors truncate">
                        Old Harbour
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        10 mins to Bay
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light truncate mt-0.5 group-hover/hood:text-stone-300 transition-colors">
                      Historic Maritime & Marina Docks
                    </p>
                    <div className="text-[10px] font-mono text-[#DFBF6D]/90 mt-1">
                      PKR 15 - 30 Crore
                    </div>
                  </div>
                </button>
              </div>

              <a
                href="#neighborhoods"
                onClick={(e) => handleNavClick(e, 'neighborhoods')}
                style={{
                  transitionDelay: isMegaMenuOpen ? '340ms' : '0ms',
                }}
                className={`mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-[#DFBF6D] hover:text-white transition-all duration-300 group ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span>View Full Enclave Geography & Vistas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* COLUMN 3: SPOTLIGHT MASTERPIECE RESIDENCE */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '80ms' : '0ms',
                }}
                className={`flex items-center justify-between pb-2 border-b border-white/10 transition-all duration-300 ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-2 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Spotlight Masterpiece</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Available</span>
              </div>

              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '160ms' : '0ms',
                }}
                className={`relative rounded-2xl overflow-hidden border border-[#C9A24B]/35 bg-black/60 group/card shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#DFBF6D] transition-all duration-500 ease-out transform ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={featuredSpotlight.imageUrl}
                    alt={featuredSpotlight.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/30 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C9A24B]/40 text-[9px] font-mono text-[#DFBF6D] uppercase tracking-wider">
                    {featuredSpotlight.tag}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-sm font-semibold text-white group-hover/card:text-[#DFBF6D] transition-colors">
                      {featuredSpotlight.title}
                    </h4>
                    <span className="font-serif text-xs font-bold text-[#DFBF6D]">
                      {featuredSpotlight.priceFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
                    <MapPin className="w-3 h-3 text-[#C9A24B]" />
                    <span>{featuredSpotlight.location}</span>
                  </div>

                  <p className="text-[11px] text-stone-400 font-light line-clamp-2 mt-0.5 leading-relaxed">
                    {featuredSpotlight.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        onSelectProperty?.(featuredSpotlight.title);
                        const el = document.getElementById('featured') || document.getElementById('walkthrough');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#C9A24B] hover:bg-[#DFBF6D] text-black font-semibold text-[11px] font-mono tracking-wider uppercase text-center transition-colors cursor-pointer"
                    >
                      Explore Residence
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        onBookViewingClick();
                      }}
                      className="py-1.5 px-2.5 rounded-lg border border-[#C9A24B]/40 hover:border-[#DFBF6D] text-[#DFBF6D] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                      title="Schedule viewing"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 4: EXPEDITION TOOLS & PRIVATE ADVISORY */}
            <div className="flex flex-col gap-4">
              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '100ms' : '0ms',
                }}
                className={`flex items-center justify-between pb-2 border-b border-white/10 transition-all duration-300 ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-[11px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-2 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Sanctuary Tools</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">Advisory</span>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="#map"
                  onClick={(e) => handleNavClick(e, 'map')}
                  style={{
                    transitionDelay: isMegaMenuOpen ? '180ms' : '0ms',
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/35 hover:bg-gradient-to-r hover:from-[#C9A24B]/10 hover:to-transparent transition-all duration-400 ease-out transform group/tool ${
                    isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 group-hover/tool:border-[#C9A24B]/50 text-stone-400 group-hover/tool:text-[#DFBF6D] transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-serif font-medium text-white group-hover/tool:text-[#DFBF6D] transition-colors">
                      Interactive Coastline GIS Map
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      Topographical pins & elevation curves
                    </div>
                  </div>
                </a>

                <a
                  href="#benchmark"
                  onClick={(e) => handleNavClick(e, 'benchmark')}
                  style={{
                    transitionDelay: isMegaMenuOpen ? '230ms' : '0ms',
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/35 hover:bg-gradient-to-r hover:from-[#C9A24B]/10 hover:to-transparent transition-all duration-400 ease-out transform group/tool ${
                    isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 group-hover/tool:border-[#C9A24B]/50 text-stone-400 group-hover/tool:text-[#DFBF6D] transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-serif font-medium text-white group-hover/tool:text-[#DFBF6D] transition-colors">
                      Global Benchmark Analysis
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      Cap rates vs Dubai & Singapore
                    </div>
                  </div>
                </a>

                <a
                  href="#calculator"
                  onClick={(e) => handleNavClick(e, 'calculator')}
                  style={{
                    transitionDelay: isMegaMenuOpen ? '280ms' : '0ms',
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#C9A24B]/35 hover:bg-gradient-to-r hover:from-[#C9A24B]/10 hover:to-transparent transition-all duration-400 ease-out transform group/tool ${
                    isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 group-hover/tool:border-[#C9A24B]/50 text-stone-400 group-hover/tool:text-[#DFBF6D] transition-colors">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-serif font-medium text-white group-hover/tool:text-[#DFBF6D] transition-colors">
                      Dual-Currency Yield Calculator
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      Amortization in PKR & USD
                    </div>
                  </div>
                </a>
              </div>

              {/* Private Client Desk Callout */}
              <div
                style={{
                  transitionDelay: isMegaMenuOpen ? '370ms' : '0ms',
                }}
                className={`mt-auto p-3.5 rounded-xl bg-gradient-to-br from-[#C9A24B]/20 via-black/85 to-black border border-[#C9A24B]/35 flex flex-col gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-400 ease-out transform ${
                  isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-serif font-semibold text-[#DFBF6D]">
                  <PhoneCall className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Private Wealth Advisory</span>
                </div>
                <p className="text-[10px] text-stone-300 font-light leading-relaxed">
                  Confidential acquisitions desk for family offices and sovereign clients.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsMegaMenuOpen(false);
                    onBookViewingClick();
                  }}
                  className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-[#C9A24B] hover:text-black border border-[#C9A24B]/40 transition-all text-[10px] font-mono uppercase tracking-wider text-[#DFBF6D] font-semibold cursor-pointer"
                >
                  Request Private Viewing
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Strip in Mega Menu */}
          <div
            style={{
              transitionDelay: isMegaMenuOpen ? '400ms' : '0ms',
            }}
            className={`mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-stone-400 transition-all duration-300 ${
              isMegaMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Direct Bay Access & Sovereign Holdings</span>
              </span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">Helipad & 80-Berth Marina Services</span>
            </div>
            <div className="text-[#DFBF6D]/80">
              Curated by Meridian Architectural Advisory · 2026 Sovereign Portfolio
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU (Responsive Phone & Tablet Layout) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#07080c]/98 border-b border-[#C9A24B]/20 px-5 sm:px-8 py-5 flex flex-col gap-5 text-sm text-stone-200 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search input */}
          <div className="sm:hidden pb-1">
            <NavbarSearch
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onSelectProperty={(title) => {
                onSelectProperty?.(title);
                setMobileMenuOpen(false);
              }}
            />
          </div>

          {/* Category 1: Property Typologies */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-1.5 pb-1 border-b border-white/10">
              <Building2 className="w-3 h-3 text-[#C9A24B]" />
              <span>Property Typologies</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    handleCategorySelect(type.id, type.title);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg border border-white/10 hover:border-[#C9A24B]/40 hover:bg-white/5 text-left text-stone-200 transition-colors cursor-pointer"
                >
                  <div className="font-serif font-medium text-xs text-white">{type.title}</div>
                  <div className="text-[10px] font-mono text-[#DFBF6D] mt-0.5">{type.count}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Enclaves & Location */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-1.5 pb-1 border-b border-white/10">
              <Compass className="w-3 h-3 text-[#C9A24B]" />
              <span>Enclaves & Exploration</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href="#walkthrough"
                onClick={(e) => handleNavClick(e, 'walkthrough')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Walkthrough
              </a>
              <a
                href="#featured"
                onClick={(e) => handleNavClick(e, 'featured')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Featured
              </a>
              <a
                href="#map"
                onClick={(e) => handleNavClick(e, 'map')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Coastline Map
              </a>
              <a
                href="#neighborhoods"
                onClick={(e) => handleNavClick(e, 'neighborhoods')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Enclaves
              </a>
              <a
                href="#materials"
                onClick={(e) => handleNavClick(e, 'materials')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Finishes
              </a>
              <a
                href="#lookbook"
                onClick={(e) => handleNavClick(e, 'lookbook')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Lookbook
              </a>
            </div>
          </div>

          {/* Category 3: Advisory & Financials */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#DFBF6D] uppercase flex items-center gap-1.5 pb-1 border-b border-white/10">
              <Calculator className="w-3 h-3 text-[#C9A24B]" />
              <span>Client Advisory</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href="#benchmark"
                onClick={(e) => handleNavClick(e, 'benchmark')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Global Benchmark
              </a>
              <a
                href="#calculator"
                onClick={(e) => handleNavClick(e, 'calculator')}
                className="py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/5 text-stone-300"
              >
                Dual Calculator
              </a>
            </div>
          </div>

          {/* Private Advisory Direct Action */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onBookViewingClick();
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] text-black font-semibold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-black" />
            <span>Private Advisory & Book Viewing</span>
          </button>
        </div>
      )}
    </header>
  );
};
