import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  delay?: number;
  scale?: number;
  threshold?: number;
  initialOpacity?: number;
  animateOpacity?: boolean;
  className?: string;
  rootMargin?: string;
  easing?: any;
}

/**
 * React Bits - AnimatedContent
 * Provides smooth directional entrance animation when content scrolls into view or loads.
 */
export const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 30,
  direction = 'vertical',
  reverse = false,
  duration = 0.6,
  delay = 0,
  scale = 1,
  threshold = 0.15,
  initialOpacity = 0,
  animateOpacity = true,
  className = '',
  rootMargin = '-50px',
  easing = [0.22, 1, 0.36, 1],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const getTransform = () => {
    const mult = reverse ? -1 : 1;
    if (direction === 'vertical') {
      return { y: distance * mult, x: 0 };
    }
    return { x: distance * mult, y: 0 };
  };

  const offset = getTransform();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: animateOpacity ? initialOpacity : 1,
        scale: scale !== 1 ? scale : 1,
        x: offset.x,
        y: offset.y,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }
          : {
              opacity: animateOpacity ? initialOpacity : 1,
              scale: scale !== 1 ? scale : 1,
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

export default AnimatedContent;
