import { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  Search, 
  Calendar, 
  BarChart3, 
  Rocket, 
  Code, 
  Award, 
  Building2, 
  Laptop,
  Cloud,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SpotlightCard } from './react-bits';

export interface ExperienceItem {
  id: string;
  position: string;
  positionAr?: string | null;
  company: string;
  companyAr?: string | null;
  startDate: string;
  startDateAr?: string | null;
  endDate?: string | null;
  endDateAr?: string | null;
  location?: string | null;
  locationAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  responsibilities?: string | null;
  responsibilitiesAr?: string | null;
  type?: string; // 'education' | 'work' | 'milestone'
  icon?: string | null;
  color?: string | null;
  order?: number;
  technologies?: { name: string }[];
}

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
}

// Icon dictionary
export const getTimelineIcon = (iconName?: string | null, type?: string, size = 20) => {
  const icon = (iconName || '').toLowerCase();
  
  if (icon.includes('grad') || icon.includes('univ') || icon.includes('school') || icon.includes('جامعة') || icon.includes('تعليم') || icon.includes('دراسة') || icon.includes('أكاديمي') || type === 'education') {
    return <GraduationCap size={size} />;
  }
  if (icon.includes('search') || icon.includes('investigat') || icon.includes('بحث') || icon.includes('استكشاف')) {
    return <Search size={size} />;
  }
  if (icon.includes('cal') || icon.includes('date') || icon.includes('تقويم') || icon.includes('تاريخ')) {
    return <Calendar size={size} />;
  }
  if (icon.includes('chart') || icon.includes('grow') || icon.includes('analyt') || icon.includes('نمو') || icon.includes('تحليل') || icon.includes('إحصاء')) {
    return <BarChart3 size={size} />;
  }
  if (icon.includes('rocket') || icon.includes('launch') || icon.includes('صاروخ') || icon.includes('انطلاق')) {
    return <Rocket size={size} />;
  }
  if (icon.includes('code') || icon.includes('dev') || icon.includes('برمجة') || icon.includes('تطوير') || icon.includes('كود')) {
    return <Code size={size} />;
  }
  if (icon.includes('award') || icon.includes('trophy') || icon.includes('جائزة') || icon.includes('شهادة')) {
    return <Award size={size} />;
  }
  if (icon.includes('build') || icon.includes('office') || icon.includes('شركة') || icon.includes('مكتب') || icon.includes('مؤسسة')) {
    return <Building2 size={size} />;
  }
  if (icon.includes('lap') || icon.includes('computer') || icon.includes('حاسوب') || icon.includes('كمبيوتر')) {
    return <Laptop size={size} />;
  }
  if (icon.includes('cloud') || icon.includes('سحاب')) {
    return <Cloud size={size} />;
  }
  return <Briefcase size={size} />;
};

// Color theme mapper (harmonious palette fitting the site's dark/light identity)
export const getThemeColors = (colorName?: string | null, index = 0) => {
  const defaultColors = ['amber', 'coral', 'teal', 'blue', 'purple'];
  const key = (colorName || defaultColors[index % defaultColors.length]).toLowerCase();

  switch (key) {
    case 'amber':
    case 'orange':
    case 'yellow':
      return {
        key: 'amber',
        accent: '#F59E0B',
        accentRgb: '245, 158, 11',
        badgeBg: 'bg-amber-500/[0.06] dark:bg-amber-500/[0.06]',
        badgeBorder: 'border-amber-500/25 dark:border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-amber-500/20 dark:group-hover/item:border-amber-500/15',
        tagBg: 'bg-amber-500/[0.06] text-amber-700 dark:text-amber-300 border-amber-500/15',
        lineColor: '#F59E0B',
      };
    case 'coral':
    case 'rose':
    case 'red':
      return {
        key: 'coral',
        accent: '#F43F5E',
        accentRgb: '244, 63, 94',
        badgeBg: 'bg-rose-500/[0.06] dark:bg-rose-500/[0.06]',
        badgeBorder: 'border-rose-500/25 dark:border-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-rose-500/20 dark:group-hover/item:border-rose-500/15',
        tagBg: 'bg-rose-500/[0.06] text-rose-700 dark:text-rose-300 border-rose-500/15',
        lineColor: '#F43F5E',
      };
    case 'teal':
    case 'cyan':
      return {
        key: 'teal',
        accent: '#14B8A6',
        accentRgb: '20, 184, 166',
        badgeBg: 'bg-teal-500/[0.06] dark:bg-teal-500/[0.06]',
        badgeBorder: 'border-teal-500/25 dark:border-teal-500/20',
        text: 'text-teal-600 dark:text-teal-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-teal-500/20 dark:group-hover/item:border-teal-500/15',
        tagBg: 'bg-teal-500/[0.06] text-teal-700 dark:text-teal-300 border-teal-500/15',
        lineColor: '#14B8A6',
      };
    case 'blue':
    case 'sky':
    case 'indigo':
      return {
        key: 'blue',
        accent: '#3B82F6',
        accentRgb: '59, 130, 246',
        badgeBg: 'bg-blue-500/[0.06] dark:bg-blue-500/[0.06]',
        badgeBorder: 'border-blue-500/25 dark:border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-blue-500/20 dark:group-hover/item:border-blue-500/15',
        tagBg: 'bg-blue-500/[0.06] text-blue-700 dark:text-blue-300 border-blue-500/15',
        lineColor: '#3B82F6',
      };
    case 'purple':
    case 'violet':
      return {
        key: 'purple',
        accent: '#8B5CF6',
        accentRgb: '139, 92, 246',
        badgeBg: 'bg-purple-500/[0.06] dark:bg-purple-500/[0.06]',
        badgeBorder: 'border-purple-500/25 dark:border-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-purple-500/20 dark:group-hover/item:border-purple-500/15',
        tagBg: 'bg-purple-500/[0.06] text-purple-700 dark:text-purple-300 border-purple-500/15',
        lineColor: '#8B5CF6',
      };
    case 'emerald':
    case 'green':
    default:
      return {
        key: 'emerald',
        accent: '#10B981',
        accentRgb: '16, 185, 129',
        badgeBg: 'bg-emerald-500/[0.06] dark:bg-emerald-500/[0.06]',
        badgeBorder: 'border-emerald-500/25 dark:border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        glow: 'shadow-sm',
        cardBorder: 'group-hover/item:border-emerald-500/20 dark:group-hover/item:border-white/[0.06]',
        tagBg: 'bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300 border-emerald-500/15',
        lineColor: '#10B981',
      };
  }
};

export const ExperienceTimeline = ({ experiences }: ExperienceTimelineProps) => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  if (!experiences || experiences.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-border rounded-xl">
        <p className="text-muted-foreground text-sm font-medium">
          {isAr ? 'لم تتم إضافة خبرات حتى الآن.' : 'No experience items added yet.'}
        </p>
      </div>
    );
  }

  return <ExperienceTimelineInner key={experiences.map(e => e.id).join('-')} experiences={experiences} />;
};

interface TimelineNodeCardProps {
  item: ExperienceItem;
  theme: ReturnType<typeof getThemeColors>;
  isRtl: boolean;
  alignToSpineEnd: boolean;
  isReached: boolean;
}

const TimelineNodeCard = memo(({ item, theme, isRtl, alignToSpineEnd, isReached }: TimelineNodeCardProps) => {
  const positionTitle = isRtl ? (item.positionAr || item.position) : item.position;
  const companyName = isRtl ? (item.companyAr || item.company) : item.company;
  const locationName = isRtl ? (item.locationAr || item.location) : item.location;
  const descriptionText = isRtl ? (item.descriptionAr || item.description) : item.description;

  const displayEnd = isRtl
    ? (item.endDateAr || (item.endDate?.trim().toLowerCase() === 'present' ? 'حتى الآن' : item.endDate))
    : item.endDate;
  const displayStart = isRtl ? (item.startDateAr || item.startDate) : item.startDate;

  const badgeElement = (
    <div
      className={`relative z-30 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${theme.badgeBorder} bg-white dark:bg-zinc-950 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-105 shadow-sm overflow-hidden transform-gpu`}
    >
      {/* Theme tinted translucent fill over solid base */}
      <div className={`absolute inset-0 ${theme.badgeBg}`} />

      <div
        className="absolute inset-1 rounded-full border border-dashed opacity-30 group-hover/item:opacity-45 group-hover/item:rotate-45 transition-all duration-700 ease-out"
        style={{ borderColor: theme.accent }}
      />
      <span className={`relative z-10 ${theme.text} transition-transform duration-300 group-hover/item:scale-105`}>
        {getTimelineIcon(item.icon, item.type, 20)}
      </span>
    </div>
  );

  const yearElement = (
    <div className={`flex flex-col ${alignToSpineEnd ? 'items-end' : 'items-start'}`}>
      <div
        className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-mono leading-none flex items-center gap-1.5"
        style={{ color: theme.accent }}
      >
        <span dir="ltr">{displayStart}</span>
        {displayEnd && displayEnd !== displayStart ? (
          <>
            <span className="text-muted-foreground/60 text-sm font-normal">—</span>
            <span className="text-muted-foreground/80 text-sm font-medium font-sans">
              {displayEnd}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className={`w-full text-start flex flex-col ${alignToSpineEnd ? 'items-end' : 'items-start'}`}>
      {/* Top Row: Circular Icon Badge & Year (Animated on checkpoint reached) */}
      <motion.div
        initial={false}
        animate={{
          opacity: isReached ? 1 : 0,
          y: isReached ? 0 : 8,
          scale: isReached ? 1 : 0.94,
        }}
        transition={{
          duration: 0.42,
          delay: 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`flex items-center gap-3.5 mb-3 transform-gpu ${
          alignToSpineEnd ? 'justify-end' : 'justify-start'
        }`}
      >
        {alignToSpineEnd ? (
          <>
            {yearElement}
            {badgeElement}
          </>
        ) : (
          <>
            {badgeElement}
            {yearElement}
          </>
        )}
      </motion.div>

      {/* Experience Content Card (Silky glide entrance) */}
      <motion.div
        initial={false}
        animate={{
          opacity: isReached ? 1 : 0,
          y: isReached ? 0 : 18,
          x: isReached ? 0 : (alignToSpineEnd ? -14 : 14),
        }}
        transition={{
          duration: 0.52,
          delay: 0.14,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full transform-gpu"
      >
        <SpotlightCard
          spotlightColor={`rgba(${theme.accentRgb}, 0.08)`}
          darkSpotlightColor={`rgba(${theme.accentRgb}, 0.12)`}
          size={340}
          darkSize={450}
          className={`relative w-full p-5 sm:p-6 rounded-xl bg-white/95 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/90 dark:border-white/[0.08] ${theme.cardBorder} hover:border-zinc-300 dark:hover:border-white/[0.22] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_20px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out group-hover/item:-translate-y-1 text-start transform-gpu cursor-pointer`}
        >
          {/* Role / Position Title */}
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground relative z-10">
            {positionTitle}
          </h3>

          {/* Company & Location Metadata Row */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-muted-foreground mt-1 relative z-10">
            <span className="font-semibold text-foreground/90">
              {companyName}
            </span>

            {locationName && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} /> {locationName}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {descriptionText && (
            <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed pt-2.5 whitespace-pre-line relative z-10">
              {descriptionText}
            </p>
          )}

          {/* Technologies Tags */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3.5 relative z-10">
              {item.technologies.map(tech => (
                <span
                  key={tech.name}
                  className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded border transition-colors duration-200 ${theme.tagBg}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}
        </SpotlightCard>
      </motion.div>
    </div>
  );
});

TimelineNodeCard.displayName = 'TimelineNodeCard';

interface MobileTimelineCardProps {
  item: ExperienceItem;
  theme: ReturnType<typeof getThemeColors>;
  isRtl: boolean;
  isReached: boolean;
}

const MobileTimelineCard = memo(({ item, theme, isRtl, isReached }: MobileTimelineCardProps) => {
  const positionTitle = isRtl ? (item.positionAr || item.position) : item.position;
  const companyName = isRtl ? (item.companyAr || item.company) : item.company;
  const locationName = isRtl ? (item.locationAr || item.location) : item.location;
  const descriptionText = isRtl ? (item.descriptionAr || item.description) : item.description;

  const displayEnd = isRtl
    ? (item.endDateAr || (item.endDate?.trim().toLowerCase() === 'present' ? 'حتى الآن' : item.endDate))
    : item.endDate;
  const displayStart = isRtl ? (item.startDateAr || item.startDate) : item.startDate;

  return (
    <div className="w-full text-start">
      {/* ─── Top Branch Header: Circular Badge (outside card) + Year ─── */}
      <div className="flex items-center gap-3.5 mb-3 justify-start">
        {/* Outer Circular Icon Badge */}
        <motion.div
          initial={false}
          animate={{
            opacity: isReached ? 1 : 0,
            scale: isReached ? 1 : 0.8,
          }}
          transition={{
            duration: 0.38,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`relative z-30 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 ${theme.badgeBorder} bg-white dark:bg-zinc-950 flex items-center justify-center transition-transform duration-300 group-hover/item:scale-105 shadow-sm overflow-hidden transform-gpu`}
        >
          {/* Theme tinted translucent fill over solid base */}
          <div className={`absolute inset-0 ${theme.badgeBg}`} />

          <div
            className="absolute inset-1 rounded-full border border-dashed opacity-35 group-hover/item:opacity-55 transition-all duration-700 ease-out"
            style={{ borderColor: theme.accent }}
          />
          <span className={`relative z-10 ${theme.text} transition-transform duration-300 group-hover/item:scale-105`}>
            {getTimelineIcon(item.icon, item.type, 19)}
          </span>
        </motion.div>

        {/* Year / Period */}
        <motion.div
          initial={false}
          animate={{
            opacity: isReached ? 1 : 0,
            x: isReached ? 0 : (isRtl ? -10 : 10),
          }}
          transition={{
            duration: 0.42,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-lg sm:text-xl font-extrabold tracking-tight font-mono leading-none flex items-center gap-1.5 transform-gpu"
          style={{ color: theme.accent }}
        >
          <span dir="ltr">{displayStart}</span>
          {displayEnd && displayEnd !== displayStart ? (
            <>
              <span className="text-muted-foreground/50 text-xs font-normal">—</span>
              <span className="text-muted-foreground/80 text-xs sm:text-sm font-medium font-sans">
                {displayEnd}
              </span>
            </>
          ) : null}
        </motion.div>
      </div>

      {/* ─── Content Card (GPU-optimized crisp surface for mobile) ─── */}
      <motion.div
        initial={false}
        animate={{
          opacity: isReached ? 1 : 0,
          y: isReached ? 0 : 16,
        }}
        transition={{
          duration: 0.48,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full transform-gpu"
      >
        <SpotlightCard
          spotlightColor="rgba(0, 0, 0, 0.02)"
          darkSpotlightColor="rgba(255, 255, 255, 0.007)"
          size={300}
          darkSize={450}
          className="relative w-full p-5 sm:p-6 rounded-xl bg-white/98 dark:bg-zinc-900/95 sm:backdrop-blur-xl border border-zinc-200/90 dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_16px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_12px_24px_-8px_rgba(0,0,0,0.35)] text-start hover:border-zinc-300 dark:hover:border-white/[0.18] transition-colors duration-200 transform-gpu"
        >
          {/* Role / Position Title */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug relative z-10">
            {positionTitle}
          </h3>

          {/* Company & Location Metadata Row */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-muted-foreground mt-1 relative z-10">
            <span className="font-semibold text-foreground/90">
              {companyName}
            </span>
            {locationName && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} className="text-muted-foreground/70" /> {locationName}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {descriptionText && (
            <p className="text-xs sm:text-[13.5px] text-muted-foreground/90 leading-relaxed pt-2.5 whitespace-pre-line relative z-10">
              {descriptionText}
            </p>
          )}

          {/* Technologies Tags */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3.5 relative z-10">
              {item.technologies.map(tech => (
                <span
                  key={tech.name}
                  className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded border transition-colors duration-200 ${theme.tagBg}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}
        </SpotlightCard>
      </motion.div>
    </div>
  );
});

MobileTimelineCard.displayName = 'MobileTimelineCard';

const ExperienceTimelineInner = ({ experiences }: ExperienceTimelineProps) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const mobileNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopNodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const defaultThresholds = useMemo(() => {
    const count = experiences.length;
    if (count <= 1) return [0.08];
    return experiences.map((_, i) => 0.06 + (i / (count - 1)) * 0.84);
  }, [experiences.length]);

  const [mobileThresholds, setMobileThresholds] = useState<number[]>(defaultThresholds);
  const [desktopThresholds, setDesktopThresholds] = useState<number[]>(defaultThresholds);

  // High performance Set tracking for 0-re-render scroll checks
  const reachedMobileSet = useRef<Set<number>>(
    new Set(
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? experiences.map((_, i) => i)
        : []
    )
  );
  const reachedDesktopSet = useRef<Set<number>>(
    new Set(
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? experiences.map((_, i) => i)
        : []
    )
  );

  const [reachedMobile, setReachedMobile] = useState<number[]>(() =>
    Array.from(reachedMobileSet.current)
  );
  const [reachedDesktop, setReachedDesktop] = useState<number[]>(() =>
    Array.from(reachedDesktopSet.current)
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 75%'],
  });

  // Snappy, lightweight mobile spring (sleeps fast, zero jitter)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.8,
    restDelta: 0.002,
  });

  // Monotonic progress that runs only once on the first scroll playthrough, then permanently locks
  const monotonicProgress = useMotionValue(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  );
  const [isTimelineLocked, setIsTimelineLocked] = useState(() => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // 100% GPU-composited scaleY transform (ZERO repaints or layout reflows on mobile)
  const beamScaleY = useTransform(monotonicProgress, (val) => Math.max(0, Math.min(1, val)));
  const particleTop = useTransform(monotonicProgress, (val) => `${Math.max(0, Math.min(1, val)) * 100}%`);

  const rafUpdateRef = useRef<number | null>(null);

  const updateThresholds = useCallback(() => {
    if (rafUpdateRef.current) return;
    rafUpdateRef.current = requestAnimationFrame(() => {
      rafUpdateRef.current = null;
      // Mobile track & nodes
      if (mobileTrackRef.current) {
        const trackRect = mobileTrackRef.current.getBoundingClientRect();
        const trackTop = trackRect.top;
        const trackHeight = trackRect.height;
        if (trackHeight > 0) {
          const thresholds = experiences.map((_, i) => {
            const nodeEl = mobileNodeRefs.current[i];
            if (!nodeEl) return 0.06 + (i / Math.max(1, experiences.length - 1)) * 0.84;
            const nodeRect = nodeEl.getBoundingClientRect();
            const nodeCenter = nodeRect.top + nodeRect.height / 2;
            const ratio = (nodeCenter - trackTop) / trackHeight;
            return Math.max(0.02, Math.min(0.98, ratio));
          });
          setMobileThresholds(thresholds);
        }
      }

      // Desktop track & nodes
      if (desktopTrackRef.current) {
        const trackRect = desktopTrackRef.current.getBoundingClientRect();
        const trackTop = trackRect.top;
        const trackHeight = trackRect.height;
        if (trackHeight > 0) {
          const thresholds = experiences.map((_, i) => {
            const nodeEl = desktopNodeRefs.current[i];
            if (!nodeEl) return 0.06 + (i / Math.max(1, experiences.length - 1)) * 0.84;
            const nodeRect = nodeEl.getBoundingClientRect();
            const nodeCenter = nodeRect.top + nodeRect.height / 2;
            const ratio = (nodeCenter - trackTop) / trackHeight;
            return Math.max(0.02, Math.min(0.98, ratio));
          });
          setDesktopThresholds(thresholds);
        }
      }
    });
  }, [experiences]);

  useEffect(() => {
    updateThresholds();

    window.addEventListener('resize', updateThresholds);

    let ro: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateThresholds();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      if (rafUpdateRef.current) {
        cancelAnimationFrame(rafUpdateRef.current);
      }
      window.removeEventListener('resize', updateThresholds);
      ro?.disconnect();
    };
  }, [updateThresholds]);

  const checkProgress = useCallback(
    (val: number) => {
      const allMobileDone = reachedMobileSet.current.size >= mobileThresholds.length;
      const allDesktopDone = reachedDesktopSet.current.size >= desktopThresholds.length;

      if (allMobileDone && allDesktopDone) return;

      if (val >= 0.985) {
        for (let i = 0; i < mobileThresholds.length; i++) reachedMobileSet.current.add(i);
        for (let i = 0; i < desktopThresholds.length; i++) reachedDesktopSet.current.add(i);
        setReachedMobile(Array.from(reachedMobileSet.current));
        setReachedDesktop(Array.from(reachedDesktopSet.current));
        return;
      }

      let mobChanged = false;
      if (!allMobileDone) {
        for (let i = 0; i < mobileThresholds.length; i++) {
          if (val >= mobileThresholds[i] - 0.015 && !reachedMobileSet.current.has(i)) {
            reachedMobileSet.current.add(i);
            mobChanged = true;
          }
        }
      }

      let deskChanged = false;
      if (!allDesktopDone) {
        for (let i = 0; i < desktopThresholds.length; i++) {
          if (val >= desktopThresholds[i] - 0.015 && !reachedDesktopSet.current.has(i)) {
            reachedDesktopSet.current.add(i);
            deskChanged = true;
          }
        }
      }

      if (mobChanged) {
        setReachedMobile(Array.from(reachedMobileSet.current));
      }
      if (deskChanged) {
        setReachedDesktop(Array.from(reachedDesktopSet.current));
      }
    },
    [mobileThresholds, desktopThresholds]
  );

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (isTimelineLocked) return;
    const current = monotonicProgress.get();
    const clamped = Math.max(0, Math.min(1, latest));

    // Monotonic: only moves forward on the first scroll playthrough, never retreats
    if (clamped > current) {
      if (clamped >= 0.985) {
        monotonicProgress.set(1);
        setIsTimelineLocked(true);
      } else {
        monotonicProgress.set(clamped);
      }
    }
    checkProgress(monotonicProgress.get());
  });

  useEffect(() => {
    const initial = smoothProgress.get();
    if (initial >= 0.985) {
      monotonicProgress.set(1);
      setIsTimelineLocked(true);
      checkProgress(1);
    } else if (initial > monotonicProgress.get()) {
      monotonicProgress.set(initial);
      checkProgress(initial);
    }
  }, [checkProgress, smoothProgress, monotonicProgress]);

  const desktopSpineClass = 'left-1/2 -translate-x-1/2';

  return (
    <div ref={containerRef} className="relative w-full py-4 max-w-5xl mx-auto">
      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE VIEW (< md): Clean, Linear, High-Density Timeline with Branches & Circles
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden relative pt-3 pb-6">
        {/* Top Origin Green Chevron Indicator */}
        <div
          className={`absolute top-0 z-30 flex items-center justify-center ${
            isRtl ? 'right-3.5 sm:right-5 translate-x-1/2' : 'left-3.5 sm:left-5 -translate-x-1/2'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm ring-4 ring-emerald-500/15 pointer-events-none">
            <ChevronDown size={14} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Base Inactive Vertical Spine Track */}
        <div
          className={`absolute top-4 bottom-6 w-[2px] bg-border/60 dark:bg-white/10 rounded-full ${
            isRtl ? 'right-3.5 sm:right-5 translate-x-1/2' : 'left-3.5 sm:left-5 -translate-x-1/2'
          }`}
        />

        {/* Active Scroll Beam with Traveling Particle (GPU scaleY - zero repaints) */}
        <div
          ref={mobileTrackRef}
          className={`absolute top-4 bottom-6 w-[2px] rounded-full ${
            isRtl ? 'right-3.5 sm:right-5 translate-x-1/2' : 'left-3.5 sm:left-5 -translate-x-1/2'
          } pointer-events-none z-10 overflow-visible`}
        >
          <motion.div
            style={{ scaleY: beamScaleY }}
            className="w-full h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 rounded-full origin-top will-change-transform transform-gpu"
          />
          <motion.div
            style={{ top: particleTop }}
            className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-20 will-change-[top] transform-gpu transition-opacity duration-500 ${
              isTimelineLocked ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm" />
          </motion.div>
        </div>

        {/* Mobile Items Stack */}
        <div className="space-y-8 sm:space-y-10 relative z-10 pt-7 pb-4">
          {experiences.map((item, index) => {
            const theme = getThemeColors(item.color, index);
            const isReached = reachedMobile.includes(index);

            return (
              <div
                key={`mob-${item.id}`}
                className="group/item relative flex flex-col items-start w-full"
              >
                {/* ─── Node on Vertical Spine ─── */}
                <div
                  ref={(el) => { mobileNodeRefs.current[index] = el; }}
                  className={`absolute top-5 z-20 flex items-center justify-center -translate-y-1/2 pointer-events-none ${
                    isRtl ? 'right-3.5 sm:right-5 translate-x-1/2' : 'left-3.5 sm:left-5 -translate-x-1/2'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-background border-[2.5px] flex items-center justify-center shadow-xs transition-all duration-300 ${
                      isReached ? 'scale-100' : 'scale-75 border-zinc-400/40 dark:border-white/20'
                    }`}
                    style={{ borderColor: isReached ? theme.accent : undefined }}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isReached ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                </div>

                {/* ─── Refined Horizontal Branch Line (Connecting spine node to circle badge) ─── */}
                <motion.div
                  initial={false}
                  animate={{ scaleX: isReached ? 1 : 0 }}
                  transition={{
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    transformOrigin: isRtl ? 'right center' : 'left center',
                  }}
                  className={`absolute top-5 -translate-y-1/2 h-[2px] pointer-events-none z-10 ${
                    isRtl
                      ? 'right-3.5 sm:right-5 w-[24px] sm:w-[28px]'
                      : 'left-3.5 sm:left-5 w-[24px] sm:w-[28px]'
                  }`}
                >
                  {/* Subtle track line */}
                  <div className="absolute inset-x-0 h-full bg-border/60 dark:bg-white/10" />

                  {/* Colored smooth drawn branch line */}
                  <div
                    style={{ backgroundColor: theme.accent }}
                    className="relative w-full h-full opacity-85 group-hover/item:opacity-100 transition-opacity"
                  />
                </motion.div>

                {/* ─── Card Column (Spanning from the circle badge onward) ─── */}
                <div className={`w-full relative z-20 ${isRtl ? 'pr-[38px] sm:pr-[46px]' : 'pl-[38px] sm:pl-[46px]'}`}>
                  <MobileTimelineCard
                    item={item}
                    theme={theme}
                    isRtl={isRtl}
                    isReached={isReached}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Terminal Anchor on Mobile */}
        <div className="relative pt-2">
          <div
            className={`absolute top-0 z-20 flex items-center justify-center ${
              isRtl ? 'right-3.5 sm:right-5 translate-x-1/2' : 'left-3.5 sm:left-5 -translate-x-1/2'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-md ring-4 ring-emerald-500/15">
              <ChevronDown size={14} className="stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP VIEW (>= md): Full Centered Continuous Spine & Alternating Deck
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative pt-10 md:pt-12">
        {/* Top Origin Green Chevron Indicator */}
        <div className={`absolute top-0 z-30 flex items-center justify-center ${desktopSpineClass}`}>
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm ring-4 ring-emerald-500/15 z-30 pointer-events-none">
            <ChevronDown size={16} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Base Inactive Vertical Spine Track */}
        <div
          className={`absolute top-4 bottom-6 w-[2px] bg-border/60 dark:bg-white/10 rounded-full ${desktopSpineClass}`}
        />

        {/* Active Scroll Beam with Traveling Light Particle (GPU scaleY - zero repaints) */}
        <div
          ref={desktopTrackRef}
          className={`absolute top-4 bottom-6 w-[2px] rounded-full ${desktopSpineClass} pointer-events-none z-10 overflow-visible`}
        >
          <motion.div
            style={{ scaleY: beamScaleY }}
            className="w-full h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 rounded-full origin-top will-change-transform transform-gpu"
          />
          {/* Traveling Light Particle at the beam's front tip */}
          <motion.div
            style={{ top: particleTop }}
            className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-20 will-change-[top] transform-gpu transition-opacity duration-500 ${
              isTimelineLocked ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm" />
          </motion.div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-12 md:space-y-16 relative z-10 pb-12">
          {experiences.map((item, index) => {
            const theme = getThemeColors(item.color, index);
            const isRightSide = index % 2 === 0;
            const stemGoesRight = isRtl ? !isRightSide : isRightSide;
            const isReached = reachedDesktop.includes(index);

            return (
              <div
                key={item.id}
                className="group/item relative flex flex-row items-start w-full"
              >
                {/* ─── Central Spine Node & Clean Horizontal Connector Line ────── */}
                <div
                  ref={(el) => { desktopNodeRefs.current[index] = el; }}
                  className={`absolute top-4 ${desktopSpineClass} z-10 flex items-center justify-center pointer-events-none`}
                >
                  {/* Clean Central Node Circle */}
                  <div
                    className={`relative z-20 w-4 h-4 rounded-full bg-background border-[3px] flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 ${
                      isReached ? 'scale-100' : 'scale-75 border-zinc-400/40 dark:border-white/20'
                    }`}
                    style={{ borderColor: isReached ? theme.accent : undefined }}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isReached ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>

                  {/* ── Horizontal Branching Connector Line (Desktop) ── */}
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isReached ? 1 : 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: stemGoesRight ? 'left center' : 'right center',
                    }}
                    className={`flex items-center absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-0 ${
                      stemGoesRight
                        ? 'left-full w-[40px] lg:w-[48px]'
                        : 'right-full w-[40px] lg:w-[48px]'
                    }`}
                  >
                    {/* Subtle base line */}
                    <div className="absolute inset-x-0 h-[1.5px] bg-border/50 dark:bg-white/10" />

                    {/* Smooth scroll-drawn colored line */}
                    <div
                      style={{ backgroundColor: theme.accent }}
                      className="relative w-full h-[1.5px] opacity-75 group-hover/item:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>
                </div>

                {/* ─── Desktop First Column (Inline-Start of Spine) ── */}
                <div className="flex md:w-1/2 justify-end md:pe-12 lg:pe-14 relative z-20">
                  {!isRightSide ? (
                    <TimelineNodeCard
                      item={item}
                      theme={theme}
                      isRtl={isRtl}
                      alignToSpineEnd={true}
                      isReached={isReached}
                    />
                  ) : null}
                </div>

                {/* ─── Second Column (Inline-End of Spine) ── */}
                <div className="w-full md:w-1/2 flex justify-start md:ps-12 lg:ps-14 relative z-20">
                  <div className={`w-full ${!isRightSide ? 'hidden md:hidden' : ''}`}>
                    {isRightSide ? (
                      <TimelineNodeCard
                        item={item}
                        theme={theme}
                        isRtl={isRtl}
                        alignToSpineEnd={false}
                        isReached={isReached}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Bottom Continuous Evolution Terminal Anchor ───────────── */}
        <div className="relative pt-2">
          <div className={`absolute top-0 ${desktopSpineClass} z-20 flex items-center justify-center`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-md ring-4 ring-emerald-500/15">
              <ChevronDown size={18} className="stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
