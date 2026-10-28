import React from 'react';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * React Bits - ShinyText
 * Adds a continuous shimmering light beam sweep across text or badges.
 */
export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${
        disabled
          ? ''
          : 'bg-clip-text text-transparent bg-gradient-to-r from-foreground/85 via-emerald-400 to-foreground/85 bg-[length:200%_auto] animate-shiny'
      } ${className}`}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
        backgroundImage: disabled
          ? undefined
          : 'linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(16,185,129,1) 50%, rgba(255,255,255,0.7) 100%)',
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;

