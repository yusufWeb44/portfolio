import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { LOGO_ASPECT, LOGO_LETTERS } from './splashLetters';

export interface SplashScreenProps {
  onComplete: () => void;
  isAr?: boolean;
}

/* ─── Timeline (ms, measured from the moment letter assets are ready) ─── */
const HOLD_MS = 3400; // full cinematic sequence before the exit starts
const EXIT_MS = 950; // zoom-through exit duration
const FPS = 24; // film-style timecode

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_EXPO = [0.7, 0, 0.84, 0] as const;

/* Each logo letter flies in from a different point in 3D space */
const ENTRY = [
  { x: -340, y: -70, z: -950, rotateX: 25, rotateY: 88, rotateZ: -22 },
  { x: -70, y: -280, z: -1150, rotateX: -95, rotateY: 22, rotateZ: 12 },
  { x: 90, y: 280, z: -1150, rotateX: 95, rotateY: -22, rotateZ: -12 },
  { x: 340, y: -50, z: -950, rotateX: 25, rotateY: -88, rotateZ: 22 },
];
const letterDelay = (i: number) => 0.25 + i * 0.14;

/* Synchronized "edit cut" glitch moment (seconds) */
const GLITCH_AT = 1.62;
const GLITCH_DURATION = 2.4;

const maskOf = (src: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
});

/* Deterministic ambient particles */
const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: r(1) * 100,
    top: 35 + r(2) * 65,
    size: 1 + r(3) * 2.2,
    dur: 5 + r(4) * 6,
    delay: -r(5) * 8,
    o: 0.25 + r(6) * 0.6,
    dx: (r(7) - 0.5) * 60,
  };
});

const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const SPLASH_CSS = `
@keyframes splash-shine { 0% { background-position: 100% 0; } 45%, 100% { background-position: 0% 0; } }
@keyframes splash-spin { to { transform: rotate(360deg); } }
@keyframes splash-spin-rev { to { transform: rotate(-360deg); } }
@keyframes splash-grid { from { transform: translateY(0); } to { transform: translateY(64px); } }
@keyframes splash-grain {
  0% { transform: translate(0, 0); } 20% { transform: translate(-3%, 2%); } 40% { transform: translate(2%, -3%); }
  60% { transform: translate(-2%, -1%); } 80% { transform: translate(3%, 3%); } 100% { transform: translate(0, 0); }
}
@keyframes splash-particle {
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  15%, 85% { opacity: var(--o); }
  100% { transform: translate3d(var(--dx), -140px, 0); opacity: 0; }
}
@keyframes splash-rec { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }
.splash-face {
  background-image: linear-gradient(115deg, #effff8 0%, #ffffff 40%, #8ff5cf 47%, #ffffff 53%, #e6fff4 100%);
  background-size: 300% 100%;
  background-position: 100% 0;
  animation: splash-shine 2.8s cubic-bezier(.45, 0, .2, 1) infinite;
}
`;

/* ─── Scramble / decode text (motion-graphics title effect) ─── */
const GLYPHS_EN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/';
const GLYPHS_AR = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

const ScrambleText: React.FC<{ text: string; start: boolean; glyphs: string }> = ({ text, start, glyphs }) => {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!start) return;
    let tick = 0;
    const total = 22;
    const id = window.setInterval(() => {
      tick++;
      const revealed = Math.floor((tick / total) * text.length);
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' ? ' ' : i < revealed ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
          .join('')
      );
      if (tick >= total) {
        window.clearInterval(id);
        setOut(text);
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [start, text, glyphs]);
  return <span>{out || '\u00A0'}</span>;
};

/* ─── One extruded 3D letter of the logo ─── */
interface Letter3DProps {
  src: string;
  ox: number;
  oy: number;
  index: number;
  depth: number;
  play: boolean;
  reduced: boolean;
}

const Letter3D: React.FC<Letter3DProps> = ({ src, ox, oy, index, depth, play, reduced }) => {
  const from = ENTRY[index % ENTRY.length];
  const delay = letterDelay(index);
  const mask = maskOf(src);

  // Absolute-time keyframes so the RGB split fires on entry AND on the shared "cut" moment
  const tt = (sec: number) => Math.min(1, Math.max(0, sec / GLITCH_DURATION));
  const glitchTimes = [0, tt(delay), tt(delay + 0.12), tt(delay + 0.3), tt(delay + 0.55), tt(GLITCH_AT), tt(GLITCH_AT + 0.04), tt(GLITCH_AT + 0.1), tt(GLITCH_AT + 0.18), 1];
  const glitchOpacity = [0, 0.95, 0.7, 0.35, 0, 0, 0.9, 0.7, 0, 0];
  const glitchX = (s: number) => [-22 * s, -22 * s, 9 * s, -4 * s, 0, 0, -14 * s, 10 * s, 0, 0];

  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformStyle: 'preserve-3d', transformOrigin: `${ox}% ${oy}%`, willChange: 'transform' }}
      initial={reduced ? { opacity: 0 } : { ...from, opacity: 0 }}
      animate={play ? { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1 } : undefined}
      transition={{
        default: reduced
          ? { duration: 0.6, delay: 0.1 + index * 0.08 }
          : { type: 'spring', stiffness: 60, damping: 13, mass: 1.1, delay },
        opacity: { duration: reduced ? 0.6 : 0.35, delay: reduced ? 0.1 + index * 0.08 : delay },
      }}
    >
      {/* Extruded depth slices (front = bright emerald → back = deep shadow) */}
      {Array.from({ length: depth }).map((_, k) => {
        const t = (k + 1) / depth;
        return (
          <div
            key={k}
            className="absolute inset-0"
            style={{
              ...mask,
              transform: `translateZ(${-(k + 1) * 1.7}px)`,
              background: `hsl(${158 + t * 6} ${66 + t * 14}% ${40 - t * 32}%)`,
            }}
          />
        );
      })}

      {/* Front face with travelling light sweep + soft emerald glow */}
      <div className="absolute inset-0" style={{ filter: 'drop-shadow(0 0 14px rgba(16,185,129,0.45))' }}>
        <div
          className="absolute inset-0 splash-face"
          style={{ ...mask, animationDelay: `${1.35 + index * 0.12}s` }}
        />
      </div>

      {/* Chromatic aberration (RGB split) layers */}
      {!reduced && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ ...mask, background: '#ff2a6d', mixBlendMode: 'screen', transform: 'translateZ(1px)' }}
            initial={{ x: -22, opacity: 0 }}
            animate={play ? { x: glitchX(1), opacity: glitchOpacity } : undefined}
            transition={{ duration: GLITCH_DURATION, times: glitchTimes, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ ...mask, background: '#05d9e8', mixBlendMode: 'screen', transform: 'translateZ(1px)' }}
            initial={{ x: 22, opacity: 0 }}
            animate={play ? { x: glitchX(-1), opacity: glitchOpacity } : undefined}
            transition={{ duration: GLITCH_DURATION, times: glitchTimes, ease: 'linear' }}
          />
        </>
      )}
    </motion.div>
  );
};

/* ─── Camera-viewfinder corner bracket ─── */
const Corner: React.FC<{ className: string; delay: number; play: boolean }> = ({ className, delay, play }) => (
  <motion.span
    aria-hidden="true"
    className={`absolute w-5 h-5 sm:w-6 sm:h-6 border-emerald-400/60 ${className}`}
    initial={{ opacity: 0, scale: 1.6 }}
    animate={play ? { opacity: 1, scale: 1 } : undefined}
    transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
  />
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, isAr = false }) => {
  const reduced = !!useReducedMotion();
  const [ready, setReady] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const exitingRef = useRef(false);
  const [depth] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 6 : 10
  );

  const timecodeRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* Mouse parallax → tilts the whole 3D logo rig */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rigRotateY = useTransform(sx, (v) => v * 14);
  const rigRotateX = useTransform(sy, (v) => v * -10);

  const handleFinish = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);
    try {
      sessionStorage.setItem('portfolio_splash_seen', 'true');
    } catch {
      // Ignore in restricted environments
    }
    window.setTimeout(onComplete, EXIT_MS);
  }, [onComplete]);

  // Preload the letter layers so the 3D entrance never starts with empty masks
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    Promise.all(
      LOGO_LETTERS.map(
        (l) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = l.src;
          })
      )
    ).then(finish);
    const fallback = window.setTimeout(finish, 900);
    return () => window.clearTimeout(fallback);
  }, []);

  // Master timeline
  useEffect(() => {
    if (!ready) return;
    const taglineTimer = window.setTimeout(() => setShowTagline(true), reduced ? 300 : 1100);
    const exitTimer = window.setTimeout(handleFinish, reduced ? 1600 : HOLD_MS);
    return () => {
      window.clearTimeout(taglineTimer);
      window.clearTimeout(exitTimer);
    };
  }, [ready, reduced, handleFinish]);

  // HUD readouts (timecode / percent / progress bar) — direct DOM writes, zero React re-renders
  useEffect(() => {
    if (!ready) return;
    const total = reduced ? 1600 : HOLD_MS;
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / total, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      const frames = Math.floor((elapsed / 1000) * FPS);
      const ff = String(frames % FPS).padStart(2, '0');
      const ss = String(Math.floor(frames / FPS) % 60).padStart(2, '0');
      if (timecodeRef.current) timecodeRef.current.textContent = `00:00:${ss}:${ff}`;
      if (percentRef.current) percentRef.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready, reduced]);

  // Mouse parallax listener
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, mx, my]);

  // ESC to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleFinish();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Block page scroll without touching body overflow (no scrollbar shift)
  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
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

  const play = ready;
  const tagline = isAr ? 'مهندس برمجيات' : 'SOFTWARE ENGINEER';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-auto select-none overflow-hidden touch-none overscroll-contain bg-[#040506] text-white"
      role="dialog"
      aria-label="Welcome Splash Screen"
      aria-modal="true"
      dir="ltr"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.55, delay: isExiting ? 0.38 : 0, ease: 'easeInOut' }}
    >
      <style>{SPLASH_CSS}</style>

      {/* ═══ Atmosphere ═══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(16,185,129,0.16), transparent 65%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(6,182,212,0.10), transparent 70%)',
        }}
      />

      {/* Perspective grid floor (motion-graphics stage) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[50%] overflow-hidden pointer-events-none"
        style={{
          perspective: 420,
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent 88%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent 88%)',
        }}
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <div
          className="absolute left-[-50%] w-[200%] h-[220%] bottom-0"
          style={{ transform: 'rotateX(70deg)', transformOrigin: '50% 100%' }}
        >
          <div
            className="absolute inset-x-0 -top-16 bottom-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(52,211,153,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.24) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              animation: reduced ? undefined : 'splash-grid 1.6s linear infinite',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient particles */}
      {!reduced && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-emerald-200"
              style={
                {
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  boxShadow: '0 0 6px rgba(110,231,183,0.8)',
                  animation: `splash-particle ${p.dur}s linear ${p.delay}s infinite`,
                  '--o': p.o,
                  '--dx': `${p.dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Horizon light streak */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
        style={{ boxShadow: '0 0 18px 2px rgba(52,211,153,0.55)' }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={play ? { scaleX: [0, 1, 1], opacity: [1, 1, 0.12] } : undefined}
        transition={{ duration: 1.5, delay: 0.1, times: [0, 0.45, 1], ease: EASE_OUT_EXPO }}
      />

      {/* Landing flash bloom behind the logo */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 w-[90vmin] h-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.45), rgba(16,185,129,0.12) 35%, transparent 62%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={play ? { opacity: [0, 0.95, 0.35], scale: [0.5, 1.25, 1] } : undefined}
        transition={{ duration: 1.3, delay: 1.0, ease: EASE_OUT_EXPO }}
      />

      {/* ═══ 3D Logo Stage ═══ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ perspective: 1100 }}>
        <motion.div style={{ rotateX: rigRotateX, rotateY: rigRotateY, transformStyle: 'preserve-3d' }}>
          {/* "Edit cut" jolt shared by all letters */}
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={play && !reduced ? { x: [0, -7, 5, -2, 0], skewX: [0, -4, 3, 0, 0] } : undefined}
            transition={{ duration: 0.2, delay: GLITCH_AT, ease: 'linear' }}
          >
            {/* Idle float + zoom-through exit */}
            <motion.div
              className="relative"
              style={{ transformStyle: 'preserve-3d', width: 'min(78vw, 540px)', aspectRatio: LOGO_ASPECT }}
              animate={
                isExiting
                  ? { scale: reduced ? 1 : 2.8, z: reduced ? 0 : 220, opacity: 0, rotateX: 0, rotateY: 0 }
                  : play && !reduced
                    ? { rotateY: [0, -10, 9, 0], rotateX: [0, 6, -4, 0] }
                    : {}
              }
              transition={
                isExiting
                  ? { duration: 0.85, ease: EASE_IN_EXPO }
                  : { duration: 7, delay: 1.7, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {/* Holographic orbit rings (pass in front of & behind the letters) */}
              {!reduced && (
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{
                    width: '128%',
                    aspectRatio: '1 / 1',
                    marginLeft: '-64%',
                    transform: 'translateY(-50%) rotateX(77deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.55 }}
                    animate={play ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ duration: 1.4, delay: 1.05, ease: EASE_OUT_EXPO }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '1px solid rgba(52,211,153,0.35)',
                        boxShadow: '0 0 24px rgba(16,185,129,0.25), inset 0 0 24px rgba(16,185,129,0.15)',
                        animation: 'splash-spin 9s linear infinite',
                      }}
                    >
                      <span
                        className="absolute left-1/2 -top-[3px] w-1.5 h-1.5 -ml-[3px] rounded-full bg-emerald-200"
                        style={{ boxShadow: '0 0 12px 3px rgba(110,231,183,0.9)' }}
                      />
                    </div>
                    <div
                      className="absolute inset-[9%] rounded-full border border-dashed border-white/15"
                      style={{ animation: 'splash-spin-rev 14s linear infinite' }}
                    />
                  </motion.div>
                </div>
              )}

              {LOGO_LETTERS.map((l, i) => (
                <Letter3D
                  key={l.src}
                  src={l.src}
                  ox={l.ox}
                  oy={l.oy}
                  index={i}
                  depth={reduced ? 0 : depth}
                  play={play}
                  reduced={reduced}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title card: decoded tagline */}
        <motion.div
          className="relative mt-10 sm:mt-14 flex items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={
            isExiting ? { opacity: 0, y: 0, filter: 'blur(6px)' } : showTagline ? { opacity: 1, y: 0 } : undefined
          }
          transition={{ duration: isExiting ? 0.35 : 0.6, ease: EASE_OUT_EXPO }}
        >
          <motion.span
            aria-hidden="true"
            className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-emerald-400/80 origin-right"
            initial={{ scaleX: 0 }}
            animate={showTagline ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
          />
          <span
            dir={isAr ? 'rtl' : 'ltr'}
            className={
              isAr
                ? 'text-sm sm:text-base font-bold text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                : 'font-mono text-[11px] sm:text-xs font-semibold tracking-[0.42em] text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)] ps-[0.42em]'
            }
          >
            <ScrambleText text={tagline} start={showTagline} glyphs={isAr ? GLYPHS_AR : GLYPHS_EN} />
          </span>
          <motion.span
            aria-hidden="true"
            className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-emerald-400/80 origin-left"
            initial={{ scaleX: 0 }}
            animate={showTagline ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
          />
        </motion.div>
      </div>

      {/* ═══ Film finishing: scanlines, grain, vignette ═══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)' }}
      />
      {!reduced && (
        <div
          aria-hidden="true"
          className="absolute -inset-[50%] pointer-events-none opacity-[0.09] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URL, animation: 'splash-grain 0.9s steps(5) infinite' }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.78) 100%)' }}
      />

      {/* Exit flash */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-emerald-50"
        initial={{ opacity: 0 }}
        animate={isExiting && !reduced ? { opacity: [0, 0.4, 0] } : { opacity: 0 }}
        transition={{ duration: 0.55, times: [0, 0.35, 1], ease: 'easeOut' }}
      />

      {/* ═══ Cinematic letterbox + HUD ═══ */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[7vh] min-h-[44px] bg-black flex items-center justify-between px-4 sm:px-8 border-b border-white/[0.04] z-20"
        initial={{ y: '-100%' }}
        animate={{ y: isExiting ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: isExiting ? 0.1 : 0.05 }}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/55">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b5c]" style={{ animation: 'splash-rec 1.2s ease-in-out infinite', boxShadow: '0 0 8px #ff3b5c' }} />
          <span>REC</span>
          <span className="hidden sm:inline text-white/25">— SCENE 01 / TAKE 01</span>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className="group flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/50 hover:text-emerald-300 transition-colors cursor-pointer px-2 py-1"
          title={isAr ? 'تخطي' : 'Skip'}
        >
          <span>{isAr ? 'تخطي' : 'SKIP'}</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded border border-white/15 text-[9px] tracking-normal text-white/40 group-hover:border-emerald-400/40 group-hover:text-emerald-300">
            ESC
          </kbd>
        </button>
      </motion.div>

      <motion.div
        className="absolute bottom-0 inset-x-0 h-[7vh] min-h-[44px] bg-black flex items-center justify-between px-4 sm:px-8 border-t border-white/[0.04] z-20"
        initial={{ y: '100%' }}
        animate={{ y: isExiting ? '100%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: isExiting ? 0.1 : 0.05 }}
      >
        {/* Progress line along the top edge of the bottom bar */}
        <div className="absolute left-0 right-0 -top-px h-px bg-white/[0.06]">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-emerald-500 via-emerald-300 to-cyan-300"
            style={{ transform: 'scaleX(0)', boxShadow: '0 0 10px rgba(52,211,153,0.8)' }}
          />
        </div>
        <span ref={timecodeRef} className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/55 tabular-nums">
          00:00:00:00
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/45 tabular-nums">
          <span className="hidden sm:inline text-white/25">{isAr ? 'جاري التحميل' : 'LOADING'} </span>
          <span ref={percentRef} className="text-emerald-300">000</span>%
        </span>
      </motion.div>

      {/* Viewfinder corners */}
      <div aria-hidden="true" className="absolute inset-x-4 sm:inset-x-8 top-[calc(max(7vh,44px)+14px)] bottom-[calc(max(7vh,44px)+14px)] pointer-events-none z-10">
        <Corner className="top-0 left-0 border-t border-l" delay={0.15} play={play && !isExiting} />
        <Corner className="top-0 right-0 border-t border-r" delay={0.22} play={play && !isExiting} />
        <Corner className="bottom-0 left-0 border-b border-l" delay={0.29} play={play && !isExiting} />
        <Corner className="bottom-0 right-0 border-b border-r" delay={0.36} play={play && !isExiting} />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
