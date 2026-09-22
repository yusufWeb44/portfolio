import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionBadge from './SectionBadge';

/* ═══════════════════════════════════════════════════════════════════
   Pushpin SVG — 3D pinned head with punctured paper effect
   ═══════════════════════════════════════════════════════════════════ */
const Pushpin = ({ color }: { color: string }) => {
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      width="38"
      height="34"
      viewBox="0 0 38 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* Soft shadow filter for realistic depth */}
        <filter id={`shadow_${safeId}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>

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
        rx="9.5"
        ry="4"
        fill="rgba(0,0,0,0.35)"
        filter={`url(#shadow_${safeId})`}
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
const StickyNoteCard = ({
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
  const tilt = isMobile ? baseTilt * 0.55 : baseTilt;
  const isVisualLeft = isRtl ? (step.side === 'right') : (step.side === 'left');

  const onRevealChangeRef = useRef(onRevealChange);
  useEffect(() => {
    onRevealChangeRef.current = onRevealChange;
  });

  // First card: driven by IntersectionObserver with expansive top margin so it never hides while reading subsequent cards
  useEffect(() => {
    if (!isFirst || !ref.current) return;

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
  }, [isFirst]);

  // Relaxed entry kinematics for ultra-smooth, comfortable appearance
  const entryRotate = tilt * 0.75;
  const entryY = 16;
  const entryScale = 0.96;

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: entryY, scale: entryScale, rotate: entryRotate }}
      animate={
        isRevealed
          ? { opacity: 1, y: 0, scale: 1, rotate: tilt }
          : { opacity: 0, y: entryY, scale: entryScale, rotate: entryRotate }
      }
      transition={
        isRevealed
          ? {
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.55, ease: 'easeOut' },
            }
          : {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.32, ease: 'easeIn' },
            }
      }
      style={{ transformOrigin: isVisualLeft ? '60% 16%' : '40% 16%' }}
    >
      {/* Paper stack behind */}
      <div className="absolute -inset-0.5 rounded-[1px]"
        style={{
          background: step.paperEdge,
          transform: `rotate(${tilt + (isRtl ? -1.2 : 1.2)}deg) translate(${isRtl ? -2 : 2}px, 3px)`,
          opacity: 0.35,
          boxShadow: '1px 2px 4px rgba(0,0,0,0.06)',
        }}
      />
      <div className="absolute inset-0 rounded-[1px]"
        style={{
          background: step.paperEdge,
          transform: `rotate(${tilt - (isRtl ? -0.5 : 0.5)}deg) translate(${isRtl ? -1 : 1}px, 1px)`,
          opacity: 0.45,
          boxShadow: '1px 1px 3px rgba(0,0,0,0.04)',
        }}
      />

      {/* Main paper */}
      <div
        className="relative rounded-[1px] overflow-hidden"
        style={{
          background: step.paperBg,
          boxShadow: `
            0 1px 2px rgba(0,0,0,0.04),
            0 2px 4px rgba(0,0,0,0.04),
            0 4px 8px rgba(0,0,0,0.06),
            0 8px 16px rgba(0,0,0,0.06),
            0 16px 32px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.8),
            inset 0 -1px 0 rgba(0,0,0,0.03),
            inset 1px 0 0 rgba(255,255,255,0.3),
            inset -1px 0 0 rgba(0,0,0,0.02)
          `,
        }}
      >
        {/* Paper texture — lightweight CSS pattern instead of expensive SVG feTurbulence filter */}
        <div className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            opacity: 0.04,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            backgroundSize: '8px 8px',
          }}
        />
        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="absolute w-full"
              style={{ top: `${72 + i * 22}px`, height: '0.8px', background: '#6b7280' }}
            />
          ))}
        </div>
        {/* Red margin (mirrored on right side for RTL Arabic writing) */}
        <div className="absolute top-0 bottom-0 pointer-events-none"
          style={{ [isRtl ? 'right' : 'left']: '36px', width: '1.2px', background: 'rgba(220,50,50,0.08)' }}
        />
        {/* Top adhesive */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '6px', background: `linear-gradient(180deg, ${step.paperEdge}90, transparent)` }}
        />

        {/* Pushpin */}
        <div className="flex justify-center pt-2 relative z-10">
          <Pushpin color={step.pinColor} />
        </div>

        {/* Content */}
        <div className={`px-5 sm:px-7 pb-5 sm:pb-7 pt-1 sm:pt-2 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-mono text-xs sm:text-sm font-black"
              style={{ background: `${step.pinColor}12`, color: step.pinColor, border: `2px solid ${step.pinColor}25` }}
            >
              {step.num}
            </span>
            <div className="h-px flex-1" style={{ background: `${step.pinColor}15` }} />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug mb-2 sm:mb-3" style={{ color: '#1a1a2e' }}>
            {step.title}
          </h3>
          <div className="flex items-center gap-1 mb-3 sm:mb-4">
            <div className="w-8 h-[3px] rounded-full" style={{ background: step.pinColor }} />
            <div className="w-3 h-[3px] rounded-full" style={{ background: `${step.pinColor}40` }} />
            <div className="w-1.5 h-[3px] rounded-full" style={{ background: `${step.pinColor}20` }} />
          </div>
          <p className="text-[0.82rem] sm:text-[0.88rem] leading-[1.65]" style={{ color: '#3d3d5c' }}>
            {step.description}
          </p>
        </div>

        {/* Corner fold (mirrored to bottom-left for RTL) */}
        <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} pointer-events-none overflow-hidden`} style={{ width: 24, height: 24 }}>
          <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-[34px] h-[34px]`}
            style={{
              background: isRtl
                ? `linear-gradient(225deg, ${step.paperBg} 48%, ${step.paperEdge} 50%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.02) 100%)`
                : `linear-gradient(135deg, ${step.paperBg} 48%, ${step.paperEdge} 50%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.02) 100%)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Connector Segment — animated SVG between two cards
   ═══════════════════════════════════════════════════════════════════ */
const ConnectorSegment = ({
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
    offset: isMobile ? ['start 84%', 'end 58%'] : ['start 80%', 'end 54%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Calculate actual visual position taking RTL into account
  // In RTL, justify-start ('left') is rendered on the visual RIGHT (72%)
  // and justify-end ('right') is rendered on the visual LEFT (28%)
  const getVisualX = (side: 'left' | 'right') => {
    const isVisualLeft = isRtl ? (side === 'right') : (side === 'left');
    if (isMobile) {
      return isVisualLeft ? 42 : 58;
    }
    return isVisualLeft ? 28 : 72;
  };

  const fromXNum = getVisualX(fromSide);
  const toXNum = getVisualX(toSide);

  const svgHeight = isMobile ? 84 : 130;
  const startY = 0;
  const endY = svgHeight;
  const cp1Y = svgHeight * 0.35;
  const cp2Y = svgHeight * 0.65;

  const d = `M ${fromXNum} ${startY} C ${fromXNum} ${cp1Y}, ${toXNum} ${cp2Y}, ${toXNum} ${endY}`;

  const isReachedRef = useRef(false);
  const onReachChangeRef = useRef(onReachChange);
  useEffect(() => {
    onReachChangeRef.current = onReachChange;
  });

  // Monitor line progress to trigger card reveal when touching (0.92) and hide when retracting (< 0.78)
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (!isActive) {
      if (isReachedRef.current) {
        isReachedRef.current = false;
        onReachChangeRef.current?.(false);
      }
      return;
    }

    if (latest >= 0.92 && !isReachedRef.current) {
      isReachedRef.current = true;
      onReachChangeRef.current?.(true);
    } else if (latest < 0.78 && isReachedRef.current) {
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

      if (currentVal >= 0.92 && !isReachedRef.current) {
        isReachedRef.current = true;
        onReachChangeRef.current?.(true);
      } else if (currentVal < 0.78 && isReachedRef.current) {
        isReachedRef.current = false;
        onReachChangeRef.current?.(false);
      }
    };

    checkState();
    const timer = setTimeout(checkState, 60);
    return () => clearTimeout(timer);
  }, [isActive, scrollYProgress, smoothProgress]);

  // Transform scroll progress to hardware-accelerated clipPath for drawing the line
  // If not active yet, clipPath hides the line completely without causing layout reflows
  const progress = useTransform(smoothProgress, (val) => (isActive ? val : 0));
  const clipInset = useTransform(progress, (v) => `inset(0 0 ${(1 - Math.max(0, Math.min(1, v))) * 100}% 0)`);

  return (
    <div ref={ref} className="w-full relative" style={{ height: svgHeight }}>
      {/* Dashed line entirely revealed on scroll via GPU composited clipPath — zero layout reflow */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: clipInset }}
      >
        <svg
          className="w-full pointer-events-none"
          style={{ height: svgHeight, minHeight: svgHeight }}
          viewBox={`0 0 100 ${svgHeight}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={d}
            className="stroke-zinc-800 dark:stroke-white"
            strokeWidth="2.4"
            strokeDasharray="7 7"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════ */
const HowItWorks = () => {
  const { t, currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const isAr = currentLang === 'ar';
  const [stepsData, setStepsData] = useState<Step[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});

  const handleRevealChange = useCallback((idx: number, revealed: boolean) => {
    setRevealedCards((prev) => {
      if (prev[idx] === revealed) return prev;
      const next = { ...prev, [idx]: revealed };
      // When a card is hidden (scrolling up), also hide all subsequent cards immediately
      if (!revealed) {
        Object.keys(next).forEach((key) => {
          const numKey = Number(key);
          if (numKey > idx) {
            next[numKey] = false;
          }
        });
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
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
            const enabledSteps = data.filter((s: any) => s.isEnabled !== false);
            if (enabledSteps.length > 0) {
              const mapped: Step[] = enabledSteps.map((s: any, idx: number) => {
                const fallbackSide: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
                return {
                  num: s.num || String(idx + 1).padStart(2, '0'),
                  title: s.title,
                  titleAr: s.titleAr,
                  description: s.description,
                  descriptionAr: s.descriptionAr,
                  pinColor: s.pinColor || (idx % 2 === 0 ? '#E8732A' : '#3B7DD8'),
                  tilt: typeof s.tilt === 'number' ? s.tilt : (idx % 2 === 0 ? -2.5 : 2.5),
                  side: (s.side === 'left' || s.side === 'right') ? s.side : fallbackSide,
                  paperBg: s.paperBg || '#FFF8DC',
                  paperEdge: s.paperEdge || '#F5E6B8',
                };
              });
              setStepsData(mapped);
            }
          }
        }
      });
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

  const displayBadge = resolveField('workflow.badge', settings?.workflowBadgeAr, settings?.workflowBadge, 'Workflow & Methodology');
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

  return (
    <section
      id="how-i-work"
      className="scroll-mt-24 py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-x-hidden overflow-y-visible"
      aria-label="Engineering process and workflow"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16 md:mb-20 px-2"
        >
          <div className="flex justify-center">
            <SectionBadge>
              {displayBadge}
            </SectionBadge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-4">
            {displayTitle}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </motion.div>

        {/* Cards + connectors interleaved (unified zig-zag on all screens) */}
        <div className="relative">
          {displaySteps.map((step, i) => (
            <div key={step.num + i}>
              {/* Card row */}
              <div className={`flex ${step.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className="w-[88%] sm:w-[82%] md:w-full md:max-w-[420px]">
                  <StickyNoteCard
                    step={step}
                    isMobile={isMobile}
                    isRtl={isRtl}
                    isFirst={i === 0}
                    isRevealed={Boolean(revealedCards[i])}
                    onRevealChange={(revealed) => handleRevealChange(i, revealed)}
                  />
                </div>
              </div>

              {/* Connector between this card and the next */}
              {i < displaySteps.length - 1 && (
                <ConnectorSegment
                  fromSide={step.side}
                  toSide={displaySteps[i + 1].side}
                  fromColor={step.pinColor}
                  toColor={displaySteps[i + 1].pinColor}
                  index={i}
                  isMobile={isMobile}
                  isRtl={isRtl}
                  isActive={Boolean(revealedCards[i])}
                  onReachChange={(reached) => handleRevealChange(i + 1, reached)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

