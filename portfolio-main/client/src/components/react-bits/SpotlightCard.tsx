import React, { useRef, useState, useCallback } from 'react';
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
 * In dark mode: calibrated with feathered multi-stop falloff (no visible circle outline/disc)
 * and calm neutral illumination (no jarring neon green glare).
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(0, 0, 0, 0.025)',
  darkSpotlightColor,
  size = 360,
  darkSize,
  ...props
}) => {
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  // Mobile bypass: zero radial-gradient overlay DOM nodes and zero mouse tracking overhead
  if (isMobile) {
    return (
      <div className={`relative overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    );
  }

  // In dark mode: ensure ZERO harsh glowing spots or sharp circular discs.
  // We use an ultra-delicate, whisper-quiet architectural platinum micro-sheen (< 0.8% peak opacity).
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
      {...props}
    >
      {/* Light mode spotlight (soft, diffused, non-intrusive) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 dark:hidden"
        style={{
          opacity,
          background: `radial-gradient(${effectiveLightSize}px circle at ${position.x}px ${position.y}px, ${effectiveLightColor} 0%, rgba(0, 0, 0, 0.006) 45%, transparent 80%)`,
        }}
      />
      {/* Dark mode spotlight (barely-there whisper micro-sheen, ultra-wide diffusion, zero glare) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-700 ease-out z-0 hidden dark:block"
        style={{
          opacity,
          background: `radial-gradient(${effectiveDarkSize}px circle at ${position.x}px ${position.y}px, ${effectiveDarkColor} 0%, rgba(255, 255, 255, 0.003) 35%, rgba(255, 255, 255, 0.0008) 65%, transparent 85%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
