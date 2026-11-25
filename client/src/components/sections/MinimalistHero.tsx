import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from '../ui/BrandIcons';
import { buttonVariants } from '../ui/Button';
import { SocialButton } from '../ui/SocialButton';
import { SplitText, BlurText, FadeContent, HeroBackground } from '../react-bits';
import { useLanguage } from '../../contexts/LanguageContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { resolveImageUrl } from '../../utils/mediaUrl';

/* ─── Animated Count-up for Hero Stats (Desktop only; static immediate on mobile for performance) ─── */
const AnimatedStatValue: React.FC<{ value: string }> = ({ value }) => {
  const isMobile = useIsMobile();
  const strVal = String(value ?? '');
  const match = strVal.match(/^([^0-9]*)(\d+)(.*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : '';

  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [displayNum, setDisplayNum] = useState<number>(() => (isMobile || !match ? targetNum : 0));

  useEffect(() => {
    if (isMobile || !match || !spanRef.current || hasAnimated.current) return;

    const el = spanRef.current;
    let timerId = 0;
    let animationFrameId = 0;
    let lastVal = -1;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          timerId = window.setTimeout(() => {
            let startTimestamp: number | null = null;
            const duration = 1300;

            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const elapsed = timestamp - startTimestamp;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const val = Math.round(easeOut * targetNum);

              if (val !== lastVal) {
                lastVal = val;
                setDisplayNum(val);
              }

              if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
              }
            };

            animationFrameId = requestAnimationFrame(step);
          }, 200);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerId) window.clearTimeout(timerId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, targetNum, match]);

  return (
    <span ref={spanRef} className="tabular-nums">
      {isMobile || !match ? strVal : `${prefix}${displayNum}${suffix}`}
    </span>
  );
};

export interface StatItem {
  value: string;
  label: string;
}

export interface MinimalistHeroProps {
  imageSrc?: string;
  hoverImageSrc?: string;
  headline?: string;
  heroText?: string;
  bioText?: string;
  stats?: StatItem[];
  typewriterWords?: string[];
  ctaText?: string;
  ctaHref?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

const formatStatLabel = (label: string) => {
  if (!label) return null;
  if (label.includes('\n')) {
    return label.split('\n').map((line, i) => (
      <span key={i} className="block leading-tight">{line}</span>
    ));
  }
  const words = label.trim().split(/\s+/);
  if (words.length === 2) {
    return (
      <>
        <span className="block leading-tight">{words[0]}</span>
        <span className="block leading-tight">{words[1]}</span>
      </>
    );
  }
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    return (
      <>
        <span className="block leading-tight">{line1}</span>
        <span className="block leading-tight">{line2}</span>
      </>
    );
  }
  return <span className="block leading-tight">{label}</span>;
};

const blobPath1 = 'M410.5,317.5Q372,385,299,419.5Q226,454,161.5,410Q97,366,66,298Q35,230,73.5,166Q112,102,181,71.5Q250,41,319,72Q388,103,418.5,176.5Q449,250,410.5,317.5Z';
const blobPath2 = 'M395,310Q350,370,285,410Q220,450,155,410Q90,370,65,300Q40,230,75,165Q110,100,180,65Q250,30,320,65Q390,100,415,165Q440,230,395,310Z';
const blobPath3 = 'M420,320Q380,390,300,425Q220,460,150,415Q80,370,55,295Q30,220,70,155Q110,90,185,60Q260,30,330,60Q400,90,430,160Q460,230,420,320Z';

/* ─── Desktop-Only Portrait Ferrofluid / Liquid-Metal Localized Radial Reveal ─── */
const CORE_LENS_RADIUS = 58;

// 6 organic orbiting ferrofluid lobes creating living liquid-metal waves around the hovered reveal zone
const FERRO_LOBES = [
  { dist: 42, distAmp: 14, speed: 1.15, phase: 0.0, r: 27, rAmp: 6 },
  { dist: 45, distAmp: 15, speed: -1.42, phase: 1.05, r: 24, rAmp: 6.5 },
  { dist: 40, distAmp: 13, speed: 1.78, phase: 2.1, r: 22, rAmp: 5.5 },
  { dist: 46, distAmp: 14, speed: -0.96, phase: 3.15, r: 26, rAmp: 6 },
  { dist: 41, distAmp: 16, speed: 2.12, phase: 4.2, r: 21, rAmp: 5.5 },
  { dist: 44, distAmp: 12, speed: -1.68, phase: 5.25, r: 23, rAmp: 5 },
] as const;

// 5 velocity-reactive trailing liquid mercury droplets
const FERRO_TRAIL_BASE_RADII = [36, 27, 20, 13.5, 8.5] as const;

// 6 delicate liquid-metal micro-beads floating around the outer ferrofluid perimeter
const FERRO_SPARKS = [
  { dist: 74, distAmp: 11, speed: 0.85, phase: 0.4, r: 1.9 },
  { dist: 80, distAmp: 13, speed: -1.12, phase: 1.7, r: 1.4 },
  { dist: 70, distAmp: 10, speed: 1.38, phase: 2.9, r: 2.1 },
  { dist: 86, distAmp: 12, speed: -0.74, phase: 4.1, r: 1.2 },
  { dist: 76, distAmp: 14, speed: 1.62, phase: 5.0, r: 1.7 },
  { dist: 82, distAmp: 9, speed: -1.31, phase: 5.9, r: 1.3 },
] as const;

// Total metaball circles per SVG mask: 1 core + 6 lobes + 5 trailing droplets = 12
const METABALL_INDICES = Array.from({ length: 1 + FERRO_LOBES.length + FERRO_TRAIL_BASE_RADII.length }, (_, i) => i);

const clampNum = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

const MinimalistHeroComponent: React.FC<MinimalistHeroProps> = ({
  imageSrc = '/portfolio_photo.webp',
  hoverImageSrc,
  headline,
  heroText,
  bioText = '',
  stats = [],
  typewriterWords = [],
  ctaText = 'See My Work',
  ctaHref = '#projects',
  githubUrl,
  linkedinUrl,
  instagramUrl,
  facebookUrl,
}) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const isMobile = useIsMobile();
  const isCompactViewport = useIsMobile(1024);
  const cubicEase = [0.22, 1, 0.36, 1] as const;

  const [startMorph, setStartMorph] = useState(false);
  useEffect(() => {
    // Skip continuous SVG path string morphing on mobile touch devices to keep mobile CPU completely free
    const isTouch = typeof window !== 'undefined' && (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);
    if (isTouch) return;
    const timer = setTimeout(() => setStartMorph(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* ─── Desktop-Only Localized Ferrofluid / Liquid-Metal Hover Reveal (Zero React re-renders per frame) ─── */
  const resolvedPrimarySrc = resolveImageUrl(imageSrc);
  const resolvedHoverSrc = hoverImageSrc ? resolveImageUrl(hoverImageSrc) : '';

  const [isDesktopHover, setIsDesktopHover] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth >= 1024 &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  });
  const [hoverImgReady, setHoverImgReady] = useState(false);
  const [stageSize, setStageSize] = useState<{ w: number; h: number }>({ w: 420, h: 420 });

  const stageRef = useRef<HTMLDivElement>(null);
  const primaryImgRef = useRef<HTMLImageElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const metalGradRef = useRef<SVGLinearGradientElement>(null);
  const rimRectRef = useRef<SVGRectElement>(null);

  // Direct SVG <circle> refs for all 3 synced metaball masks + orbiting metallic micro-beads
  const hoverCirclesRef = useRef<(SVGCircleElement | null)[]>([]);
  const primaryCirclesRef = useRef<(SVGCircleElement | null)[]>([]);
  const rimCirclesRef = useRef<(SVGCircleElement | null)[]>([]);
  const sparkCirclesRef = useRef<(SVGCircleElement | null)[]>([]);

  const ferroRef = useRef({
    rafId: 0,
    lastTime: 0,
    elapsed: 0,
    hovered: false,
    openness: 0,
    openVelocity: 0,
    cx: 210,
    cy: 210,
    targetCx: 210,
    targetCy: 210,
    speedSmooth: 0,
    reducedMotion: false,
    trail: FERRO_TRAIL_BASE_RADII.map(() => ({ x: 210, y: 210 })),
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const check = () => setIsDesktopHover(window.innerWidth >= 1024 && mq.matches);
    check();
    window.addEventListener('resize', check);
    mq.addEventListener?.('change', check);
    return () => {
      window.removeEventListener('resize', check);
      mq.removeEventListener?.('change', check);
    };
  }, []);

  // Preload secondary portrait cleanly on desktop only (0 network cost on mobile/tablet)
  useEffect(() => {
    setHoverImgReady(false);
    if (!isDesktopHover || !resolvedHoverSrc) return;

    let cancelled = false;
    const preload = new Image();
    preload.decoding = 'async';
    preload.onload = () => {
      if (!cancelled) setHoverImgReady(true);
    };
    preload.onerror = () => {
      if (!cancelled) setHoverImgReady(false);
    };
    preload.src = resolvedHoverSrc;
    if (preload.complete && preload.naturalWidth > 0) {
      setHoverImgReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, [isDesktopHover, resolvedHoverSrc]);

  // Keep SVG viewBox synced 1:1 with the primary portrait's unscaled layout dimensions
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !isDesktopHover) return;

    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 20 && h > 20) {
        setStageSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      }
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktopHover, isCompactViewport, resolvedPrimarySrc]);

  const canRadialReveal = isDesktopHover && Boolean(resolvedHoverSrc) && hoverImgReady;

  const setRestingVisuals = useCallback(() => {
    const state = ferroRef.current;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
    state.hovered = false;
    state.openness = 0;
    state.openVelocity = 0;
    state.speedSmooth = 0;

    if (primaryImgRef.current) {
      primaryImgRef.current.style.opacity = '1';
    }
    if (svgOverlayRef.current) {
      svgOverlayRef.current.style.opacity = '0';
      svgOverlayRef.current.style.visibility = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (!canRadialReveal) {
      setRestingVisuals();
    }
    return () => {
      const state = ferroRef.current;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    };
  }, [canRadialReveal, setRestingVisuals]);

  const writeMetaballCircle = useCallback((idx: number, x: number, y: number, r: number) => {
    const xStr = x.toFixed(1);
    const yStr = y.toFixed(1);
    const rStr = Math.max(0, r).toFixed(1);

    const hEl = hoverCirclesRef.current[idx];
    if (hEl) {
      hEl.setAttribute('cx', xStr);
      hEl.setAttribute('cy', yStr);
      hEl.setAttribute('r', rStr);
    }
    const pEl = primaryCirclesRef.current[idx];
    if (pEl) {
      pEl.setAttribute('cx', xStr);
      pEl.setAttribute('cy', yStr);
      pEl.setAttribute('r', rStr);
    }
    const rEl = rimCirclesRef.current[idx];
    if (rEl) {
      rEl.setAttribute('cx', xStr);
      rEl.setAttribute('cy', yStr);
      rEl.setAttribute('r', rStr);
    }
  }, []);

  const stepFerrofluid = useCallback(
    (now: number) => {
      const state = ferroRef.current;
      const svgEl = svgOverlayRef.current;
      const baseImg = primaryImgRef.current;

      if (!svgEl || !baseImg) {
        state.rafId = 0;
        return;
      }

      const dt = state.lastTime ? Math.min((now - state.lastTime) / 1000, 0.05) : 0.016;
      state.lastTime = now;
      state.elapsed += dt;
      const t = state.elapsed;

      // C1-continuous critically-damped spring for localized lens opening / closing (never covers full portrait)
      const targetOpen = state.hovered ? 1 : 0;
      const omega = state.hovered ? 9.4 : 10.6;
      const exp = Math.exp(-omega * dt);
      const delta = state.openness - targetOpen;
      const temp = (state.openVelocity + omega * delta) * dt;
      state.openVelocity = (state.openVelocity - omega * temp) * exp;
      state.openness = clampNum(targetOpen + (delta + temp) * exp, 0, 1);

      // Completely collapsed back to rest -> hide SVG overlay & sleep at 0% CPU/GPU
      if (!state.hovered && state.openness <= 0.004 && Math.abs(state.openVelocity) < 0.03) {
        state.openness = 0;
        state.openVelocity = 0;
        state.speedSmooth = 0;
        state.rafId = 0;
        baseImg.style.opacity = '1';
        svgEl.style.opacity = '0';
        svgEl.style.visibility = 'hidden';
        return;
      }

      // Activate SVG dual-masked layer synchronously on the exact same frame as hiding baseImg (zero flicker)
      if (svgEl.style.visibility !== 'visible') {
        svgEl.style.visibility = 'visible';
        svgEl.style.opacity = '1';
        baseImg.style.opacity = '0';
      }

      // Snappy liquid inertia for the main ferrofluid pool center
      const prevCx = state.cx;
      const prevCy = state.cy;
      const followLerp = 1 - Math.exp(-17 * dt);
      state.cx += (state.targetCx - state.cx) * followLerp;
      state.cy += (state.targetCy - state.cy) * followLerp;

      const instSpeed = Math.hypot(state.cx - prevCx, state.cy - prevCy) / Math.max(dt, 0.008);
      state.speedSmooth += (Math.min(instSpeed / 520, 1) - state.speedSmooth) * (1 - Math.exp(-10 * dt));

      const open = state.openness;
      const motionScale = state.reducedMotion ? 0 : 1;

      // 1. Core localized ferrofluid pool (breathes organically even when cursor is still)
      const coreBreath = motionScale * (3.2 * Math.sin(t * 2.15) + 1.6 * Math.cos(t * 3.4));
      const coreRadius = (CORE_LENS_RADIUS + coreBreath) * open;
      writeMetaballCircle(0, state.cx, state.cy, coreRadius);

      // 2. Orbiting ferrofluid perimeter lobes (living magnetic ripples around the hovered region)
      for (let i = 0; i < FERRO_LOBES.length; i++) {
        const lobe = FERRO_LOBES[i];
        if (motionScale === 0) {
          writeMetaballCircle(1 + i, state.cx, state.cy, 0);
          continue;
        }
        const angle = t * lobe.speed + lobe.phase;
        const radialWave =
          lobe.dist +
          lobe.distAmp * Math.sin(t * (1.7 + i * 0.23) + lobe.phase * 1.7) +
          state.speedSmooth * 6;
        const lx = state.cx + Math.cos(angle) * radialWave * open;
        const ly = state.cy + Math.sin(angle) * radialWave * open;
        const lr = (lobe.r + lobe.rAmp * Math.cos(t * (2.2 + i * 0.19) + lobe.phase)) * open;
        writeMetaballCircle(1 + i, lx, ly, lr);
      }

      // 3. Velocity-trailing liquid-metal metaball droplets (stretch into mercury tail & merge smoothly on stop)
      let leaderX = state.cx;
      let leaderY = state.cy;
      const trailOffset = 1 + FERRO_LOBES.length;

      for (let i = 0; i < FERRO_TRAIL_BASE_RADII.length; i++) {
        const node = state.trail[i];
        const lagRate = Math.max(7.5, 16.5 - i * 2.1);
        const step = 1 - Math.exp(-lagRate * dt);
        node.x += (leaderX - node.x) * step;
        node.y += (leaderY - node.y) * step;

        const distFromLeader = Math.hypot(leaderX - node.x, leaderY - node.y);
        // Droplets swell gracefully while streaking behind cursor, then softly melt back into core when stopped
        const streakBoost = Math.min(distFromLeader / 26, 1);
        const trailR =
          motionScale *
          FERRO_TRAIL_BASE_RADII[i] *
          (0.42 + 0.72 * streakBoost) *
          open;

        writeMetaballCircle(trailOffset + i, node.x, node.y, trailR);
        leaderX = node.x;
        leaderY = node.y;
      }

      // 4. Rotating brushed liquid-metal / chrome reflection along the dynamic rim
      if (metalGradRef.current) {
        const gradAngle = (t * 26) % 360;
        metalGradRef.current.setAttribute(
          'gradientTransform',
          `rotate(${gradAngle.toFixed(1)} ${state.cx.toFixed(1)} ${state.cy.toFixed(1)})`
        );
      }
      if (rimRectRef.current) {
        const rimAlpha = clampNum(open * 1.15, 0, 1) * (0.62 + 0.24 * state.speedSmooth);
        rimRectRef.current.setAttribute('opacity', rimAlpha.toFixed(3));
      }

      // 5. Delicate orbiting metallic micro-beads floating around the ferrofluid boundary
      for (let i = 0; i < FERRO_SPARKS.length; i++) {
        const el = sparkCirclesRef.current[i];
        if (!el) continue;
        if (motionScale === 0 || open < 0.08) {
          el.setAttribute('r', '0');
          el.setAttribute('opacity', '0');
          continue;
        }
        const sp = FERRO_SPARKS[i];
        const angle = t * sp.speed + sp.phase;
        const orbitR =
          (sp.dist + sp.distAmp * Math.sin(t * 1.9 + sp.phase * 2.1) + state.speedSmooth * 14) *
          open;
        const sx = state.cx + Math.cos(angle) * orbitR;
        const sy = state.cy + Math.sin(angle) * orbitR;
        const pulse = 0.55 + 0.45 * Math.sin(t * 3.1 + sp.phase * 2.7);
        const sr = sp.r * (0.75 + 0.35 * pulse) * open;
        const sop = (0.32 + 0.55 * pulse) * open;

        el.setAttribute('cx', sx.toFixed(1));
        el.setAttribute('cy', sy.toFixed(1));
        el.setAttribute('r', sr.toFixed(2));
        el.setAttribute('opacity', sop.toFixed(3));
      }

      state.rafId = requestAnimationFrame(stepFerrofluid);
    },
    [writeMetaballCircle]
  );

  const getLocalPortraitPoint = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    const w = stage.offsetWidth || 420;
    const h = stage.offsetHeight || 420;
    const lx = clampNum(((clientX - rect.left) / rect.width) * w, 0, w);
    const ly = clampNum(((clientY - rect.top) / rect.height) * h, 0, h);
    return { lx, ly };
  }, []);

  const handlePortraitPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canRadialReveal || e.pointerType === 'touch') return;

      const state = ferroRef.current;
      state.reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const pt = getLocalPortraitPoint(e.clientX, e.clientY);
      if (pt) {
        if (state.openness <= 0.05) {
          // Snap origin & trail right under entry point so the ferrofluid pool blooms directly under the cursor
          state.cx = pt.lx;
          state.cy = pt.ly;
          for (let i = 0; i < state.trail.length; i++) {
            state.trail[i].x = pt.lx;
            state.trail[i].y = pt.ly;
          }
        }
        state.targetCx = pt.lx;
        state.targetCy = pt.ly;
      }

      state.hovered = true;
      if (!state.rafId) {
        state.lastTime = 0;
        state.rafId = requestAnimationFrame(stepFerrofluid);
      }
    },
    [canRadialReveal, getLocalPortraitPoint, stepFerrofluid]
  );

  const handlePortraitPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canRadialReveal || e.pointerType === 'touch') return;
      const state = ferroRef.current;
      if (!state.hovered) return;

      const pt = getLocalPortraitPoint(e.clientX, e.clientY);
      if (!pt) return;

      state.targetCx = pt.lx;
      state.targetCy = pt.ly;
    },
    [canRadialReveal, getLocalPortraitPoint]
  );

  const handlePortraitPointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canRadialReveal || e.pointerType === 'touch') return;
      const state = ferroRef.current;

      const pt = getLocalPortraitPoint(e.clientX, e.clientY);
      if (pt) {
        state.targetCx = pt.lx;
        state.targetCy = pt.ly;
      }

      state.hovered = false;
      if (!state.rafId && state.openness > 0) {
        state.lastTime = 0;
        state.rafId = requestAnimationFrame(stepFerrofluid);
      }
    },
    [canRadialReveal, getLocalPortraitPoint, stepFerrofluid]
  );

  const headlineContent = headline || heroText || 'End-to-End Web Development & Software Engineering';
  const activeStats = stats || [];
  const words = typewriterWords || [];

  const resolvedLinks = [
    githubUrl && { label: 'GitHub', href: githubUrl, Icon: GithubIcon },
    linkedinUrl && { label: 'LinkedIn', href: linkedinUrl, Icon: LinkedinIcon },
    instagramUrl && { label: 'Instagram', href: instagramUrl, Icon: InstagramIcon },
    facebookUrl && { label: 'Facebook', href: facebookUrl, Icon: FacebookIcon },
  ].filter(Boolean) as { label: string; href: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[];

  const portraitAlt = isRtl
    ? 'صورة يوسف الأيوبي — مطور ويب ومهندس برمجيات'
    : 'Yousef Ayoubi — Full-Stack Developer & Software Engineer';

  return (
    <div className="relative min-h-[min(100svh,1440px)] lg:min-h-0 xl:min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-transparent">
      {/* ── Dynamic Portrait Bottom Mask: Crisp grounded edge in light mode, eased multi-stop studio fade in dark mode ── */}
      <style>{`
        .hero-portrait-stage {
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 95.8%, rgba(0, 0, 0, 0.72) 98.2%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 0%, black 95.8%, rgba(0, 0, 0, 0.72) 98.2%, transparent 100%);
        }
        .dark .hero-portrait-stage {
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 91%, rgba(0, 0, 0, 0.75) 96.5%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 0%, black 91%, rgba(0, 0, 0, 0.75) 96.5%, transparent 100%);
        }
        .hero-portrait-stage-mobile {
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 96.5%, rgba(0, 0, 0, 0.78) 98.8%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 0%, black 96.5%, rgba(0, 0, 0, 0.78) 98.8%, transparent 100%);
        }
        .dark .hero-portrait-stage-mobile {
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 78%,
            rgba(0, 0, 0, 0.88) 85%,
            rgba(0, 0, 0, 0.56) 91.5%,
            rgba(0, 0, 0, 0.2) 96.5%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 78%,
            rgba(0, 0, 0, 0.88) 85%,
            rgba(0, 0, 0, 0.56) 91.5%,
            rgba(0, 0, 0, 0.2) 96.5%,
            transparent 100%
          );
        }
        .hero-compact-layout {
          --hero-stage-h: clamp(295px, min(48svh, 96vw), 460px);
        }
        @media (min-width: 768px) {
          .hero-compact-layout {
            --hero-stage-h: clamp(340px, min(52svh, 78vw), 740px);
          }
        }
      `}</style>

      {/* ── Single Living Background: React Bits Ambient Backdrop (Light & Dark + Seamless Bottom Fade) ── */}
      <HeroBackground />

      {/* Main Hero Content */}
      {isCompactViewport ? (
        /* ═══════════════════════════════════════════════════════════════════════════
           MOBILE & SMALL/TALL TABLETS (< 1024px) — EDITORIAL STUDIO FLOW (NO SPECIALTIES/TYPEWRITER)
           Fluid viewport-proportional scaling from iPhone SE & 16 Pro Max to iPad Mini/Air & Surface Pro 10
        ═══════════════════════════════════════════════════════════════════════════ */
        <div className="hero-compact-layout relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-[80px] min-[420px]:pt-[90px] sm:pt-[96px] md:pt-[104px] min-[880px]:pt-[124px] pb-5 min-[420px]:pb-6 md:pb-8 min-[880px]:pb-10 flex flex-col justify-between">

          {/* ── 1. Top Editorial Opening Statement (Immediate Value Proposition Above the Fold) ── */}
          <div className="w-full max-w-2xl min-[880px]:max-w-3xl flex flex-col items-start text-start space-y-3 min-[420px]:space-y-3.5 md:space-y-4 min-[880px]:space-y-5">
            {/* Commanding Display Headline */}
            <h1 className="text-[1.8rem] min-[390px]:text-[2rem] min-[420px]:text-[2.15rem] sm:text-[2.45rem] md:text-[2.85rem] min-[880px]:text-[3.35rem] font-extrabold text-foreground tracking-[-0.025em] rtl:tracking-normal leading-[1.11] rtl:leading-[1.24] text-balance">
              {isMobile ? (
                headlineContent
              ) : (
                <SplitText
                  text={headlineContent}
                  delay={30}
                  duration={0.45}
                />
              )}
            </h1>

            {/* Crisp Editorial Bio */}
            {bioText ? (
              <p className="text-[14.5px] min-[420px]:text-[15.5px] sm:text-[16px] md:text-[17px] min-[880px]:text-[19px] text-muted-foreground leading-[1.6] max-w-[56ch]">
                {bioText}
              </p>
            ) : null}

            {/* Unified Action Row: Primary CTA + Social Links on one balanced baseline */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1.5 md:pt-2 min-[880px]:pt-2.5">
              <a
                href={ctaHref}
                className={`${buttonVariants({ variant: 'primary', size: 'default' })} min-[880px]:h-12 min-[880px]:px-7 min-[880px]:text-[15px]`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </a>

              {resolvedLinks.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-2.5 min-[880px]:gap-3">
                  {resolvedLinks.map((s) => (
                    <SocialButton
                      key={s.label}
                      href={s.href}
                      label={s.label}
                      icon={<s.Icon size={isMobile ? 17 : 19} />}
                      size={isMobile ? 'sm' : 'md'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 2. Monumental Grounded Portrait Stage + Architectural Bottom Metrics Floor ── */}
          <div className="relative w-full mt-6 min-[420px]:mt-7 md:mt-8 flex flex-col">

            {/* Full-Width Centered Portrait Stage — Fluidly scales to viewport height & width */}
            <div
              className="relative flex items-end justify-center w-full overflow-visible select-none pointer-events-none"
              style={{ height: 'var(--hero-stage-h)' }}
            >
              {/* Quiet Studio Backlight Depth (separates silhouette from obsidian grid without neon bloom) */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[94%] opacity-50 dark:opacity-100 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 68% 60% at 50% 56%, rgba(16, 185, 129, 0.10) 0%, rgba(14, 165, 233, 0.04) 44%, transparent 70%)',
                }}
              />

              {/* Sculptural Cyan-to-Emerald Studio Backdrop (proportionally locked 1:1 with portrait height across all viewports) */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none"
                style={{
                  width: 'calc(var(--hero-stage-h) * 1.036)',
                  height: 'calc(var(--hero-stage-h) * 1.036)',
                  top: 'calc(var(--hero-stage-h) * -0.097)',
                }}
              >
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    <linearGradient id="fluid-gradient-dark-compact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                      <stop offset="100%" stopColor="#064E3B" style={{ stopColor: '#064E3B' }} />
                    </linearGradient>
                    <linearGradient id="fluid-gradient-light-compact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                      <stop offset="60%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                      <stop offset="100%" stopColor="#064E3B" style={{ stopColor: '#064E3B' }} />
                    </linearGradient>
                  </defs>
                  <path
                    className="dark:fill-[url(#fluid-gradient-dark-compact)] fill-[url(#fluid-gradient-light-compact)]"
                    d={blobPath1}
                  />
                </svg>
              </div>

              {/* Monumental Portrait Silhouette — Exact stage height, grounded FLUSH to bottom floor (zero mid-air float) */}
              <div className="hero-portrait-stage-mobile relative z-10 h-full flex items-end justify-center shrink-0 pointer-events-none select-none">
                <img
                  src={resolvedPrimarySrc}
                  alt={portraitAlt}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={560}
                  height={420}
                  draggable={false}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  className="block h-full w-auto max-w-none object-contain object-bottom pointer-events-none select-none"
                />
              </div>
            </div>

            {/* ── 3. Architectural Metrics Floor (Physically grounds the portrait silhouette) ── */}
            {activeStats.length > 0 && (
              <div className="relative z-20 w-full border-t border-slate-900/[0.09] dark:border-white/[0.09] pt-4 min-[420px]:pt-5 md:pt-6 min-[880px]:pt-7">
                {/* Whisper-quiet hairline horizon sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent"
                />
                <div
                  className={`grid ${
                    activeStats.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2 min-[380px]:grid-cols-4'
                  } gap-y-4 gap-x-2.5 sm:gap-6 w-full`}
                >
                  {activeStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        idx > 0
                          ? 'min-[380px]:border-s min-[380px]:border-slate-900/[0.07] min-[380px]:dark:border-white/[0.07] min-[380px]:ps-2.5 sm:ps-5 min-[880px]:ps-7'
                          : ''
                      }`}
                    >
                      <span className="text-[1.25rem] min-[420px]:text-[1.35rem] sm:text-[1.5rem] md:text-[1.75rem] min-[880px]:text-[2.1rem] font-extrabold text-foreground font-mono tracking-tight tabular-nums leading-none">
                        <AnimatedStatValue value={stat.value} />
                      </span>
                      <span className="text-[10px] min-[420px]:text-[10.5px] sm:text-[11.5px] md:text-xs min-[880px]:text-[13px] font-medium text-muted-foreground uppercase rtl:normal-case tracking-[0.04em] sm:tracking-[0.06em] rtl:tracking-normal mt-1.5 min-[880px]:mt-2 leading-snug">
                        {formatStatLabel(stat.label)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════════════
           LARGE IPADS & DESKTOP (>= 1024px) — UNTOUCHED SIGNATURE 3-COLUMN HERO
        ═══════════════════════════════════════════════════════════════════════════ */
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-6 pt-20 sm:pt-24 md:pt-28 xl:pt-32 pb-8 md:pb-12 xl:pb-8 flex flex-col justify-center md:justify-start xl:justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">

            {/* ── Left Column (desktop & tablet): Headline, Bio, CTA, Social, Stats ── */}
            <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-5 flex flex-col items-start z-10 min-w-0">
              <motion.div
                initial={isMobile ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={isMobile ? { duration: 0 } : { duration: 0.3 }}
                className="space-y-5 sm:space-y-6 w-full"
              >
                {/* Headline + Bio */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-3">
                    {isMobile ? (
                      headlineContent
                    ) : (
                      <SplitText
                        text={headlineContent}
                        delay={30}
                        duration={0.45}
                      />
                    )}
                  </h1>
                  {bioText ? (
                    isMobile ? (
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                        {bioText}
                      </p>
                    ) : (
                      <BlurText
                        text={bioText}
                        animateBy="block"
                        delay={20}
                        className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
                      />
                    )
                  ) : null}
                </div>

                {/* CTA Button */}
                <FadeContent delay={0.2} blur={false} distance={15}>
                  <a
                    href={ctaHref}
                    className={buttonVariants({ variant: 'primary', size: 'default' })}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                  </a>
                </FadeContent>

                {/* Social Icons — Balanced White / Obsidian glass with luminous emerald hover */}
                {resolvedLinks.length > 0 && (
                  <FadeContent delay={0.3} blur={false} distance={12}>
                    <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
                      {resolvedLinks.map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={isMobile ? false : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={isMobile ? { duration: 0 } : { delay: 0.08 + i * 0.03, duration: 0.2 }}
                        >
                          <SocialButton
                            href={s.href}
                            label={s.label}
                            icon={<s.Icon size={18} />}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </FadeContent>
                )}

                {/* Stats Bar */}
                {activeStats.length > 0 && (
                  <FadeContent delay={0.4} blur={false} distance={15}>
                    <div
                      className={`grid ${activeStats.length === 3
                        ? 'grid-cols-3 sm:grid-cols-3 lg:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-4'
                        } gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border/40 mt-5 sm:mt-6 w-full`}
                    >
                      {activeStats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-lg sm:text-2xl font-extrabold text-foreground font-mono">
                            <AnimatedStatValue value={stat.value} />
                          </span>
                          <span className="text-[0.6875rem] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1 sm:mt-1.5 leading-snug">
                            {formatStatLabel(stat.label)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </FadeContent>
                )}
              </motion.div>
            </div>

            {/* ── Center/Right Column: Blob + Image (5 cols on large tablet/iPad, 4 cols on desktop) ── */}
            <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4 relative flex flex-col justify-center items-center min-w-0">

              {/* Blob + Profile Image (Anchored & Stationary, zero mouse movement) */}
              <div className="relative flex justify-center items-center min-h-[21.875rem] sm:min-h-[24.375rem] md:min-h-[26.25rem] lg:min-h-[28.75rem] xl:min-h-[31.25rem] w-full select-none pointer-events-none">
                {/* Fluid Blob Backdrop — Enlarged to match reference photo, perfectly framing profile */}
                <div className="absolute -top-7 sm:-top-9 md:-top-10 lg:-top-11 xl:-top-12 w-[20rem] h-[20rem] sm:w-[22.5rem] sm:h-[22.5rem] md:w-[24.375rem] md:h-[24.375rem] lg:w-[25rem] lg:h-[25rem] xl:w-[28.125rem] xl:h-[28.125rem] z-0 pointer-events-none select-none">
                  <motion.div
                    initial={isMobile ? false : { scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={isMobile ? { duration: 0 } : { duration: 0.4, ease: cubicEase }}
                    className="w-full h-full relative"
                  >
                    <svg viewBox="0 0 500 500" className="w-full h-full transform-gpu" style={{ willChange: 'transform' }}>
                      <defs>
                        {/* Dark Mode Gradient: Cyan into Primary Theme */}
                        <linearGradient id="fluid-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0EA5E9" />
                          <stop offset="50%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                          <stop offset="100%" stopColor="#064E3B" style={{ stopColor: '#064E3B' }} />
                        </linearGradient>
                        {/* Light Mode Gradient: Luminous, eye-friendly theme gradient */}
                        <linearGradient id="fluid-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                          <stop offset="60%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                          <stop offset="100%" stopColor="#064E3B" style={{ stopColor: '#064E3B' }} />
                        </linearGradient>
                      </defs>
                      <motion.path
                        className="dark:fill-[url(#fluid-gradient-dark)] fill-[url(#fluid-gradient-light)]"
                        d={blobPath1}
                        animate={startMorph ? { d: [blobPath1, blobPath2, blobPath3, blobPath1] } : undefined}
                        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Profile Image — Anchored, zero mouse movement, bottom aligned with page elements */}
                <motion.div
                  initial={isMobile ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isMobile ? { duration: 0 } : { duration: 0.35, ease: cubicEase }}
                  className="relative z-10 flex items-center justify-center pointer-events-none select-none transform-gpu"
                  style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
                >
                  <div
                    ref={stageRef}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      pointerEvents: 'none',
                    }}
                    className="hero-portrait-stage relative w-[17.1875rem] sm:w-[19.6875rem] md:w-[21.25rem] lg:w-[23.125rem] xl:w-[26.25rem] scale-[1.54] sm:scale-[1.56] md:scale-[1.58] lg:scale-[1.56] xl:scale-[1.6] translate-y-0 sm:translate-y-1 md:translate-y-1 lg:translate-y-2 xl:translate-y-2 pointer-events-none select-none"
                  >
                    <img
                      ref={primaryImgRef}
                      src={resolvedPrimarySrc}
                      alt={portraitAlt}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      width={420}
                      height={420}
                      draggable={false}
                      onLoad={() => {
                        const el = stageRef.current;
                        if (el && el.offsetWidth > 20 && el.offsetHeight > 20) {
                          setStageSize({ w: el.offsetWidth, h: el.offsetHeight });
                        }
                      }}
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        pointerEvents: 'none',
                      }}
                      className="block w-full h-auto object-contain pointer-events-none select-none"
                    />

                    {/* Desktop-only Localized Ferrofluid / Liquid-Metal Dual-Portrait SVG Reveal Layer */}
                    {canRadialReveal && (
                      <svg
                        ref={svgOverlayRef}
                        viewBox={`0 0 ${stageSize.w} ${stageSize.h}`}
                        aria-hidden="true"
                        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
                        style={{
                          opacity: 0,
                          visibility: 'hidden',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          pointerEvents: 'none',
                        }}
                      >
                        <defs>
                          {/* 1. Gooey Ferrofluid Metaball Filter (Secondary Hover Portrait Mask) */}
                          <filter id="hero-ferro-hover-goo" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="9.5" result="blur" />
                            <feColorMatrix
                              in="blur"
                              mode="matrix"
                              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8.5"
                              result="goo"
                            />
                            <feGaussianBlur in="goo" stdDeviation="1.8" />
                          </filter>

                          {/* 2. Slightly Tighter Inner Cutout Filter (Primary Portrait Mask — prevents dark seam & zero ghosting) */}
                          <filter id="hero-ferro-primary-goo" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="9.5" result="blur" />
                            <feColorMatrix
                              in="blur"
                              mode="matrix"
                              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10.2"
                              result="goo"
                            />
                            <feGaussianBlur in="goo" stdDeviation="1.4" />
                          </filter>

                          {/* 3. Liquid-Metal Contour Rim Extractor (Razor-fine chrome ring + soft specular halo) */}
                          <filter id="hero-ferro-rim-goo" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="9.5" result="blur" />
                            <feColorMatrix
                              in="blur"
                              mode="matrix"
                              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9.0"
                              result="goo"
                            />
                            <feMorphology in="goo" operator="erode" radius="1.25" result="inner" />
                            <feComposite in="goo" in2="inner" operator="out" result="ring" />
                            <feGaussianBlur in="ring" stdDeviation="2.2" result="halo" />
                            <feComponentTransfer in="halo" result="softHalo">
                              <feFuncA type="linear" slope="0.42" />
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode in="softHalo" />
                              <feMergeNode in="ring" />
                            </feMerge>
                          </filter>

                          {/* Rotating Brushed Liquid-Chrome / Titanium-Emerald Metallic Gradient */}
                          <linearGradient
                            ref={metalGradRef}
                            id="hero-liquid-metal-grad"
                            gradientUnits="userSpaceOnUse"
                            x1="0"
                            y1="0"
                            x2={stageSize.w}
                            y2={stageSize.h}
                          >
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="18%" stopColor="#94a3b8" />
                            <stop offset="35%" stopColor="#ffffff" />
                            <stop offset="52%" stopColor="var(--theme-primary-hex, #10b981)" style={{ stopColor: 'var(--theme-primary-hex, #10b981)' }} />
                            <stop offset="68%" stopColor="#38bdf8" />
                            <stop offset="84%" stopColor="#64748b" />
                            <stop offset="100%" stopColor="#f8fafc" />
                          </linearGradient>

                          {/* Mask A: Reveals Secondary Portrait ONLY inside the localized ferrofluid pool */}
                          <mask
                            id="hero-ferro-hover-mask"
                            maskUnits="userSpaceOnUse"
                            x={-stageSize.w * 0.15}
                            y={-stageSize.h * 0.15}
                            width={stageSize.w * 1.3}
                            height={stageSize.h * 1.3}
                          >
                            <rect
                              x={-stageSize.w * 0.15}
                              y={-stageSize.h * 0.15}
                              width={stageSize.w * 1.3}
                              height={stageSize.h * 1.3}
                              fill="#000"
                            />
                            <g filter="url(#hero-ferro-hover-goo)" fill="#fff">
                              {METABALL_INDICES.map((idx) => (
                                <circle
                                  key={`h-${idx}`}
                                  ref={(el) => { hoverCirclesRef.current[idx] = el; }}
                                  cx={stageSize.w / 2}
                                  cy={stageSize.h / 2}
                                  r={0}
                                />
                              ))}
                            </g>
                          </mask>

                          {/* Mask B: Dissolves Primary Portrait cleanly inside the ferrofluid pool (zero ghosting) */}
                          <mask
                            id="hero-ferro-primary-mask"
                            maskUnits="userSpaceOnUse"
                            x={-stageSize.w * 0.15}
                            y={-stageSize.h * 0.15}
                            width={stageSize.w * 1.3}
                            height={stageSize.h * 1.3}
                          >
                            <rect
                              x={-stageSize.w * 0.15}
                              y={-stageSize.h * 0.15}
                              width={stageSize.w * 1.3}
                              height={stageSize.h * 1.3}
                              fill="#fff"
                            />
                            <g filter="url(#hero-ferro-primary-goo)" fill="#000">
                              {METABALL_INDICES.map((idx) => (
                                <circle
                                  key={`p-${idx}`}
                                  ref={(el) => { primaryCirclesRef.current[idx] = el; }}
                                  cx={stageSize.w / 2}
                                  cy={stageSize.h / 2}
                                  r={0}
                                />
                              ))}
                            </g>
                          </mask>

                          {/* Mask C: Carves the exact animated liquid-metal perimeter contour */}
                          <mask
                            id="hero-ferro-rim-mask"
                            maskUnits="userSpaceOnUse"
                            x={-stageSize.w * 0.15}
                            y={-stageSize.h * 0.15}
                            width={stageSize.w * 1.3}
                            height={stageSize.h * 1.3}
                          >
                            <rect
                              x={-stageSize.w * 0.15}
                              y={-stageSize.h * 0.15}
                              width={stageSize.w * 1.3}
                              height={stageSize.h * 1.3}
                              fill="#000"
                            />
                            <g filter="url(#hero-ferro-rim-goo)" fill="#fff">
                              {METABALL_INDICES.map((idx) => (
                                <circle
                                  key={`r-${idx}`}
                                  ref={(el) => { rimCirclesRef.current[idx] = el; }}
                                  cx={stageSize.w / 2}
                                  cy={stageSize.h / 2}
                                  r={0}
                                />
                              ))}
                            </g>
                          </mask>
                        </defs>

                        {/* Layer 1: Primary Portrait (masked away inside hovered liquid pool) */}
                        <image
                          href={resolvedPrimarySrc}
                          x="0"
                          y="0"
                          width={stageSize.w}
                          height={stageSize.h}
                          preserveAspectRatio="xMidYMid meet"
                          mask="url(#hero-ferro-primary-mask)"
                        />

                        {/* Layer 2: Secondary Portrait (revealed ONLY inside hovered liquid pool) */}
                        <image
                          href={resolvedHoverSrc}
                          x="0"
                          y="0"
                          width={stageSize.w}
                          height={stageSize.h}
                          preserveAspectRatio="xMidYMid meet"
                          mask="url(#hero-ferro-hover-mask)"
                        />

                        {/* Layer 3: Gleaming Liquid-Metal Chrome Contour along the undulating ferrofluid edge */}
                        <rect
                          ref={rimRectRef}
                          x={-stageSize.w * 0.15}
                          y={-stageSize.h * 0.15}
                          width={stageSize.w * 1.3}
                          height={stageSize.h * 1.3}
                          fill="url(#hero-liquid-metal-grad)"
                          mask="url(#hero-ferro-rim-mask)"
                          opacity="0"
                        />

                        {/* Layer 4: Orbiting Liquid-Metal Chrome Micro-Beads */}
                        <g fill="url(#hero-liquid-metal-grad)">
                          {FERRO_SPARKS.map((_, idx) => (
                            <circle
                              key={`s-${idx}`}
                              ref={(el) => { sparkCirclesRef.current[idx] = el; }}
                              cx={stageSize.w / 2}
                              cy={stageSize.h / 2}
                              r={0}
                              opacity={0}
                            />
                          ))}
                        </g>
                      </svg>
                    )}
                  </div>
                </motion.div>

                {/* Desktop-only Interactive Hover Hit-Zone tightly fitted to the portrait silhouette */}
                {canRadialReveal && (
                  <div
                    aria-hidden="true"
                    onPointerEnter={handlePortraitPointerEnter}
                    onPointerMove={handlePortraitPointerMove}
                    onPointerLeave={handlePortraitPointerLeave}
                    className="hidden lg:block absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-[49%] w-[18.75rem] xl:w-[23.125rem] h-[26.25rem] xl:h-[30.625rem] rounded-[46%_46%_34%_34%] pointer-events-auto"
                  />
                )}
              </div>
            </div>

            {/* ── Right Column (desktop only >= xl): Specialties stacked vertically, original clean dash & hover ── */}
            {words.length > 0 && (
              <div className="hidden xl:flex order-3 xl:col-span-3 xl:justify-start rtl:xl:justify-start xl:items-center z-10 min-w-0 w-full pl-1 xl:pl-3 rtl:pl-0 rtl:pr-1 rtl:xl:pr-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                  className="w-auto min-w-max flex flex-col items-start rtl:items-start text-start rtl:text-start space-y-3.5 lg:space-y-4 xl:space-y-5"
                >
                  {words.map((role, idx) => {
                    const cleanRole = typeof role === 'string'
                      ? (role.trim().startsWith('-') || role.trim().startsWith('—') ? role.trim().substring(1).trim() : role.trim())
                      : role;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ x: isRtl ? -12 : 12 }}
                        transition={{
                          duration: 0.28,
                          ease: cubicEase,
                          delay: 0.05 + idx * 0.03,
                        }}
                        className="flex items-center cursor-pointer py-0.5"
                      >
                        <span className="hero-role-dash text-foreground/90 font-extrabold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mr-2.5 rtl:mr-0 rtl:ml-2.5 shrink-0 leading-none">
                          -
                        </span>
                        <span
                          className="hero-role-text whitespace-nowrap text-base sm:text-lg lg:text-[1.15rem] xl:text-[1.4rem] 2xl:text-[1.65rem] font-extrabold tracking-tight rtl:tracking-normal uppercase rtl:normal-case text-foreground/90 leading-none"
                          dir="auto"
                        >
                          {cleanRole}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

const MinimalistHero = React.memo(MinimalistHeroComponent);
export default MinimalistHero;
