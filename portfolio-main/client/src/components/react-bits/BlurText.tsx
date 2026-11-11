import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters' | 'block';
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
 * Refined, fluid entrance animation for subtitles, captions, and narrative text.
 * Replaces jerky, blurry letter/word pop-ins with a silky, unified slide-up and fade.
 */
export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 12,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.1,
  rootMargin = '-30px',
  animationFrom,
  animationTo,
  easing = [0.16, 1, 0.3, 1],
  onAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const defaultFrom = {
    opacity: 0,
    y: direction === 'top' ? -14 : 14,
  };

  const defaultTo = {
    opacity: 1,
    y: 0,
  };

  const fromState = animationFrom || defaultFrom;
  const toState = animationTo || defaultTo;

  // For longer narrative paragraphs or when explicitly requested, animate as a cohesive block
  // to avoid distracting multi-second sequential word pops.
  const isBlock = animateBy === 'block' || (text && text.length > 90);

  if (isBlock) {
    return (
      <motion.span
        ref={ref}
        initial={fromState}
        animate={isInView ? toState : fromState}
        transition={{
          duration: 0.55,
          ease: easing as any,
        }}
        onAnimationComplete={onAnimationComplete}
        className={`inline-block ${className}`}
        style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}
      >
        {text}
      </motion.span>
    );
  }

  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const effectiveAnimateBy = hasArabic ? 'words' : animateBy;

  const elements = effectiveAnimateBy === 'words' ? text.split(/\s+/) : text.split('');

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
              duration: 0.45,
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
