import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: any;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  rootMargin?: string;
}

/**
 * React Bits - FadeContent
 * Smooth scroll-triggered reveal with blur, opacity, and directional offset on desktop.
 * On mobile (< 768px), immediately renders clean static children with ZERO motion overhead,
 * zero delays, zero blur filters, and instant 100% opacity for silky native 120fps touch scrolling.
 */
export const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 0.5,
  easing = [0.16, 1, 0.3, 1],
  delay = 0,
  threshold = 0.08,
  initialOpacity = 0,
  direction = 'up',
  distance = 18,
  className = '',
  rootMargin = '-30px',
}) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  // Mobile bypass: pure static element with zero motion or opacity lag
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: initialOpacity,
        ...(blur ? { filter: 'blur(8px)' } : {}),
        x: offset.x,
        y: offset.y,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              ...(blur ? { filter: 'blur(0px)' } : {}),
              x: 0,
              y: 0,
            }
          : {
              opacity: initialOpacity,
              ...(blur ? { filter: 'blur(8px)' } : {}),
              x: offset.x,
              y: offset.y,
            }
      }
      transition={{
        duration,
        delay,
        ease: easing as any,
      }}
      style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
