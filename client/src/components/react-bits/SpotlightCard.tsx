import React, { useRef, useCallback } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  darkSpotlightColor?: string;
  size?: number;
  darkSize?: number;
}

const isGreenish = (color?: string): boolean => {
  if (!color) return false;
  const c = color.toLowerCase();
  return (
    c.includes('16, 185, 129') ||
    c.includes('16,185,129') ||
    c.includes('10b981') ||
    c.includes('emerald') ||
    c.includes('green') ||
    c.includes('34, 197, 94') ||
    c.includes('22c55e')
  );
};

/**
 * React Bits - SpotlightCard
 * Enhances cards with a soft, architectural ambient spotlight following the cursor.
 * Uses CSS custom properties mutated directly on DOM refs for ZERO React re-renders on hover/move.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(0, 0, 0, 0.025)',
  darkSpotlightColor,
  size = 360,
  darkSize,
  style,
  ...props
}) => {
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--sc-x', `${(e.clientX - rect.left).toFixed(1)}px`);
    el.style.setProperty('--sc-y', `${(e.clientY - rect.top).toFixed(1)}px`);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--sc-x', `${(e.clientX - rect.left).toFixed(1)}px`);
    el.style.setProperty('--sc-y', `${(e.clientY - rect.top).toFixed(1)}px`);
    el.style.setProperty('--sc-op', '1');
  }, []);

  const handleMouseLeave = useCallback(() => {
    divRef.current?.style.setProperty('--sc-op', '0');
  }, []);

  // Mobile bypass: zero radial-gradient overlay DOM nodes and zero mouse tracking overhead
  if (isMobile) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={style} {...props}>
        {children}
      </div>
    );
  }

  const effectiveDarkColor =
    !darkSpotlightColor || isGreenish(darkSpotlightColor)
      ? 'rgba(255, 255, 255, 0.007)'
      : darkSpotlightColor;

  const effectiveDarkSize = Math.max(darkSize ?? 580, 520);

  const effectiveLightColor = isGreenish(spotlightColor)
    ? 'rgba(0, 0, 0, 0.02)'
    : spotlightColor;
  const effectiveLightSize = Math.max(size, 340);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        ['--sc-x' as string]: '0px',
        ['--sc-y' as string]: '0px',
        ['--sc-op' as string]: '0',
        ...style,
      }}
      {...props}
    >
      {/* Light mode spotlight (zero React re-renders; pure GPU opacity layer) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 dark:hidden"
        style={{
          opacity: 'var(--sc-op, 0)' as unknown as number,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          background: `radial-gradient(${effectiveLightSize}px circle at var(--sc-x, 0px) var(--sc-y, 0px), ${effectiveLightColor} 0%, rgba(0, 0, 0, 0.006) 45%, transparent 80%)`,
        }}
      />
      {/* Dark mode spotlight (zero React re-renders; pure GPU opacity layer) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-700 ease-out z-0 hidden dark:block"
        style={{
          opacity: 'var(--sc-op, 0)' as unknown as number,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          background: `radial-gradient(${effectiveDarkSize}px circle at var(--sc-x, 0px) var(--sc-y, 0px), ${effectiveDarkColor} 0%, rgba(255, 255, 255, 0.003) 35%, rgba(255, 255, 255, 0.0008) 65%, transparent 85%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
