import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
 * Smooth scroll-triggered reveal with blur, opacity, and directional offset.
 */
export const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = true,
  duration = 0.65,
  easing = [0.16, 1, 0.3, 1],
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  direction = 'up',
  distance = 24,
  className = '',
  rootMargin = '-60px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

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
        filter: blur ? 'blur(8px)' : 'none',
        x: offset.x,
        y: offset.y,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              filter: blur ? 'blur(0px)' : 'none',
              x: 0,
              y: 0,
            }
          : {
              opacity: initialOpacity,
              filter: blur ? 'blur(8px)' : 'none',
              x: offset.x,
              y: offset.y,
            }
      }
      transition={{
        duration,
        delay,
        ease: easing as any,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
