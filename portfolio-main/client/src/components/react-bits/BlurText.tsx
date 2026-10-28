import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>;
  easing?: any;
  onAnimationComplete?: () => void;
}

/**
 * React Bits - BlurText
 * Smooth blur-to-focus animation for titles, subtitles, and captions as they enter viewport.
 * Automatically respects Arabic cursive typography by splitting words rather than letters.
 */
export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.15,
  rootMargin = '-40px',
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1],
  onAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const effectiveAnimateBy = hasArabic ? 'words' : animateBy;

  const elements = effectiveAnimateBy === 'words' ? text.split(/\s+/) : text.split('');

  const defaultFrom = {
    filter: 'blur(10px)',
    opacity: 0,
    y: direction === 'top' ? -18 : 18,
  };

  const defaultTo = {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
  };

  const fromState = animationFrom || defaultFrom;
  const toState = animationTo || defaultTo;

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
    >
      {elements.map((segment, index) => (
        <span
          key={index}
          className="inline-block whitespace-nowrap"
          style={{ verticalAlign: 'top' }}
        >
          <motion.span
            className="inline-block"
            initial={fromState}
            animate={isInView ? toState : fromState}
            transition={{
              duration: 0.5,
              delay: (index * delay) / 1000,
              ease: easing as any,
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment}
          </motion.span>
          {effectiveAnimateBy === 'words' && index < elements.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default BlurText;
