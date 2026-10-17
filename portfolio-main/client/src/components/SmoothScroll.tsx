import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * High-precision GSAP + Lenis Luxurious Smooth Scroll Provider
 * Synchronizes Lenis smooth momentum physics with the GSAP RAF ticker and ScrollTrigger.
 */
export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Honor accessibility reduced-motion preference
    if (typeof window === 'undefined') return;
    // Prevent browser auto-jumping to previous scroll position on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if page was refreshed/reloaded - if so, ensure start at top and clean hash
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') ||
      (window.performance && (window.performance as any).navigation?.type === 1);

    if (isReload) {
      if (window.location.hash) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {}
      }
      window.scrollTo(0, 0);
    }

    // Initialize Lenis with weighted, luxurious deceleration physics
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.2,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    if (isReload) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Bind Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis frame updates to GSAP ticker for 120 FPS frame consistency
    const onGsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onGsapTick);
    gsap.ticker.lagSmoothing(0);

    // Intercept in-page hash links (#projects, #about, etc.) for buttery smooth glides
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetId = href.slice(1);
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // GSAP ScrollTrigger Reading Progress Bar Animation
    let progressTrigger: ScrollTrigger | null = null;
    if (progressBarRef.current) {
      progressTrigger = ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: self.progress });
          }
        },
      });
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(onGsapTick);
      if (progressTrigger) progressTrigger.kill();
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -80,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {/* ── Luxury Scroll Progress Glow Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none origin-left"
        style={{ contain: 'paint' }}
        aria-hidden="true"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 origin-left scale-x-0 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        />
      </div>

      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
