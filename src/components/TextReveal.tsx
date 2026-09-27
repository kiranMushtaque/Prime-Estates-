import React, { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number; // base delay in ms
  stagger?: number; // delay per word in ms
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
  stagger = 45
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const words = text.split(' ');

  return (
    // @ts-expect-error dynamic component tag
    <Component ref={containerRef} className={`${className} inline-block`}>
      {words.map((word, idx) => {
        const transitionDelay = `${delay + idx * stagger}ms`;
        return (
          <span key={`${word}-${idx}`} className="inline-block overflow-hidden mr-[0.28em] align-top py-0.5">
            <span
              className="inline-block will-change-transform"
              style={{
                display: 'inline-block',
                transform: isRevealed ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)',
                opacity: isRevealed ? 1 : 0,
                filter: isRevealed ? 'blur(0px)' : 'blur(6px)',
                transitionProperty: 'transform, opacity, filter',
                transitionDuration: '850ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Component>
  );
};
