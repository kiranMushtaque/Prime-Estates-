import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { WALKTHROUGH_ROOMS } from './data/realEstateData';
import { GenesisIntro } from './components/GenesisIntro';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { PhotoWalkthrough } from './components/Walkthrough/PhotoWalkthrough';
import { PropertyTypes } from './components/PropertyTypes';
import { MaterialsFinishes } from './components/MaterialsFinishes';
import { DesignerLookbook } from './components/DesignerLookbook';
import { FeaturedListings } from './components/FeaturedListings';
import { CityMap } from './components/CityMap';
import { Neighborhoods } from './components/Neighborhoods';
import { Stats } from './components/Stats';
import { EmiCalculator } from './components/Calculator/EmiCalculator';
import { BenchmarkMatrix } from './components/BenchmarkMatrix';
import { ContactViewing } from './components/ContactViewing';
import { AIConcierge } from './components/AIConcierge';
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [selectedPropertyForViewing, setSelectedPropertyForViewing] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(['prop-1']); // In-memory favorites state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Dynamic listings & neighborhood search

  // Play video once on the very first load of the site per session (sessionStorage)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === 'true') {
        sessionStorage.removeItem('meridian_genesis_viewed');
        return true;
      }
      return sessionStorage.getItem('meridian_genesis_viewed') !== 'true';
    } catch {
      return true;
    }
  });

  const lenisRef = useRef<Lenis | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  // Preload walkthrough high-res images in background without blocking screen
  useEffect(() => {
    WALKTHROUGH_ROOMS.forEach((room) => {
      const img = new Image();
      img.src = room.image;
    });
  }, []);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // Initialize Lenis smooth scroll and wire with GSAP ScrollTrigger
  useEffect(() => {
    // ONE scroll system only
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (t: number) => {
      lenis.raf(t * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for smooth navigation handlers
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoad);

    const mountTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      clearTimeout(mountTimer);
      window.removeEventListener('load', handleLoad);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  const handleBookViewing = (propertyTitle?: string) => {
    if (propertyTitle) {
      setSelectedPropertyForViewing(propertyTitle);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(contactEl, { duration: 1.2 });
      } else {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // GSAP scroll-triggered entrance animations with slight stagger between child elements
  useEffect(() => {
    if (!mainRef.current) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const sections = mainRef.current?.querySelectorAll('section');
      if (!sections || sections.length === 0) return;

      sections.forEach((section) => {
        // Collect key child elements (headings, lead paragraphs, cards, buttons) for staggered reveal
        const headings = section.querySelectorAll('h2, h3, p.max-w-2xl, p.max-w-xl');
        const cards = section.querySelectorAll('.glass-card, article, .grid > div');
        const animElements: Element[] = [];

        headings.forEach((el) => animElements.push(el));
        cards.forEach((el) => animElements.push(el));

        if (animElements.length > 1) {
          gsap.fromTo(
            animElements,
            {
              opacity: 0,
              y: 45,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1.15,
              stagger: 0.12, // Slight stagger between headers and cards for cinematic luxury
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: section,
                start: 'top 83%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        } else {
          gsap.fromTo(
            section,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1.15,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });
    }, mainRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [showIntro]);

  return (
    <div className="relative min-h-screen bg-[#07080c] text-[#e0e2ec] font-sans selection:bg-[#C9A24B]/30 selection:text-white" style={{ backgroundColor: '#07080c' }}>
      {/* Custom Gold Cursor (desktop only, with glowing follower ring and walkthrough spotlight) */}
      <CustomCursor />

      {/* Cinematic Genesis Villa Construction-Reveal Intro (plays once per session) */}
      {showIntro && (
        <GenesisIntro
          onComplete={() => {
            console.log('[Genesis Lifecycle - App] Intro completed. Displaying full residence portal...');
            try {
              sessionStorage.setItem('meridian_genesis_viewed', 'true');
            } catch {}
            setShowIntro(false);
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          }}
        />
      )}

      {/* Sticky minimal navbar with search bar */}
      <Navbar
        onBookViewingClick={() => handleBookViewing()}
        favoritesCount={favorites.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectProperty={(title) => {
          setSelectedPropertyForViewing(title);
        }}
      />

      {/* SECTION 1: PHOTO WALKTHROUGH (pinned full-screen stage ~600vh, 7 images) */}
      <PhotoWalkthrough onBookViewing={handleBookViewing} />

      {/* NORMAL SCROLLING WEBSITE AFTER WALKTHROUGH */}
      <main ref={mainRef} className="relative z-10 bg-[#090a0f]">
        {/* SECTION 2: Property Types (4 glass cards with parallax and hover tilt) */}
        <PropertyTypes
          onFilterSelect={(typeId) => {
            if (typeId === 'villas') setSearchQuery('Coral Ridge');
            else if (typeId === 'apartments') setSearchQuery('Marina Crest');
            else if (typeId === 'plots') setSearchQuery('Palm Heights');
            else if (typeId === 'commercial') setSearchQuery('Old Harbour');

            const featuredEl = document.getElementById('featured');
            if (featuredEl) {
              if (lenisRef.current) {
                lenisRef.current.scrollTo(featuredEl, { duration: 1.2 });
              } else {
                featuredEl.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        />

        {/* SECTION 2B: MATERIALS & FINISHES SHOWCASE ("Crafted From the Finest") */}
        <MaterialsFinishes />

        {/* SECTION 2C: DESIGNER LOOKBOOK ("Curated Furnishings & Art") */}
        <DesignerLookbook />

        {/* SECTION 3: Featured Listings (horizontal scroll of 5 cards with prices in PKR + dynamic search filter) */}
        <FeaturedListings
          onScheduleViewing={handleBookViewing}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectNeighborhood={(neighborhood) => setSearchQuery(neighborhood)}
        />

        {/* SECTION 4: Map (Stylised abstract dark map of Azure Bay with glowing gold pins & animated route lines) */}
        <CityMap />

        {/* SECTION 5: Neighborhoods (3 fictional areas with crossfading photography) */}
        <Neighborhoods />

        {/* SECTION 6: Stats (Animated count-up cards: 500+ Sold, 1,200+ Happy Clients, 10+ Years) */}
        <Stats />

        {/* SECTION 7: EMI Calculator (Price, Down Payment, Tenure & Rate sliders + SVG Donut Chart) */}
        <EmiCalculator
          onScheduleConsultation={() => handleBookViewing('Private Wealth & Mortgage Advisory')}
        />

        {/* SECTION 7B: GLOBAL BENCHMARK MATRIX ("How It Compares") */}
        <BenchmarkMatrix />

        {/* SECTION 8: Contact ("Book a Viewing" form) */}
        <ContactViewing initialPropertyTitle={selectedPropertyForViewing} />
      </main>

      {/* AI Concierge (Gemini 2.5 Flash resident advisor for Azure Bay + WhatsApp fallback) */}
      <AIConcierge />

      {/* Scroll to Top button (bottom-left, visible only after walkthrough section) */}
      <ScrollToTop
        onScrollToTop={() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { duration: 1.4 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Luxury Real Estate Agency Footer */}
      <Footer />
    </div>
  );
}
