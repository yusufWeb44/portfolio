import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SplashScreenProps {
  onComplete: () => void;
  isAr?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  isAr = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Soft, calming message that transitions smoothly
  const message = useMemo(() => {
    if (progress < 60) {
      return isAr ? 'أهلاً بك' : 'Welcome';
    }
    return isAr ? 'جاري تهيئة التجربة...' : 'Curating your experience...';
  }, [progress, isAr]);

  const handleFinish = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    try {
      sessionStorage.setItem('portfolio_splash_seen', 'true');
    } catch {
      // Ignore in restricted environments
    }

    // Smooth curtain exit duration
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 900);

    return () => clearTimeout(exitTimer);
  }, [isExiting, onComplete]);

  // Handle ESC key to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Prevent scrolling during splash screen without modifying document.body.style.overflow (eliminates scrollbar shift / jitter)
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventScrollKeys = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
    };
  }, []);

  // Smooth, relaxed counter (~1700ms total) with organic ease
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1700;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Relaxing cubic-ease-out curve: starts gently, glides smoothly to 100%
      const easeOut = 1 - Math.pow(1 - t, 2.5);
      const currentVal = Math.min(Math.round(easeOut * 100), 100);
      setProgress(currentVal);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        const holdTimer = setTimeout(() => {
          handleFinish();
        }, 180);
        return () => clearTimeout(holdTimer);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleFinish]);

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const curtainEase = [0.77, 0, 0.175, 1] as const;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto select-none overflow-hidden touch-none overscroll-contain"
      role="dialog"
      aria-label="Welcome Splash Screen"
      aria-modal="true"
    >
      {/* ─── Top Shutter Curtain (Splits Upward) ────────────────────── */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '-100%' : '0%' }}
        transition={{ duration: 0.9, ease: curtainEase }}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#08080a] border-b border-white/[0.04] overflow-hidden transform-gpu"
        style={{ willChange: 'transform' }}
      >
        {/* Soft, Soothing Ambient Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[420px] h-[210px] bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>

      {/* ─── Bottom Shutter Curtain (Splits Downward) ──────────────────── */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '100%' : '0%' }}
        transition={{ duration: 0.9, ease: curtainEase }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#08080a] border-t border-white/[0.04] overflow-hidden transform-gpu"
        style={{ willChange: 'transform' }}
      >
        {/* Soft, Soothing Ambient Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[210px] bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>

      {/* ─── Minimalist Discreet Skip Button ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-50"
      >
        <button
          onClick={handleFinish}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer px-3 py-1.5 rounded-full hover:bg-white/[0.03]"
          title={isAr ? 'تخطي' : 'Skip'}
        >
          <span>{isAr ? 'تخطي' : 'Skip'}</span>
        </button>
      </motion.div>

      {/* ─── Center Presentation Stage (Calm & Serene) ────────────────── */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* ── Zen Breathing Ring & Soft Indicator ── */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-6">
            {/* Soft Ambient Core Pulse */}
            <div
              className="absolute inset-2 rounded-full bg-emerald-500/[0.12] blur-xl animate-pulse"
              style={{ animationDuration: '3s' }}
              aria-hidden="true"
            />

            {/* Circular Progress Arc */}
            <svg
              className="w-full h-full -rotate-90 transform-gpu"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-white/[0.06]"
                strokeWidth="1.5"
                fill="transparent"
              />

              {/* Animated Progress Stroke */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-emerald-400/80 transition-[stroke-dashoffset] duration-150 ease-out"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Quiet Numeric Counter in Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-light text-zinc-200 tabular-nums tracking-tight font-mono">
                {progress}
                <span className="text-xs text-emerald-400/80 font-normal ms-0.5">%</span>
              </span>
            </div>
          </div>

          {/* ── Calming Minimalist Text ── */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-sm text-zinc-400 font-normal tracking-wide"
              >
                {message}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Subtle Breathing Pulse Dot */}
          <div className="mt-3 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-emerald-400/60 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
