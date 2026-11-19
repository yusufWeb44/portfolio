import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMediaUrl } from '../../utils/mediaUrl';
import { buttonVariants, cn } from '../ui/Button';
import { SplitText, BlurText, SpotlightCard } from '../react-bits';
import { useIsMobile } from '../../hooks/useIsMobile';

/* ─── Data Interfaces ─────────────────────────────────────────────── */
interface ProjectImage {
  id?: string;
  url: string;
  isCover?: boolean;
}

interface Technology {
  id?: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  description: string;
  descriptionAr?: string | null;
  role?: string | null;
  roleAr?: string | null;
  category?: string | null;
  categoryAr?: string | null;
  year?: string | null;
  liveDemo?: string | null;
  isFeatured?: boolean;
  order?: number;
  images: ProjectImage[];
  technologies: Technology[];
}

/* ─── Project Media Visual Component ───────────────────────────────── */
const ProjectMediaVisual = ({
  project,
  cardIndex,
}: {
  project: Project;
  cardIndex: number;
}) => {
  const coverImage =
    project.images?.find((img) => img.isCover)?.url ||
    project.images?.[0]?.url;

  if (coverImage) {
    return (
      <div className="w-full h-full relative overflow-hidden group">
        <img
          src={getMediaUrl(coverImage)}
          alt={project.title}
          width={700}
          height={450}
          className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  // Atmospheric gradients matching the Healio reference aesthetic
  const ambientGradients = [
    'from-[#0b1424] via-[#10203a] to-[#070c16]',
    'from-[#0d1627] via-[#131f38] to-[#080d18]',
    'from-[#091120] via-[#0f1b32] to-[#060a14]',
  ];
  const gradient = ambientGradients[cardIndex % ambientGradients.length];

  return (
    <div
      className={`w-full h-full relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center select-none p-6`}
    >
      <div className="absolute -top-12 -left-12 w-52 h-52 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent to-black/40 pointer-events-none" />

      {/* Iconic Geometric Shapes Logo */}
      <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[8px] bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
      </div>

      {/* Minimalistic corner branding tag */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[10px] font-mono tracking-widest uppercase text-white/30 font-medium">
        {(project.slug || project.title || 'PRJ').split('-')[0].toUpperCase()}
      </div>
    </div>
  );
};

/* ─── Mobile & Tablet Project Card Component (Clean, Natural In-Flow Card) ─── */
const MobileProjectCard = ({
  project,
  i,
  isAr,
}: {
  project: Project;
  i: number;
  isAr: boolean;
}) => {
  const displayTitle = isAr ? project.titleAr || project.title : project.title;
  const displayCategory = isAr ? project.categoryAr || project.category : project.category;
  const displayDescription = isAr ? project.descriptionAr || project.description : project.description;
  const coverImage = project.images?.find((img) => img.isCover)?.url || project.images?.[0]?.url;
  const formattedNumber = String(i + 1).padStart(2, '0');

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-background dark:bg-zinc-950/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08),0_12px_36px_-4px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20">
      {/* 1. Cover Image at Top (Clean, without overlaid badge) */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-muted/20 border-b border-slate-200/70 dark:border-white/[0.08] group">
        {coverImage ? (
          <img
            src={getMediaUrl(coverImage)}
            alt={project.title}
            width={900}
            height={500}
            className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
            <span className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-widest">{project.title}</span>
          </div>
        )}
      </div>

      {/* 2. Content Body (Matching Desktop structure, numbering & labels 1:1, perfectly scaled for phone & tablet) */}
      <div className={`p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col ${isAr ? 'text-right' : 'text-left'}`}>
        {/* Numbering + Category + Year */}
        <div className="flex items-baseline gap-2.5 sm:gap-3 mb-1.5 md:mb-2 justify-start">
          <span className="text-xl sm:text-2xl md:text-3xl font-black font-sans tracking-tight text-foreground dark:text-white leading-none select-none">
            {formattedNumber}
          </span>
          {(project.year || displayCategory) && (
            <span className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 dark:text-zinc-400 inline-flex items-center gap-1.5 truncate">
              {displayCategory && <span className="truncate">{displayCategory}</span>}
              {displayCategory && project.year && <span className="text-muted-foreground/50">•</span>}
              {project.year && <span dir="ltr">{project.year}</span>}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground dark:text-white mb-2 md:mb-2.5 leading-snug">
          {displayTitle}
        </h3>

        {/* Description / Bio */}
        <p className="text-xs sm:text-[13px] md:text-sm lg:text-[14.5px] text-muted-foreground dark:text-zinc-300 leading-relaxed line-clamp-4 md:line-clamp-5 mb-3 md:mb-4 w-full">
          {displayDescription}
        </p>

        {/* Technologies Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-3.5 md:mb-4.5 max-h-[26px] md:max-h-[32px] overflow-hidden justify-start">
            {project.technologies.slice(0, 6).map((tech, tIdx) => (
              <span
                key={tech.id || tech.name || tIdx}
                className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] sm:text-[10.5px] md:text-xs font-mono font-medium border border-border/70 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-foreground dark:text-zinc-300 whitespace-nowrap"
              >
                {tech.name}
              </span>
            ))}
          </div>
        )}

        {/* Action Button: Natural suitable size */}
        <div className="pt-1.5 md:pt-2 flex items-center justify-start">
          <Link
            to={`/projects#${project.slug}`}
            className={cn(
              buttonVariants({ variant: 'primary', size: 'default' }),
              "w-auto inline-flex items-center justify-center font-bold text-xs sm:text-[13px] md:text-sm tracking-wide shadow-sm py-2 md:py-2.5 px-5 md:px-6 hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)] dark:hover:shadow-[0_6px_16px_rgba(16,185,129,0.14)]"
            )}
          >
            <span>{isAr ? 'عرض دراسة الحالة' : 'VIEW CASE STUDY'}</span>
            <ArrowRight
              className="w-4 h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180 text-slate-950 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── Desktop Stacked Card Component (Framer Motion Scroll-Driven Deck) ─── */
interface DesktopStackedCardProps {
  project: Project;
  i: number;
  total: number;
  isAr: boolean;
  scrollYProgress: MotionValue<number>;
}

const DesktopStackedCard = ({
  project,
  i,
  total,
  isAr,
  scrollYProgress,
}: DesktopStackedCardProps) => {
  const isFirst = i === 0;

  const numIncoming = Math.max(1, total - 1);
  const cardSpan = 0.86 / numIncoming;
  const start = 0.08 + (i - 1) * cardSpan;
  const end = start + cardSpan * 0.85;

  const y = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 0;
    if (typeof progress !== 'number' || isNaN(progress) || progress <= start) {
      return 900;
    }
    if (progress >= end) {
      return 0;
    }
    const t = (progress - start) / (end - start);
    const ease = 1 - Math.pow(1 - t, 3);
    return Math.round((1 - ease) * 900);
  });

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 1;
    if (typeof progress !== 'number' || isNaN(progress) || progress <= start) {
      return 0;
    }
    if (progress >= end) {
      return 1;
    }
    const t = (progress - start) / (end - start);
    return Math.min(1, t / 0.35);
  });

  const visibility = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 'visible' as const;
    if (typeof progress !== 'number' || isNaN(progress) || progress <= start) {
      return 'hidden' as const;
    }
    return 'visible' as const;
  });

  const pointerEvents = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 'auto' as const;
    if (typeof progress !== 'number' || isNaN(progress) || progress < end * 0.9) {
      return 'none' as const;
    }
    return 'auto' as const;
  });

  const displayTitle = isAr ? project.titleAr || project.title : project.title;
  const displayCategory = isAr ? project.categoryAr || project.category : project.category;
  const displayDescription = isAr ? project.descriptionAr || project.description : project.description;
  const formattedNumber = String(i + 1).padStart(2, '0');
  const diff = Math.max(0, total - 1 - i);

  return (
    <motion.div
      style={{
        top: `calc(${i} * var(--cards-step))`,
        zIndex: i + 10,
        y,
        opacity,
        visibility,
        pointerEvents,
      }}
      className="absolute inset-x-0 mx-auto flex justify-center will-change-transform"
    >
      <SpotlightCard
        spotlightColor="rgba(0, 0, 0, 0.02)"
        darkSpotlightColor="rgba(255, 255, 255, 0.007)"
        size={420}
        darkSize={580}
        style={{
          maxWidth: `calc(980px - ${diff * 20}px)`,
          width: `calc(100% - ${diff * 10}px)`,
          transformOrigin: 'top center',
        }}
        className="rounded-2xl border border-slate-200/90 dark:border-white/[0.14] bg-background dark:bg-background shadow-[0_4px_20px_-2px_rgba(0,0,0,0.12),0_12px_36px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] overflow-hidden relative w-full"
      >
        {/* Desktop 12-col split */}
        <div className="grid grid-cols-12 gap-5 lg:gap-6 px-5 lg:px-6 pt-3 lg:pt-3.5 pb-4.5 lg:pb-6 items-stretch xl:min-h-[355px] xl:max-h-[355px] xl:h-[355px]">
          {/* Details Column (5 cols) */}
          <div
            className={`col-span-5 flex flex-col justify-between h-full min-h-0 ${isAr ? 'text-right' : 'text-left'
              }`}
          >
            <div>
              <div className="flex items-baseline gap-2.5 sm:gap-3 mb-1 justify-start">
                <span className="text-2xl lg:text-[2rem] font-black font-sans tracking-tight text-foreground dark:text-white leading-none select-none">
                  {formattedNumber}
                </span>
                {(project.year || displayCategory) && (
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 dark:text-zinc-400 inline-flex items-center gap-1.5 truncate">
                    {displayCategory && <span className="truncate">{displayCategory}</span>}
                    {displayCategory && project.year && <span className="text-muted-foreground/50">•</span>}
                    {project.year && <span dir="ltr">{project.year}</span>}
                  </span>
                )}
              </div>

              <h3 className="text-lg lg:text-[1.45rem] font-bold tracking-tight text-foreground dark:text-white mb-1.5 leading-snug line-clamp-1">
                {displayTitle}
              </h3>

              <p className="text-[13px] lg:text-[13.5px] text-muted-foreground dark:text-zinc-300 leading-relaxed line-clamp-4 lg:line-clamp-6 mb-2.5 w-full">
                {displayDescription}
              </p>

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5 max-h-[26px] overflow-hidden justify-start">
                  {project.technologies.slice(0, 5).map((tech, tIdx) => (
                    <span
                      key={tech.id || tech.name || tIdx}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono font-medium border border-border/70 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-foreground dark:text-zinc-300 whitespace-nowrap"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-start">
              <Link
                to={`/projects#${project.slug}`}
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'default' }),
                  "font-bold text-[13px] tracking-wide shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)] dark:hover:shadow-[0_6px_16px_rgba(16,185,129,0.14)]"
                )}
              >
                <span>{isAr ? 'عرض دراسة الحالة' : 'VIEW CASE STUDY'}</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 text-slate-950"
                />
              </Link>
            </div>
          </div>

          {/* Media Column (7 cols) */}
          <div className="col-span-7 flex items-stretch h-full shrink-0">
            <div className="w-full h-full min-h-full rounded-xl overflow-hidden border border-foreground/15 dark:border-white/10 bg-muted/20 shadow-inner group">
              <ProjectMediaVisual project={project} cardIndex={i} />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROJECTS SECTION COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const ProjectsSection = () => {
  const isMobile = useIsMobile();
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_projects');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Load Settings & Projects directly from Backend API (Dashboard Driven)
  useEffect(() => {
    const fetchSettingsAndProjects = () => {
      api.get('/settings').then((res) => setSettings(res.data?.data)).catch(() => { });
      api
        .get('/projects?public=true')
        .then((res) => {
          const data = res.data.data || [];
          setProjects(data);
          try {
            localStorage.setItem('portfolio_projects', JSON.stringify(data));
          } catch { }
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    };

    fetchSettingsAndProjects();

    const handleUpdate = () => fetchSettingsAndProjects();
    window.addEventListener('portfolio_settings_updated', handleUpdate);
    window.addEventListener('portfolio_projects_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_settings_updated', handleUpdate);
      window.removeEventListener('portfolio_projects_updated', handleUpdate);
    };
  }, []);

  // Assemble projects for the stacked deck: ONLY projects explicitly starred as featured appear on the homepage
  const deckProjects: Project[] = useMemo(() => {
    return projects.filter((p: any) => Boolean(p.isFeatured));
  }, [projects]);

  const resolveField = (key: string, arVal?: string, enVal?: string, fallback?: string) => {
    if (isAr) {
      return t(key, arVal || fallback);
    }
    return t(key, enVal || fallback);
  };

  const displayTitle = resolveField('projects.title', settings?.projectsTitleAr, settings?.projectsTitle, 'Selected Work.');
  const displaySubtitle = resolveField(
    'projects.subtitle',
    settings?.projectsSubtitleAr,
    settings?.projectsSubtitle,
    'A curated selection of production web applications, custom CRM platforms, and full-stack software architectures built for performance and measurable business impact.'
  );

  const totalCount = projects.length;
  const numCards = deckProjects.length;

  // Track height for Desktop & Tablet: original cinematic 70vh per incoming card ensures smooth, unhurried stacking
  const trackHeight = numCards <= 1 ? 'auto' : `${100 + (numCards - 1) * 70}vh`;

  // Dynamic viewport detection: prevents mobile/tablet browsers from downloading desktop deck images
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="projects" className="scroll-mt-24 relative bg-transparent">
      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE & TABLET VIEW (< xl): Clean, natural in-flow cards without sticky lock
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="block xl:hidden w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 lg:py-20">
        {/* Section Header: Centered on all iPads (md: and lg:), aligned start on phones */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-start md:text-center flex flex-col md:items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-2 sm:mb-3 md:text-center">
            {isMobile ? displayTitle : <SplitText text={displayTitle} delay={35} duration={0.45} />}
          </h2>
          {displaySubtitle && (
            isMobile ? (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3 md:text-center max-w-2xl md:mx-auto">
                {displaySubtitle}
              </p>
            ) : (
              <BlurText
                key={`projects-subtitle-mob-${isAr ? 'ar' : 'en'}`}
                text={displaySubtitle}
                animateBy="block"
                delay={20}
                className="text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3 md:text-center max-w-2xl md:mx-auto"
              />
            )
          )}
        </div>

        {/* Cards Vertical List: Rendered naturally one below the other */}
        {loading ? (
          <div className="h-[280px] md:h-[360px] rounded-2xl md:rounded-3xl bg-card/40 dark:bg-white/[0.02] border border-border/50 animate-pulse flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : numCards === 0 ? (
          <div className="py-12 md:py-16 px-4 text-center border border-dashed border-border/70 rounded-2xl bg-card/30">
            <p className="text-muted-foreground text-sm md:text-base">
              {isAr ? 'لا توجد مشاريع منشورة حالياً.' : 'No projects published yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">
            {deckProjects.map((project, i) => (
              <MobileProjectCard
                key={project.id || `mob_p_${i}`}
                project={project}
                i={i}
                isAr={isAr}
              />
            ))}
          </div>
        )}

        {/* Bottom Explore Button on Mobile & Tablet */}
        {totalCount > 0 && (
          <div className="pt-8 sm:pt-10 md:pt-14 flex justify-center">
            <Link
              to="/projects"
              className={cn(
                buttonVariants({ variant: 'primary', size: 'default' }),
                "w-auto inline-flex items-center justify-center font-bold tracking-wide px-6 sm:px-8 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)]"
              )}
            >
              <span className="relative z-10">{isAr ? 'استكشاف جميع المشاريع' : 'EXPLORE ALL PROJECTS'}</span>
              <ArrowUpRight
                size={16}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg] text-slate-950 ml-1.5 rtl:mr-1.5 rtl:ml-0"
              />
            </Link>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP ONLY VIEW (>= xl): Full original sticky deck stacking experience
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden xl:block [--cards-step:44px]">
        {isDesktop && (
          <>
            {/* Outer Scroll Track */}
            <div ref={trackRef} className="relative w-full" style={{ height: trackHeight }}>
              {/* Sticky Container - Pinned cleanly to top:0, full-screen, 100% desktop-grade */}
              <div className="sticky top-0 h-screen w-full flex flex-col justify-start pt-[84px] pb-6 overflow-x-clip pointer-events-none">
                {/* 1. Header */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-2.5 w-full pointer-events-auto shrink-0">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-1">
                      <SplitText text={displayTitle} delay={35} duration={0.45} />
                    </h2>
                    {displaySubtitle && (
                      <BlurText
                        key={`projects-subtitle-${isAr ? 'ar' : 'en'}`}
                        text={displaySubtitle}
                        animateBy="block"
                        delay={20}
                        className="text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-2"
                      />
                    )}
                  </div>
                </div>

                {/* 2. Cards Deck Container */}
                <div className="relative mt-6 w-full max-w-[980px] mx-auto px-6 flex-1 flex flex-col justify-start">
                  {loading ? (
                    <div className="h-[320px] flex items-center justify-center px-4">
                      <div className="w-full max-w-[920px] h-[280px] rounded-xl bg-card/40 dark:bg-white/[0.02] border border-border/50 animate-pulse flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
                      </div>
                    </div>
                  ) : numCards === 0 ? (
                    <div className="max-w-4xl mx-auto my-8 py-16 px-4 text-center border border-dashed border-border/70 rounded-xl bg-card/30 backdrop-blur-md pointer-events-auto">
                      <p className="text-muted-foreground text-base">
                        {isAr ? 'لا توجد مشاريع منشورة حالياً.' : 'No projects published yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {deckProjects.map((project, i) => (
                        <DesktopStackedCard
                          key={project.id || `p_${i}`}
                          project={project}
                          i={i}
                          total={numCards}
                          isAr={isAr}
                          scrollYProgress={scrollYProgress}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Bottom Section: Explore All Projects Button */}
            {totalCount > 0 && (
              <div className="pt-8 pb-16 flex justify-center px-4 relative z-20">
                <Link
                  to="/projects"
                  className={cn(
                    buttonVariants({ variant: 'primary', size: 'lg' }),
                    "font-bold tracking-wide"
                  )}
                >
                  <span className="relative z-10">{isAr ? 'استكشاف جميع المشاريع' : 'EXPLORE ALL PROJECTS'}</span>
                  <ArrowUpRight
                    size={16}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg] text-slate-950"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
