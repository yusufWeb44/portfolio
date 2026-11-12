import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  endDate?: string | null;
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
        cardBorder: 'group-hover/item:border-emerald-500/20 dark:group-hover/item:border-emerald-500/15',
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
}

const TimelineNodeCard = ({ item, theme, isRtl, alignToSpineEnd }: TimelineNodeCardProps) => {
  const positionTitle = isRtl ? (item.positionAr || item.position) : item.position;
  const companyName = isRtl ? (item.companyAr || item.company) : item.company;
  const locationName = isRtl ? (item.locationAr || item.location) : item.location;
  const descriptionText = isRtl ? (item.descriptionAr || item.description) : item.description;

  const badgeElement = (
    <div
      className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 ${theme.badgeBorder} ${theme.badgeBg} flex items-center justify-center transition-all duration-300 group-hover/item:scale-105 bg-background backdrop-blur-md shadow-sm`}
    >
      <div
        className="absolute inset-1 rounded-full border border-dashed opacity-30 group-hover/item:opacity-45 group-hover/item:rotate-45 transition-all duration-700 ease-out"
        style={{ borderColor: theme.accent }}
      />
      <span className={`${theme.text} transition-transform duration-300 group-hover/item:scale-105`}>
        {getTimelineIcon(item.icon, item.type, 20)}
      </span>
    </div>
  );

  const yearElement = (
    <div className={`flex flex-col ${alignToSpineEnd ? 'items-end' : 'items-start'}`}>
      <div
        className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono leading-none"
        style={{ color: theme.accent }}
      >
        {item.startDate}
        {item.endDate && item.endDate !== item.startDate ? (
          <span className="text-muted-foreground/60 text-sm font-normal ms-1.5">
            — {item.endDate}
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className={`w-full text-start flex flex-col ${alignToSpineEnd ? 'items-end' : 'items-start'}`}>
      {/* Top Row: Circular Icon Badge (anchored next to the spine) & Year */}
      <div
        className={`flex items-center gap-3.5 mb-3 ${
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
      </div>

      {/* Experience Content Card */}
      <SpotlightCard
        spotlightColor={`rgba(${theme.accentRgb}, 0.03)`}
        darkSpotlightColor={`rgba(${theme.accentRgb}, 0.01)`}
        size={220}
        darkSize={160}
        className={`relative w-full p-5 sm:p-6 rounded-xl bg-card/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/70 ${theme.cardBorder} transition-all duration-300 ease-out shadow-sm group-hover/item:-translate-y-0.5 text-start`}
      >
        {/* Role / Position Title */}
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground relative z-10">
          {positionTitle}
        </h3>

        {/* Company & Location Metadata Row (Natural plain layout) */}
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

        {/* Description (Clean, without side border) */}
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
    </div>
  );
};

const ExperienceTimelineInner = ({ experiences }: ExperienceTimelineProps) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 75%'],
  });

  // Smooth, high-performance scroll progress spring for silky motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    mass: 0.95,
    restDelta: 0.0005,
  });

  const beamClip = useTransform(smoothProgress, (val) => `inset(0 0 ${(1 - Math.max(0, Math.min(1, val))) * 100}% 0)`);
  const particleTop = useTransform(smoothProgress, (val) => `${Math.max(0, Math.min(1, val)) * 100}%`);

  const spinePositionClass = isRtl
    ? 'right-6 sm:right-8 md:right-1/2 translate-x-1/2'
    : 'left-6 sm:left-8 md:left-1/2 -translate-x-1/2';

  return (
    <div ref={containerRef} className="relative w-full py-4 max-w-5xl mx-auto">
      {/* ─── Timeline Container with Centered Continuous Spine ────────── */}
      <div className="relative pt-10 md:pt-12">
        {/* Top Origin Green Chevron Indicator */}
        <div className={`absolute top-0 z-30 flex items-center justify-center ${spinePositionClass}`}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm ring-4 ring-emerald-500/15 z-30 pointer-events-none"
          >
            <ChevronDown size={16} className="stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Base Inactive Vertical Spine Track */}
        <div
          className={`absolute top-4 bottom-6 w-[2px] bg-border/60 dark:bg-white/10 rounded-full ${spinePositionClass}`}
        />

        {/* Active Scroll Beam with Traveling Light Particle */}
        <div
          className={`absolute top-4 bottom-6 w-[2px] rounded-full ${spinePositionClass} pointer-events-none z-10 overflow-visible`}
        >
          <motion.div
            style={{ clipPath: beamClip }}
            className="w-full h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 rounded-full"
          />
          {/* Traveling Light Particle at the beam's front tip */}
          <motion.div
            style={{ top: particleTop }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-20 will-change-[top]"
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

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 24,
                  x: stemGoesRight ? 14 : -14,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.55,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group/item relative flex flex-col md:flex-row items-start w-full"
              >
                {/* ─── Central Spine Node & Clean Horizontal Connector Line ────── */}
                <div
                  className={`absolute top-4 ${spinePositionClass} z-20 flex items-center justify-center pointer-events-none`}
                >
                  {/* Clean Central Node Circle (No glow) */}
                  <div
                    className="relative w-4 h-4 rounded-full bg-background border-[3px] flex items-center justify-center transition-transform duration-300 group-hover/item:scale-110"
                    style={{ borderColor: theme.accent }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>

                  {/* ── Horizontal Branching Connector Line (Desktop) ── */}
                  <div
                    className={`hidden md:flex items-center absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none ${
                      stemGoesRight
                        ? 'left-full w-[42px] lg:w-[50px]'
                        : 'right-full w-[42px] lg:w-[50px]'
                    }`}
                  >
                    {/* Subtle base line */}
                    <div className="absolute inset-x-0 h-[1.5px] bg-border/50 dark:bg-white/10" />

                    {/* Smooth scroll-drawn colored line (clean, no square tip, no harsh glow) */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.55,
                        delay: 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        transformOrigin: stemGoesRight ? 'left center' : 'right center',
                        backgroundColor: theme.accent,
                      }}
                      className="relative w-full h-[1.5px] opacity-75 group-hover/item:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  {/* ── Horizontal Branching Connector Line (Mobile) ── */}
                  <div
                    className={`md:hidden flex items-center absolute top-1/2 -translate-y-1/2 h-[2px] w-[26px] pointer-events-none ${
                      isRtl ? 'right-full' : 'left-full'
                    }`}
                  >
                    <div className="absolute inset-x-0 h-[1.5px] bg-border/50 dark:bg-white/10" />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        transformOrigin: isRtl ? 'right center' : 'left center',
                        backgroundColor: theme.accent,
                      }}
                      className="relative w-full h-[1.5px] opacity-75 group-hover/item:opacity-100"
                    />
                  </div>
                </div>

                {/* ─── Desktop First Column (Inline-Start of Spine) ── */}
                <div className="hidden md:flex md:w-1/2 justify-end md:pe-12 lg:pe-14">
                  {!isRightSide ? (
                    <TimelineNodeCard
                      item={item}
                      theme={theme}
                      isRtl={isRtl}
                      alignToSpineEnd={true}
                    />
                  ) : null}
                </div>

                {/* ─── Second Column (Inline-End of Spine, & All Items on Mobile) ── */}
                <div className="w-full ps-14 sm:ps-16 md:ps-12 lg:ps-14 md:w-1/2 flex justify-start">
                  <div className={`w-full ${!isRightSide ? 'md:hidden' : ''}`}>
                    <TimelineNodeCard
                      item={item}
                      theme={theme}
                      isRtl={isRtl}
                      alignToSpineEnd={false}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Bottom Continuous Evolution Terminal Anchor ───────────── */}
        <div className="relative pt-2">
          <div className={`absolute top-0 ${spinePositionClass} z-20 flex items-center justify-center`}>
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
