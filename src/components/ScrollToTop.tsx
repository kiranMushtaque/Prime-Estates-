import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  onScrollToTop?: () => void;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ onScrollToTop }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const walkthroughEl = document.getElementById('walkthrough');
      if (walkthroughEl) {
        // Appears once the user has scrolled past the 500vh walkthrough container
        const walkthroughBottom = walkthroughEl.offsetTop + walkthroughEl.offsetHeight;
        // Visible when scrollY has passed the end of the walkthrough section
        setIsVisible(window.scrollY >= walkthroughBottom - 200);
      } else {
        setIsVisible(window.scrollY > window.innerHeight * 4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={handleClick}
        className="group flex items-center gap-2 px-3.5 py-3 rounded-full bg-[#12141c]/90 hover:bg-[#C9A24B] border border-[#C9A24B]/40 hover:border-[#C9A24B] text-stone-300 hover:text-black shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(201,162,75,0.15)] hover:shadow-[0_8px_30px_rgba(201,162,75,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
        aria-label="Scroll to top of the 3D walkthrough"
        title="Return to beginning of site"
      >
        <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" />
        <span className="text-xs font-mono tracking-wider uppercase font-semibold pr-1 hidden sm:inline">
          Top
        </span>
      </button>
    </div>
  );
};
