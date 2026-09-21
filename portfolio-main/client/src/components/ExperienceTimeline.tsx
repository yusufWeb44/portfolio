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
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        badgeBorder: 'border-amber-500/40 dark:border-amber-500/60',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        cardBorder: 'hover:border-amber-500/40',
        tagBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        lineColor: '#F59E0B',
      };
    case 'coral':
    case 'rose':
    case 'red':
      return {
        key: 'coral',
        accent: '#F43F5E',
        badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
        badgeBorder: 'border-rose-500/40 dark:border-rose-500/60',
        text: 'text-rose-600 dark:text-rose-400',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
        cardBorder: 'hover:border-rose-500/40',
        tagBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
        lineColor: '#F43F5E',
      };
    case 'teal':
    case 'cyan':
      return {
        key: 'teal',
        accent: '#14B8A6',
        badgeBg: 'bg-teal-500/10 dark:bg-teal-500/15',
        badgeBorder: 'border-teal-500/40 dark:border-teal-500/60',
        text: 'text-teal-600 dark:text-teal-400',
        glow: 'shadow-[0_0_20px_rgba(20,184,166,0.25)]',
        cardBorder: 'hover:border-teal-500/40',
        tagBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
        lineColor: '#14B8A6',
      };
    case 'blue':
    case 'sky':
    case 'indigo':
      return {
        key: 'blue',
        accent: '#3B82F6',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
        badgeBorder: 'border-blue-500/40 dark:border-blue-500/60',
        text: 'text-blue-600 dark:text-blue-400',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
        cardBorder: 'hover:border-blue-500/40',
        tagBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
        lineColor: '#3B82F6',
      };
    case 'purple':
    case 'violet':
      return {
        key: 'purple',
        accent: '#8B5CF6',
        badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
        badgeBorder: 'border-purple-500/40 dark:border-purple-500/60',
        text: 'text-purple-600 dark:text-purple-400',
        glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
        cardBorder: 'hover:border-purple-500/40',
        tagBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
        lineColor: '#8B5CF6',
      };
    case 'emerald':
    case 'green':
    default:
      return {
        key: 'emerald',
        accent: 'var(--theme-primary-hex, #10B981)',
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        badgeBorder: 'border-emerald-500/40 dark:border-emerald-500/60',
        text: 'text-emerald-600 dark:text-emerald-400',
        glow: 'shadow-[0_0_20px_var(--theme-primary-hex,rgba(16,185,129,0.25))]',
        cardBorder: 'hover:border-emerald-500/40',
        tagBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        lineColor: 'var(--theme-primary-hex, #10B981)',
      };
  }
};

export const ExperienceTimeline = ({ experiences }: ExperienceTimelineProps) => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  if (!experiences || experiences.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground text-sm font-medium">
          {isAr ? 'لم تتم إضافة خبرات حتى الآن.' : 'No experience items added yet.'}
        </p>
      </div>
    );
  }

  return <ExperienceTimelineInner key={experiences.map(e => e.id).join('-')} experiences={experiences} />;
};

const ExperienceTimelineInner = ({ experiences }: ExperienceTimelineProps) => {
  const { t, currentLang, currentDirection } = useLanguage();
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

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  const getTypeLabel = (type?: string) => {
    if (type === 'education') return isRtl ? '🎓 دراسة ومؤهلات' : '🎓 Education';
    if (type === 'milestone') return isRtl ? '⭐ إنجاز ومحطة' : '⭐ Milestone';
    return isRtl ? '💼 مسار مهني' : '💼 Career';
  };

  return (
    <div ref={containerRef} className="relative w-full py-4 max-w-5xl mx-auto">
      {/* ─── Top Origin Header & Chevron ────────────────────────────── */}
      <div className={`relative z-20 flex flex-col items-start ${isRtl ? 'pr-4 sm:pr-6 md:pr-0' : 'pl-4 sm:pl-6 md:pl-0'} md:items-center justify-center mb-10`}>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-start md:items-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Sparkles size={13} className="text-emerald-500" />
            <span>{isRtl ? t('experience.badge', 'المسيرة الأكاديمية والمهنية') : 'Academic & Career Journey'}</span>
          </div>
          
          {/* Top Arrow Badge - Directly anchored to the top of the vertical spine */}
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-4 ring-emerald-500/20">
            <ChevronDown size={16} className="stroke-[2.5]" />
          </div>
        </motion.div>
      </div>

      {/* ─── Timeline Container with Centered Continuous Spine ────────── */}
      <div className="relative">
        {/* Base Inactive Vertical Spine Track: Slim 2px */}
        <div 
          className={`absolute top-0 bottom-6 w-[2px] bg-border/60 dark:bg-white/10 rounded-full ${
            isRtl ? 'right-8 md:right-1/2 translate-x-1/2' : 'left-8 md:left-1/2 -translate-x-1/2'
          }`}
        />

        {/* Active Scroll Beam: Slim 2.5px with silky height growth and traveling head */}
        <div className={`absolute top-0 bottom-6 w-[2.5px] rounded-full ${
          isRtl ? 'right-8 md:right-1/2 translate-x-1/2' : 'left-8 md:left-1/2 -translate-x-1/2'
        } pointer-events-none z-10 overflow-visible`}>
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.85)] relative"
          >
            {/* Traveling Glowing Light Particle in Brand Emerald at the beam's front tip */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-emerald-500/40 blur-[3px] animate-pulse" />
              <div className="absolute w-3 h-3 rounded-full bg-emerald-300 border-2 border-white dark:border-slate-950 shadow-[0_0_10px_var(--theme-primary-hex,#10b981)]" />
            </div>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="relative flex flex-col md:flex-row items-start w-full"
              >
                {/* ─── Central Spine Node & Horizontal Connector Arm ────── */}
                <div className={`absolute top-7 ${
                  isRtl ? 'right-8 md:right-1/2 translate-x-1/2' : 'left-8 md:left-1/2 -translate-x-1/2'
                } z-20 flex items-center justify-center pointer-events-none`}>
                  {/* Central Node Circle */}
                  <motion.div
                    whileHover={{ scale: 1.25 }}
                    className="w-5 h-5 rounded-full bg-background border-4 flex items-center justify-center shadow-md"
                    style={{ borderColor: theme.accent }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </motion.div>

                  {/* Horizontal Branching Stem Line (Desktop) */}
                  <div
                    className={`hidden md:block absolute h-0.5 pointer-events-none transition-all duration-300 ${
                      stemGoesRight 
                        ? 'left-2.5 w-10 bg-gradient-to-r' 
                        : 'right-2.5 w-10 bg-gradient-to-l'
                    }`}
                    style={{
                      backgroundImage: stemGoesRight
                        ? `linear-gradient(to right, ${theme.accent}, ${theme.accent}60)`
                        : `linear-gradient(to left, ${theme.accent}, ${theme.accent}60)`
                    }}
                  />

                  {/* Horizontal Branching Stem Line (Mobile) */}
                  <div
                    className={`md:hidden absolute w-7 h-0.5 pointer-events-none ${
                      isRtl ? 'right-2.5' : 'left-2.5'
                    }`}
                    style={{
                      backgroundImage: isRtl
                        ? `linear-gradient(to left, ${theme.accent}, ${theme.accent}60)`
                        : `linear-gradient(to right, ${theme.accent}, ${theme.accent}60)`
                    }}
                  />
                </div>

                {/* ─── Desktop First Column (LTR: Left / RTL: Right of spine) ── */}
                <div className="hidden md:flex md:w-1/2 justify-end pe-14">
                  {!isRightSide ? (
                    <div className="w-full text-start flex flex-col items-start rtl:items-end">
                      {/* Top Row: Year and Circular Icon Badge */}
                      <div className={`flex items-center gap-3.5 mb-3 ${isRtl ? 'flex-row justify-end' : 'flex-row-reverse justify-start'}`}>
                        {/* Circular Icon Badge */}
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 ${theme.badgeBorder} ${theme.badgeBg} flex items-center justify-center transition-colors duration-200 group cursor-pointer backdrop-blur-md shadow-sm`}
                        >
                          <div 
                            className="absolute inset-1 rounded-full border border-dashed opacity-50"
                            style={{ borderColor: theme.accent }}
                          />
                          <span className={`${theme.text} transition-colors duration-200`}>
                            {getTimelineIcon(item.icon, item.type, 20)}
                          </span>
                        </motion.div>

                        {/* Bold Year & Category */}
                        <div className={`flex flex-col ${isRtl ? 'items-end' : 'items-end'}`}>
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
                          {item.type && (
                            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
                              {getTypeLabel(item.type)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`w-full p-5 rounded-2xl bg-card/60 dark:bg-white/[0.03] backdrop-blur-xl border border-border/70 ${theme.cardBorder} transition-all duration-300 shadow-sm text-start`}>
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                          {isRtl ? (item.positionAr || item.position) : item.position}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                          <span className="font-semibold text-foreground/90">{isRtl ? (item.companyAr || item.company) : item.company}</span>
                          {(item.location || (isRtl && item.locationAr)) && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={11} /> {isRtl ? (item.locationAr || item.location) : item.location}
                              </span>
                            </>
                          )}
                        </div>
                        {(item.description || (isRtl && item.descriptionAr)) && (
                          <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed pt-2.5 whitespace-pre-line">
                            {isRtl ? (item.descriptionAr || item.description) : item.description}
                          </p>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3">
                            {item.technologies.map(tech => (
                              <span
                                key={tech.name}
                                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${theme.tagBg}`}
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* ─── Second Column (LTR: Right / RTL: Left of spine, Mobile: single) ── */}
                <div className="w-full ps-16 sm:ps-20 md:ps-14 md:w-1/2 flex justify-start">
                  {(isRightSide || true) && (
                    <div className={`w-full text-start flex flex-col items-start ${!isRightSide ? 'md:hidden' : ''}`}>
                      {/* Top Row: Circular Icon Badge and Year */}
                      <div className="flex items-center gap-3.5 mb-3 flex-row justify-start">
                        {/* Circular Icon Badge */}
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 ${theme.badgeBorder} ${theme.badgeBg} flex items-center justify-center transition-colors duration-200 group cursor-pointer backdrop-blur-md shadow-sm`}
                        >
                          <div 
                            className="absolute inset-1 rounded-full border border-dashed opacity-50"
                            style={{ borderColor: theme.accent }}
                          />
                          <span className={`${theme.text} transition-colors duration-200`}>
                            {getTimelineIcon(item.icon, item.type, 20)}
                          </span>
                        </motion.div>

                        {/* Bold Year & Category */}
                        <div className="flex flex-col items-start">
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
                          {item.type && (
                            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
                              {getTypeLabel(item.type)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`w-full p-5 rounded-2xl bg-card/60 dark:bg-white/[0.03] backdrop-blur-xl border border-border/70 ${theme.cardBorder} transition-all duration-300 shadow-sm text-start`}>
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                          {isRtl ? (item.positionAr || item.position) : item.position}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                          <span className="font-semibold text-foreground/90">{isRtl ? (item.companyAr || item.company) : item.company}</span>
                          {(item.location || (isRtl && item.locationAr)) && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={11} /> {isRtl ? (item.locationAr || item.location) : item.location}
                              </span>
                            </>
                          )}
                        </div>
                        {(item.description || (isRtl && item.descriptionAr)) && (
                          <p className="text-xs md:text-sm text-muted-foreground/90 leading-relaxed pt-2.5 whitespace-pre-line">
                            {isRtl ? (item.descriptionAr || item.description) : item.description}
                          </p>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3">
                            {item.technologies.map(tech => (
                              <span
                                key={tech.name}
                                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${theme.tagBg}`}
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Bottom Continuous Evolution Terminal Anchor ───────────── */}
        <div className="relative pt-2">
          <div className={`absolute top-0 ${
            isRtl ? 'right-8 md:right-1/2 translate-x-1/2' : 'left-8 md:left-1/2 -translate-x-1/2'
          } z-20 flex items-center justify-center`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20">
              <ChevronDown size={18} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Text Label */}
          <div className="ps-16 sm:ps-20 md:ps-0 pt-1 md:pt-11 flex md:justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider uppercase bg-muted/60 text-muted-foreground border border-border/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isRtl ? 'تطور مستمر ورؤى مستقبلية' : 'Continuous Evolution & Future Roles'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
