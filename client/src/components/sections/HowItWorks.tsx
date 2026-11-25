import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { SplitText, BlurText } from '../react-bits';
import type { PortfolioSettings, WorkflowStepApiData } from '../../types/portfolio';

/* ═══════════════════════════════════════════════════════════════════
   Pushpin SVG — 3D pinned head with punctured paper effect
   ═══════════════════════════════════════════════════════════════════ */
const Pushpin = ({ color, isMobile }: { color: string; isMobile?: boolean }) => {
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      width={isMobile ? "30" : "38"}
      height={isMobile ? "26" : "34"}
      viewBox="0 0 38 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isMobile ? "w-[1.875rem] h-[1.625rem] select-none overflow-visible" : "w-[2.375rem] h-[2.125rem] select-none overflow-visible"}
      aria-hidden="true"
    >
      <defs>
        {/* Lightweight radial gradient shadow (0 SVG Gaussian blur filter cost during animation) */}
        <radialGradient id={`shadow_${safeId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.34)" />
          <stop offset="65%" stopColor="rgba(0,0,0,0.14)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* 3D Sphere Radial Gradient */}
        <radialGradient
          id={`pin3d_${safeId}`}
          cx="34%"
          cy="30%"
          r="68%"
          fx="28%"
          fy="24%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="38%" stopColor={color} />
          <stop offset="78%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
        </radialGradient>

        {/* Paper Dent / Depression Gradient */}
        <radialGradient id={`dent_${safeId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── 1. Paper Depression / Dent (انبعاج الورقة مكان الدبوس) ── */}
      <ellipse cx="19" cy="22" rx="14" ry="6.5" fill={`url(#dent_${safeId})`} />

      {/* ── 2. Punctured Hole in Paper (البخش / الثقب) ── */}
      <ellipse cx="19" cy="22.5" rx="6" ry="2.2" fill="#18181b" opacity="0.85" />
      <path
        d="M 13.5 22 Q 19 24.5 24.5 22 Q 19 21 13.5 22 Z"
        fill="#09090b"
        opacity="0.9"
      />
      {/* Pierced paper edge highlights (torn paper rim) */}
      <path
        d="M 14.2 23 Q 19 24.8 23.8 23"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      {/* Paper stress micro-creases */}
      <line x1="14" y1="22" x2="10.5" y2="23" stroke="rgba(0,0,0,0.22)" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="24" y1="22" x2="27.5" y2="23" stroke="rgba(0,0,0,0.22)" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="19" y1="23.5" x2="19" y2="26" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" strokeLinecap="round" />

      {/* ── 3. Head Cast Shadow onto Paper ── */}
      <ellipse
        cx="19"
        cy="23"
        rx="10.5"
        ry="4.5"
        fill={`url(#shadow_${safeId})`}
      />

      {/* ── 4. 3D Pin Head (فقط رأس الدبوس ثلاثي الأبعاد) ── */}
      {/* Base 3D Sphere */}
      <circle cx="19" cy="13.5" r="10" fill={`url(#pin3d_${safeId})`} />

      {/* Subtle outer contour border */}
      <circle cx="19" cy="13.5" r="10" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />

      {/* Primary Gloss Highlight (soft reflection) */}
      <ellipse
        cx="16"
        cy="10"
        rx="3.6"
        ry="1.8"
        transform="rotate(-28 16 10)"
        fill="#ffffff"
        opacity="0.65"
      />

      {/* Intense Specular Glint (sharp pinpoint light) */}
      <circle cx="15" cy="9" r="1.3" fill="#ffffff" opacity="0.9" />

      {/* Bottom ambient bounce light from paper */}
      <path
        d="M 12 17.5 Q 19 22.5 26 17.5"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Step data
   ═══════════════════════════════════════════════════════════════════ */
interface Step {
  num: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  pinColor: string;
  tilt: number;
  side: 'left' | 'right';
  paperBg: string;
  paperEdge: string;
}

/* ═══════════════════════════════════════════════════════════════════
   Sticky Note Card
   ═══════════════════════════════════════════════════════════════════ */
const StickyNoteCard = memo(({
  step,
  isMobile,
  isRtl,
  isRevealed,
  isFirst,
  onRevealChange,
}: {
  step: Step;
  isMobile?: boolean;
  isRtl?: boolean;
  isRevealed: boolean;
  isFirst?: boolean;
  onRevealChange?: (revealed: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const baseTilt = isRtl ? -step.tilt : step.tilt;
  // On mobile: subtle tilt so vertical cards look naturally pinned without drifting
  const tilt = isMobile ? baseTilt * 0.45 : baseTilt;
  const isVisualLeft = isRtl ? (step.side === 'right') : (step.side === 'left');

  const onRevealChangeRef = useRef(onRevealChange);
  useEffect(() => {
    onRevealChangeRef.current = onRevealChange;
  });

  // On desktop: first card is driven by IntersectionObserver (subsequent cards by connector line)
  // On mobile: all cards are rendered statically and immediately without scroll-blocking observers
  useEffect(() => {
    if (isMobile) return;
    if (!ref.current) return;
    if (!isFirst) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onRevealChangeRef.current?.(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '200000px 0px -22% 0px',
        threshold: 0,
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isFirst, isMobile]);

  // Realistic tactile paper & pushpin kinematics (pivoting from the top pushpin hole)
  const unpinnedSwing = tilt + (isVisualLeft ? -5.5 : 5.5);
  const unpinnedRotateY = isVisualLeft ? 7 : -7;
  const stackBottomRotate = isRtl ? -1.8 : 1.8;
  const stackMiddleRotate = isRtl ? 1.1 : -1.1;

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        perspective: isMobile ? undefined : '1200px',
        transform: 'translateZ(0)',
      }}
    >
      <motion.div
        className="relative will-change-transform"
        initial={
          isMobile
            ? false
            : {
                opacity: 0,
                y: -14,
                scale: 1.035,
                rotateX: 18,
                rotateY: unpinnedRotateY,
                rotate: unpinnedSwing,
              }
        }
        animate={
          isMobile
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                rotate: tilt,
              }
            : isRevealed
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                rotate: tilt,
              }
            : {
                opacity: 0,
                y: -10,
                scale: 0.96,
                rotateX: 16,
                rotateY: -unpinnedRotateY * 0.8,
                rotate: tilt + (isVisualLeft ? 4.5 : -4.5),
              }
        }
        transition={
          isMobile
            ? { duration: 0 }
            : isRevealed
            ? {
                type: 'spring',
                stiffness: 185,
                damping: 20,
                mass: 0.75,
                opacity: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
              }
            : {
                duration: 0.22,
                ease: 'easeIn',
              }
        }
        style={{
          transformOrigin: '50% 22px',
        }}
      >
        {/* ── Paper Stack Behind: 100% Opaque Physical Sheets (Pure GPU CSS transitions) ── */}
        {/* Deepest backing sheet (Sheet 3) */}
        <div
          className="absolute inset-0 rounded-[1px] pointer-events-none overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] delay-75"
          style={{
            backgroundColor: step.paperEdge,
            backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)',
            border: '1px solid rgba(0,0,0,0.10)',
            boxShadow: isMobile
              ? '0 3px 8px rgba(0,0,0,0.12)'
              : '0 6px 16px rgba(0,0,0,0.16), 0 2px 5px rgba(0,0,0,0.10)',
            transformOrigin: '50% 22px',
            transform: isRevealed
              ? `translate3d(${isRtl ? -3 : 3}px, ${isMobile ? 3.5 : 5}px, 0) rotate(${stackBottomRotate}deg)`
              : 'translate3d(0, 0, 0) rotate(0deg)',
          }}
        />

        {/* Middle backing sheet (Sheet 2) */}
        <div
          className="absolute inset-0 rounded-[1px] pointer-events-none overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] delay-50"
          style={{
            backgroundColor: step.paperBg,
            backgroundImage: `linear-gradient(180deg, ${step.paperEdge}88 0%, rgba(0,0,0,0.03) 100%)`,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: isMobile
              ? '0 2px 6px rgba(0,0,0,0.10)'
              : '0 3px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
            transformOrigin: '50% 22px',
            transform: isRevealed
              ? `translate3d(${isRtl ? (isMobile ? 1.5 : 2) : (isMobile ? -1.5 : -2)}px, ${isMobile ? 2 : 2.5}px, 0) rotate(${stackMiddleRotate}deg)`
              : 'translate3d(0, 0, 0) rotate(0deg)',
          }}
        />

        {/* Main paper (Top Sheet) */}
        <div
          className="relative rounded-[1px] overflow-hidden"
          style={{
            background: step.paperBg,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: isMobile
              ? '0 4px 14px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)'
              : '0 12px 24px -4px rgba(0,0,0,0.14), 0 3px 8px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.85)',
          }}
        >
          {/* Paper texture — desktop only (no mix-blend-multiply barrier inside 3D layer) */}
          {!isMobile && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.035,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
                backgroundSize: '8px 8px',
              }}
            />
          )}
          {/* Ruled lines — single GPU gradient background (zero extra DOM nodes) */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              top: isMobile ? '3.375rem' : '4.5rem',
              opacity: 0.045,
              backgroundImage: `repeating-linear-gradient(to bottom, #6b7280 0, #6b7280 0.8px, transparent 0.8px, transparent ${isMobile ? '1.125rem' : '1.375rem'})`,
            }}
          />
          {/* Red margin (mirrored on right side for RTL Arabic writing) */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ [isRtl ? 'right' : 'left']: isMobile ? '1.75rem' : '2.25rem', width: '1.2px', background: 'rgba(220,50,50,0.08)' }}
          />
          {/* Top adhesive */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: '0.375rem', background: `linear-gradient(180deg, ${step.paperEdge}90, transparent)` }}
          />

          {/* Pushpin — crisp GPU CSS strike transition on reveal */}
          <div
            className="flex justify-center pt-1.5 sm:pt-2 relative z-10 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] delay-75"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, -14px, 0) scale(1.22)',
            }}
          >
            <Pushpin color={step.pinColor} isMobile={isMobile} />
          </div>

          {/* Content — compact, proportional mobile sizing */}
          <div className={`px-4 sm:px-7 pb-4 sm:pb-7 pt-0.5 sm:pt-2 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* Header: Number and Title side-by-side */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2.5">
              <span
                className="text-lg sm:text-2xl font-black font-sans tracking-tight leading-none select-none shrink-0"
                style={{ color: '#1a1a2e' }}
              >
                {step.num}
              </span>
              <h3 className="text-[0.95rem] sm:text-xl font-extrabold tracking-tight leading-snug" style={{ color: '#1a1a2e' }}>
                {step.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 mb-2 sm:mb-4">
              <div className="w-6 sm:w-8 h-[2.5px] sm:h-[3px] rounded-full" style={{ background: step.pinColor }} />
              <div className="w-2.5 sm:w-3 h-[2.5px] sm:h-[3px] rounded-full" style={{ background: `${step.pinColor}40` }} />
              <div className="w-1.5 h-[2.5px] sm:h-[3px] rounded-full" style={{ background: `${step.pinColor}20` }} />
            </div>
            <p className="text-[0.76rem] sm:text-[0.88rem] leading-[1.55] sm:leading-[1.65]" style={{ color: '#3d3d5c' }}>
              {step.description}
            </p>
          </div>

          {/* Corner fold (mirrored to bottom-left for RTL) */}
          <div
            className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} pointer-events-none overflow-hidden`}
            style={{ width: isMobile ? '1.125rem' : '1.5rem', height: isMobile ? '1.125rem' : '1.5rem' }}
          >
            <div
              className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} ${isMobile ? 'w-[1.5625rem] h-[1.5625rem]' : 'w-[2.125rem] h-[2.125rem]'}`}
              style={{
                background: isRtl
                  ? `linear-gradient(225deg, ${step.paperBg} 48%, ${step.paperEdge} 50%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.02) 100%)`
                  : `linear-gradient(135deg, ${step.paperBg} 48%, ${step.paperEdge} 50%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.02) 100%)`,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

StickyNoteCard.displayName = 'StickyNoteCard';

/* ═══════════════════════════════════════════════════════════════════
   Connector Segment — animated SVG between two cards
   ═══════════════════════════════════════════════════════════════════ */
const ConnectorSegment = memo(({
  fromSide,
  toSide,
  index: _index,
  isMobile,
  isRtl,
  isActive,
  onReachChange,
}: {
  fromSide: 'left' | 'right';
  toSide: 'left' | 'right';
  fromColor?: string;
  toColor?: string;
  index?: number;
  isMobile?: boolean;
  isRtl?: boolean;
  isActive: boolean;
  onReachChange?: (reached: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isMobile ? ['start 92%', 'end 68%'] : ['start 80%', 'end 54%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 260 : 120,
    damping: isMobile ? 32 : 26,
    mass: isMobile ? 0.35 : 0.6,
    restDelta: 0.001,
  });

  // Calculate actual visual position taking RTL into account
  // In RTL, justify-start ('left') is rendered on the visual RIGHT (72%)
  // and justify-end ('right') is rendered on the visual LEFT (28%)
  // On mobile: both cards are centered vertically, so connector connects straight down center-to-center
  const getVisualX = (side: 'left' | 'right') => {
    if (isMobile) {
      return 50;
    }
    const isVisualLeft = isRtl ? (side === 'right') : (side === 'left');
    return isVisualLeft ? 28 : 72;
  };

  const fromXNum = getVisualX(fromSide);
  const toXNum = getVisualX(toSide);

  // Short, compact distance on mobile vs full generous distance on desktop
  const svgHeight = isMobile ? 38 : 130;
  const startY = 0;
  const endY = svgHeight;
  const cp1Y = svgHeight * 0.35;
  const cp2Y = svgHeight * 0.65;

  const d = isMobile
    ? `M 50 0 C 48 ${svgHeight * 0.35}, 52 ${svgHeight * 0.65}, 50 ${svgHeight}`
    : `M ${fromXNum} ${startY} C ${fromXNum} ${cp1Y}, ${toXNum} ${cp2Y}, ${toXNum} ${endY}`;

  const isReachedRef = useRef(false);
  const onReachChangeRef = useRef(onReachChange);
  useEffect(() => {
    onReachChangeRef.current = onReachChange;
  });

  // Monitor line progress to trigger card reveal when touching and hide when retracting
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (!isActive) {
      if (isReachedRef.current) {
        isReachedRef.current = false;
        onReachChangeRef.current?.(false);
      }
      return;
    }

    const revealThresh = isMobile ? 0.82 : 0.92;
    const hideThresh = isMobile ? 0.65 : 0.78;

    if (latest >= revealThresh && !isReachedRef.current) {
      isReachedRef.current = true;
      onReachChangeRef.current?.(true);
    } else if (latest < hideThresh && isReachedRef.current) {
      isReachedRef.current = false;
      onReachChangeRef.current?.(false);
    }
  });

  // Synchronize on mount or when isActive updates
  useEffect(() => {
    if (!isActive) {
      if (isReachedRef.current) {
        isReachedRef.current = false;
        onReachChangeRef.current?.(false);
      }
      return;
    }

    const checkState = () => {
      const rawVal = scrollYProgress.get();
      const smoothVal = smoothProgress.get();
      const currentVal = Math.max(rawVal, smoothVal);
      const revealThresh = isMobile ? 0.82 : 0.92;
      const hideThresh = isMobile ? 0.65 : 0.78;

      if (currentVal >= revealThresh && !isReachedRef.current) {
        isReachedRef.current = true;
        onReachChangeRef.current?.(true);
      } else if (currentVal < hideThresh && isReachedRef.current) {
        isReachedRef.current = false;
        onReachChangeRef.current?.(false);
      }
    };

    checkState();
    const timer = setTimeout(checkState, 60);
    return () => clearTimeout(timer);
  }, [isActive, scrollYProgress, smoothProgress, isMobile]);

  // Transform scroll progress to hardware-accelerated clipPath for drawing the line
  // If not active yet, clipPath hides the line completely without causing layout reflows
  const progress = useTransform(smoothProgress, (val) => (isActive ? val : 0));
  const clipInset = useTransform(progress, (v) => `inset(0 0 ${(1 - Math.max(0, Math.min(1, v))) * 100}% 0)`);

  const svgHeightRem = isMobile ? '2.375rem' : '8.125rem';

  return (
    <div ref={ref} className="w-full relative" style={{ height: svgHeightRem }}>
      {/* Dashed line entirely revealed on scroll via GPU composited clipPath — zero layout reflow */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: clipInset }}
      >
        <svg
          className="w-full pointer-events-none"
          style={{ height: svgHeightRem, minHeight: svgHeightRem }}
          viewBox={`0 0 100 ${svgHeight}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={d}
            className="stroke-zinc-800 dark:stroke-white"
            strokeWidth={isMobile ? "2" : "2.4"}
            strokeDasharray={isMobile ? "5 5" : "7 7"}
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    </div>
  );
});

ConnectorSegment.displayName = 'ConnectorSegment';

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
const HowItWorks = () => {
  const { t, currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const isAr = currentLang === 'ar';
  const [stepsData, setStepsData] = useState<Step[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_workflow');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => stepsData.length === 0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});

  const handleRevealChange = useCallback((idx: number, revealed: boolean) => {
    setRevealedCards((prev) => {
      if (prev[idx] === revealed) return prev;
      // On mobile: once a card is revealed, keep it revealed to prevent scroll-triggered re-renders
      if (isMobile && !revealed) return prev;
      const next = { ...prev, [idx]: revealed };
      // On desktop: when a card is hidden (scrolling up), also hide all subsequent cards
      if (!revealed && !isMobile) {
        Object.keys(next).forEach((key) => {
          const numKey = Number(key);
          if (numKey > idx) {
            next[numKey] = false;
          }
        });
      }
      return next;
    });
  }, [isMobile]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fetchWorkflowAndSettings = () => {
      Promise.allSettled([
        api.get('/workflow'),
        api.get('/settings')
      ]).then(([wfRes, settRes]) => {
        if (settRes.status === 'fulfilled' && settRes.value.data?.data) {
          setSettings(settRes.value.data.data);
        }
        if (wfRes.status === 'fulfilled') {
          const data = wfRes.value.data?.data;
          if (Array.isArray(data) && data.length > 0) {
            const enabledSteps = data.filter((s: WorkflowStepApiData) => s.isEnabled !== false);
            if (enabledSteps.length > 0) {
              const mapped: Step[] = enabledSteps.map((s: WorkflowStepApiData, idx: number) => {
                const fallbackSide: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
                return {
                  num: s.num || String(idx + 1).padStart(2, '0'),
                  title: s.title,
                  titleAr: s.titleAr ?? undefined,
                  description: s.description,
                  descriptionAr: s.descriptionAr ?? undefined,
                  pinColor: s.pinColor || (idx % 2 === 0 ? '#E8732A' : '#3B7DD8'),
                  tilt: typeof s.tilt === 'number' ? s.tilt : (idx % 2 === 0 ? -2.5 : 2.5),
                  side: (s.side === 'left' || s.side === 'right') ? s.side : fallbackSide,
                  paperBg: s.paperBg || '#FFF8DC',
                  paperEdge: s.paperEdge || '#F5E6B8',
                };
              });
              setStepsData(mapped);
              try {
                localStorage.setItem('portfolio_workflow', JSON.stringify(mapped));
              } catch { }
            }
          }
        }
      }).finally(() => setIsLoading(false));
    };

    fetchWorkflowAndSettings();

    const handleUpdate = () => fetchWorkflowAndSettings();
    window.addEventListener('portfolio_settings_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_settings_updated', handleUpdate);
  }, []);

  const resolveField = (key: string, arVal?: string, enVal?: string, fallback?: string) => {
    if (isAr) {
      return t(key, arVal || fallback);
    }
    return t(key, enVal || fallback);
  };


  const displayTitle = resolveField('workflow.title', settings?.workflowTitleAr, settings?.workflowTitle, 'How I Engineer Digital Products');
  const displaySubtitle = resolveField('workflow.subtitle', settings?.workflowSubtitleAr, settings?.workflowSubtitle, 'A structured, end-to-end development process ensuring total reliability and business alignment.');

  const displaySteps = stepsData.map((step) => {
    if (isAr) {
      return {
        ...step,
        title: step.titleAr || step.title,
        description: step.descriptionAr || step.description,
      };
    }
    return step;
  });

  if (displaySteps.length === 0) {
    return (
      <section
        id="workflow"
        className="relative scroll-mt-24 py-10 sm:py-14 md:py-18 px-4 sm:px-6 lg:px-8 bg-transparent"
        aria-label="Engineering process and workflow"
      >
        {isLoading && (
          <div className="max-w-5xl mx-auto space-y-6 animate-pulse" aria-busy="true">
            <div className="h-10 w-64 mx-auto rounded-lg bg-muted/50 dark:bg-white/[0.05]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="h-44 rounded-xl bg-card/40 dark:bg-white/[0.03] border border-border/50" />
              <div className="h-44 rounded-xl bg-card/40 dark:bg-white/[0.03] border border-border/50" />
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      id="workflow"
      className="relative isolate scroll-mt-24 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-x-clip overflow-y-visible"
      style={{ contain: 'layout style' }}
      aria-label="Engineering process and workflow"
    >
      {/* ── Seamless Dot Grid Background System (Crisp & Visible on All Displays) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Pure, plain Dot Grid Pattern Layer */}
        <div
          className="absolute inset-0 [background-size:1.5rem_1.5rem] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.22)_1.25px,transparent_1.25px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1.25px,transparent_1.25px)]"
        />
        {/* Universal smooth top & bottom blend into page background */}
        <div className="absolute top-0 inset-x-0 h-20 sm:h-28 md:h-36 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        {isMobile ? (
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-3 sm:mb-4">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <div className="max-w-2xl mx-auto">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {displaySubtitle}
                </p>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-8 sm:mb-10 md:mb-12 px-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-3 sm:mb-4">
              <SplitText
                text={displayTitle}
                delay={30}
                duration={0.5}
              />
            </h2>
            <div className="max-w-2xl mx-auto">
              <BlurText
                text={displaySubtitle}
                delay={20}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              />
            </div>
          </motion.div>
        )}

        {/* Cards + connectors interleaved (clean centered column on mobile, unified zig-zag on desktop) */}
        <div className="relative">
          {displaySteps.map((step, i) => (
            <div key={step.num + i} className="mb-5 sm:mb-6 md:mb-0 last:mb-0">
              {/* Card row: centered column on mobile with clean simple gap, alternating zig-zag on desktop */}
              <div className={`flex justify-center ${step.side === 'right' ? 'md:justify-end' : 'md:justify-start'}`}>
                <div className="w-[82%] max-w-[17.8125rem] sm:max-w-[20rem] md:w-full md:max-w-[24.375rem] lg:max-w-[26.25rem]">
                  <StickyNoteCard
                    step={step}
                    isMobile={isMobile}
                    isRtl={isRtl}
                    isFirst={i === 0}
                    isRevealed={isMobile ? true : Boolean(revealedCards[i])}
                    onRevealChange={(revealed) => handleRevealChange(i, revealed)}
                  />
                </div>
              </div>

              {/* Connector between this card and the next (DESKTOP ONLY — hidden & unmounted on mobile) */}
              {i < displaySteps.length - 1 && !isMobile && (
                <div className="hidden md:block">
                  <ConnectorSegment
                    fromSide={step.side}
                    toSide={displaySteps[i + 1].side}
                    fromColor={step.pinColor}
                    toColor={displaySteps[i + 1].pinColor}
                    index={i}
                    isMobile={false}
                    isRtl={isRtl}
                    isActive={Boolean(revealedCards[i])}
                    onReachChange={(reached) => handleRevealChange(i + 1, reached)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

