import React, { useRef, useState, useCallback } from 'react';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  darkSpotlightColor?: string;
  size?: number;
  darkSize?: number;
}

/**
 * React Bits - SpotlightCard
 * Enhances cards with an interactive radial spotlight following the cursor,
 * preserving all native styles, borders, and layouts.
 * Calibrated with subdued, non-glaring lighting in dark mode across the entire app.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.05)',
  darkSpotlightColor,
  size = 300,
  darkSize,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  // In dark mode, ensure any emerald/green spotlight is softly muted (~1.5% alpha, max 220px radius)
  // so it never causes an overwhelming or annoying flashlight glare across dark backgrounds.
  const effectiveDarkColor =
    darkSpotlightColor ??
    (typeof spotlightColor === 'string' &&
    (spotlightColor.includes('16, 185, 129') || spotlightColor.includes('16,185,129'))
      ? 'rgba(16, 185, 129, 0.015)'
      : spotlightColor);

  const effectiveDarkSize = darkSize ?? Math.min(size, 200);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Light mode spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 dark:hidden"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Dark mode spotlight (calm, subtle, non-glaring) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 hidden dark:block"
        style={{
          opacity,
          background: `radial-gradient(${effectiveDarkSize}px circle at ${position.x}px ${position.y}px, ${effectiveDarkColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;

