import React, { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticPull?: number; // default 0.35
  maxOffset?: number; // default 14px
  as?: 'button' | 'a';
  href?: string;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  magneticPull = 0.35,
  maxOffset = 14,
  as = 'button',
  href,
  disabled = false,
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isTouchRef = useRef(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window)
    ) {
      isTouchRef.current = true;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchRef.current || disabled) return;
    const el = buttonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticPull;
    const deltaY = (e.clientY - centerY) * magneticPull;

    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (isTouchRef.current || disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current || disabled) return;
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: isHovered
      ? 'transform 0.12s ease-out'
      : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)'
  };

  if (as === 'a' && href) {
    return (
      <a
        // @ts-expect-error ref forwarding
        ref={buttonRef}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={`inline-flex items-center justify-center will-change-transform ${className}`}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      // @ts-expect-error ref forwarding
      ref={buttonRef}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`inline-flex items-center justify-center will-change-transform ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
