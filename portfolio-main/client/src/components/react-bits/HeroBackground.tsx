import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface HeroBackgroundProps {
  className?: string;
}

/* ─── Snapped 44px Grid Cells for React Bits AnimatedGridPattern / Squares ─── */
const GRID_SIZE = 44;

/* Whisper-quiet, calm, slow breathing architectural grid cells (reduced count & pure subtle opacity) */
const ANIMATED_CELLS = [
  { col: 3, row: 2, delay: '0s', duration: '9s' },
  { col: 8, row: 3, delay: '3.2s', duration: '10s' },
  { col: 14, row: 2, delay: '1.8s', duration: '9.5s' },
  { col: 20, row: 4, delay: '4.5s', duration: '11s' },
  { col: 26, row: 3, delay: '2.1s', duration: '10.5s' },
  { col: 6, row: 7, delay: '5.2s', duration: '10s' },
  { col: 17, row: 8, delay: '1.2s', duration: '9s' },
  { col: 23, row: 7, delay: '3.8s', duration: '11.5s' },
] as const;

const CROSSHAIR_NODES = [
  { col: 4, row: 3 },
  { col: 10, row: 6 },
  { col: 16, row: 3 },
  { col: 22, row: 7 },
  { col: 28, row: 4 },
] as const;

/**
 * React Bits — HeroBackground (Calm Ambient Architectural Grid)
 * - Ultra-subtle, quiet luxury atmosphere with ZERO flying meteors or harsh beams.
 * - Barely-there ambient lighting (softened green & neutral tones to avoid any neon look).
 * - Multi-stop eased bottom gradient mask & fade so the Hero background dissolves seamlessly into the next section.
 * - Pauses automatically when scrolled out of view for 0% offscreen CPU/GPU cost.
 */
export const HeroBackground: React.FC<HeroBackgroundProps> = ({ className = '' }) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Pause all background animations when Hero is scrolled offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop subtle cursor tracking on window (zero React re-renders)
  useEffect(() => {
    if (isMobile || !isInView || typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const container = containerRef.current;
        const spot = spotlightRef.current;
        if (!container || !spot) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40) {
          spot.style.setProperty('--rb-mx', `${x.toFixed(1)}px`);
          spot.style.setProperty('--rb-my', `${y.toFixed(1)}px`);
          spot.style.opacity = '1';
        } else {
          spot.style.opacity = '0';
        }
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isMobile, isInView]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${
        !isInView ? 'rb-hero-bg-paused' : ''
      } ${className}`}
    >
      <style>{`
        @keyframes rbAuroraDriftA {
          0%, 100% {
            transform: translate3d(0%, 0%, 0) scale(1);
          }
          50% {
            transform: translate3d(2%, -2%, 0) scale(1.03);
          }
        }
        @keyframes rbAuroraDriftB {
          0%, 100% {
            transform: translate3d(0%, 0%, 0) scale(1);
          }
          50% {
            transform: translate3d(-2%, 2%, 0) scale(1.03);
          }
        }
        @keyframes rbCellPulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        .rb-aurora-a {
          animation: rbAuroraDriftA 22s ease-in-out infinite;
          will-change: transform;
        }
        .rb-aurora-b {
          animation: rbAuroraDriftB 26s ease-in-out infinite;
          will-change: transform;
        }
        .rb-grid-cell {
          animation-name: rbCellPulse;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .rb-hero-bg-paused *,
        .rb-hero-bg-paused {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .rb-aurora-a,
          .rb-aurora-b,
          .rb-grid-cell {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Master Eased Vertical & Radial Mask (Guarantees 0 hard borders at top or bottom) ── */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 6%, rgba(0,0,0,0.85) 16%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 86%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 6%, rgba(0,0,0,0.85) 16%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 62%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 86%, transparent 100%)',
        }}
      >
        {/* ── 1. Extremely Soft Ambient Atmospheric Sheen (Whisper-Quiet, Zero Harsh Glow) ── */}
        <div
          className={`-top-[8%] left-[5%] w-[480px] h-[380px] sm:w-[620px] sm:h-[420px] rounded-full opacity-60 dark:opacity-50 ${
            !isMobile ? 'rb-aurora-a' : ''
          }`}
          style={{
            position: 'absolute',
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(16, 185, 129, 0.02) 0%, rgba(14, 165, 233, 0.012) 45%, transparent 72%)',
          }}
        />

        <div
          className={`top-[12%] right-[5%] w-[460px] h-[380px] sm:w-[580px] sm:h-[440px] rounded-full opacity-60 dark:opacity-50 ${
            !isMobile ? 'rb-aurora-b' : ''
          }`}
          style={{
            position: 'absolute',
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(14, 165, 233, 0.016) 0%, rgba(16, 185, 129, 0.012) 45%, transparent 72%)',
          }}
        />

        {/* ── 2. Architectural Grid + Subtle Shimmering Nodes (SVG Pattern) ── */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              'radial-gradient(ellipse 85% 75% at 50% 46%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.55) 60%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 75% at 50% 46%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.55) 60%, transparent 92%)',
          }}
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Base 44x44 Architectural Grid Pattern */}
              <pattern
                id="rb-hero-grid-pattern"
                width={GRID_SIZE}
                height={GRID_SIZE}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
                  fill="none"
                  className="stroke-slate-900/[0.04] dark:stroke-white/[0.035]"
                  strokeWidth="1"
                />
              </pattern>

              {/* Major 176x176 (4x4) Structural Accent Grid Pattern */}
              <pattern
                id="rb-hero-subgrid-pattern"
                width={GRID_SIZE * 4}
                height={GRID_SIZE * 4}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${GRID_SIZE * 4} 0 L 0 0 0 ${GRID_SIZE * 4}`}
                  fill="none"
                  className="stroke-slate-900/[0.06] dark:stroke-white/[0.05]"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Fine Grid + Major Structural Sub-Grid */}
            <rect width="100%" height="100%" fill="url(#rb-hero-grid-pattern)" />
            <rect width="100%" height="100%" fill="url(#rb-hero-subgrid-pattern)" />

            {/* Subtle, Calm Breathing Grid Squares (Ultra-Restrained & Quiet) */}
            {!isMobile && (
              <g>
                {ANIMATED_CELLS.map((cell, idx) => (
                  <rect
                    key={idx}
                    x={cell.col * GRID_SIZE + 0.5}
                    y={cell.row * GRID_SIZE + 0.5}
                    width={GRID_SIZE - 1}
                    height={GRID_SIZE - 1}
                    rx={2}
                    style={{
                      animationDelay: cell.delay,
                      animationDuration: cell.duration,
                    }}
                    className="rb-grid-cell fill-emerald-500/[0.02] dark:fill-white/[0.018] stroke-emerald-600/[0.08] dark:stroke-white/[0.06]"
                    strokeWidth="1"
                  />
                ))}

                {/* Minimalist Architectural Crosshairs (+) at Select Grid Intersections */}
                {CROSSHAIR_NODES.map((node, idx) => {
                  const cx = node.col * GRID_SIZE;
                  const cy = node.row * GRID_SIZE;
                  return (
                    <g
                      key={`node_${idx}`}
                      className="text-slate-500/25 dark:text-zinc-500/20"
                    >
                      <line
                        x1={cx - 3}
                        y1={cy}
                        x2={cx + 3}
                        y2={cy}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <line
                        x1={cx}
                        y1={cy - 3}
                        x2={cx}
                        y2={cy + 3}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* ── 3. Desktop Interactive Cursor Subtle Sheen (Quiet, Neutral, Zero Neon Glow) ── */}
        {!isMobile && (
          <div
            ref={spotlightRef}
            className="hidden lg:block absolute inset-0 opacity-0 transition-opacity duration-700 ease-out"
          >
            {/* Subtle highlight of the grid under cursor */}
            <div
              className="absolute inset-0"
              style={{
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundImage:
                  'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                maskImage:
                  'radial-gradient(280px circle at var(--rb-mx, 50%) var(--rb-my, 45%), rgba(0,0,0,0.8) 0%, transparent 70%)',
                WebkitMaskImage:
                  'radial-gradient(280px circle at var(--rb-mx, 50%) var(--rb-my, 45%), rgba(0,0,0,0.8) 0%, transparent 70%)',
              }}
            />
          </div>
        )}
      </div>

      {/* ── 4. Seamless Multi-Stop Eased Bottom Gradient Fade into Page Background (Zero Section Border) ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-48 bg-gradient-to-t from-background via-background/80 to-transparent"
      />
    </div>
  );
};

export default HeroBackground;
