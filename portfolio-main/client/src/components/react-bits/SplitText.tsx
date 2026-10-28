import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: 'words' | 'letters';
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>;
  easing?: any;
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
}

/**
 * React Bits - SplitText
 * Splits text into words or characters with staggered scroll-triggered entrance.
 * Smartly preserves Arabic cursive connectivity by defaulting Arabic text to word-level splitting.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  duration = 0.5,
  splitBy = 'words',
  textAlign = 'initial',
  animationFrom = { opacity: 0, y: 24, filter: 'blur(8px)' },
  animationTo = { opacity: 1, y: 0, filter: 'blur(0px)' },
  easing = [0.16, 1, 0.3, 1],
  threshold = 0.15,
  rootMargin = '-50px',
  onAnimationComplete,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  // Detect Arabic characters to prevent breaking Arabic cursive letters
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const effectiveSplitBy = hasArabic ? 'words' : splitBy;

  const elements = effectiveSplitBy === 'words' ? text.split(/\s+/) : text.split('');

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ textAlign, wordBreak: 'normal', overflowWrap: 'break-word' }}
      aria-label={text}
    >
      {elements.map((segment, index) => (
        <span
          key={index}
          className="inline-block overflow-visible whitespace-nowrap"
          style={{ verticalAlign: 'top' }}
        >
          <motion.span
            className="inline-block"
            initial={animationFrom}
            animate={isInView ? animationTo : animationFrom}
            transition={{
              duration,
              delay: (index * delay) / 1000,
              ease: easing as any,
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment}
          </motion.span>
          {effectiveSplitBy === 'words' && index < elements.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
