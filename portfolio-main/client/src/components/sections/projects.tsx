import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMediaUrl } from '../../utils/mediaUrl';
import { buttonVariants, cn } from '../ui/Button';
import { SplitText, BlurText, SpotlightCard } from '../react-bits';

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

/* ─── Project Media Visual ─────────────────────────────────────────── */
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

/* ─── Stacked Card Item Component (Framer Motion Scroll-Driven) ──── */
interface StackedCardProps {
  project: Project;
  i: number;
  total: number;
  isAr: boolean;
  scrollYProgress: MotionValue<number>;
}

const StackedCard = ({
  project,
  i,
  total,
  isAr,
  scrollYProgress,
}: StackedCardProps) => {
  const isFirst = i === 0;

  // Segment allocations for incoming cards:
  // Card 0: static at y: 0, opacity: 1, visibility: 'visible'.
  // Incoming cards (i > 0): completely hidden and off-screen (y: 900, opacity: 0, visibility: 'hidden')
  // until their precise scroll segment begins.
  const numIncoming = Math.max(1, total - 1);
  const cardSpan = 0.86 / numIncoming;
  const start = 0.08 + (i - 1) * cardSpan;
  const end = start + cardSpan * 0.85; // 85% travel for smooth glide, 15% rest pause

  // y: Starts 900px below (well off-screen), glides up with cubic ease-out, settles at 0
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

  // opacity: Strictly 0 until start, fades in smoothly during the first 35% of travel, reaches 1
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

  // visibility: Strictly 'hidden' before start so upcoming cards never peek or render on screen prematurely
  const visibility = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 'visible' as const;
    if (typeof progress !== 'number' || isNaN(progress) || progress <= start) {
      return 'hidden' as const;
    }
    return 'visible' as const;
  });

  // pointerEvents: Non-interactive until card is settled
  const pointerEvents = useTransform(scrollYProgress, (progress) => {
    if (isFirst) return 'auto' as const;
    if (typeof progress !== 'number' || isNaN(progress) || progress < end * 0.9) {
      return 'none' as const;
    }
    return 'auto' as const;
  });

  // Dynamic Content Overrides
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
        spotlightColor="rgba(16, 185, 129, 0.04)"
        darkSpotlightColor="rgba(16, 185, 129, 0.012)"
        size={320}
        darkSize={200}
        style={{
          maxWidth: `calc(980px - ${diff * 20}px)`,
          width: `calc(100% - ${diff * 10}px)`,
          transformOrigin: 'top center',
        }}
        className="rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-white/[0.14] bg-background dark:bg-background shadow-[0_4px_20px_-2px_rgba(0,0,0,0.12),0_12px_36px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] overflow-hidden relative w-full"
      >
        {/* ── Main Card Body Grid: Beautifully balanced aspect ratio with exposed numbering strip ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 px-4 sm:px-5 lg:px-6 pt-2.5 sm:pt-3 lg:pt-3.5 pb-4 sm:pb-5 lg:pb-6 items-stretch min-h-[315px] sm:min-h-[335px] lg:min-h-[355px]">

          {/* Details Column (5 cols of 12) */}
          <div
            className={`lg:col-span-5 flex flex-col justify-between ${
              isAr ? 'text-right lg:order-2' : 'text-left lg:order-1'
            }`}
          >
            <div>
              {/* 1. Large Order Number: positioned in the top strip to peek out when stacked */}
              <div
                className={`flex items-baseline gap-2.5 sm:gap-3 mb-1 sm:mb-1.5 ${
                  isAr ? 'justify-end flex-row-reverse' : 'justify-start'
                }`}
              >
                <span className="text-xl sm:text-2xl lg:text-[2rem] font-black font-sans tracking-tight text-foreground dark:text-white leading-none select-none">
                  {formattedNumber}
                </span>
                {(project.year || displayCategory) && (
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 dark:text-zinc-400">
                    {displayCategory ? displayCategory : ''}
                    {project.year ? ` • ${project.year}` : ''}
                  </span>
                )}
              </div>

              {/* 3. Project Title */}
              <h3 className="text-lg sm:text-xl lg:text-[1.45rem] font-bold tracking-tight text-foreground dark:text-white mb-1.5 leading-snug">
                {displayTitle}
              </h3>

              {/* 4. Project Description */}
              <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-muted-foreground dark:text-zinc-300 leading-relaxed line-clamp-4 sm:line-clamp-5 lg:line-clamp-6 mb-3 sm:mb-3.5 w-full">
                {displayDescription}
              </p>

              {/* 5. Technologies Badges */}
              {project.technologies && project.technologies.length > 0 && (
                <div
                  className={`flex flex-wrap items-center gap-1.5 mb-2.5 sm:mb-3 ${
                    isAr ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {project.technologies.slice(0, 5).map((tech, tIdx) => (
                    <span
                      key={tech.id || tech.name || tIdx}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono font-medium border border-border/70 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-foreground dark:text-zinc-300"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Action Button */}
            <div className={`pt-2 flex items-center ${isAr ? 'justify-end' : 'justify-start'}`}>
              <Link
                to={`/projects#${project.slug}`}
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'default' }),
                  "font-bold text-xs sm:text-[13px] tracking-wide shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)] dark:hover:shadow-[0_6px_16px_rgba(16,185,129,0.14)]"
                )}
              >
                <span>{isAr ? 'عرض دراسة الحالة' : 'VIEW CASE STUDY'}</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 text-slate-950"
                />
              </Link>
            </div>
          </div>

          {/* Media Column (7 cols of 12) */}
          <div className={`lg:col-span-7 flex items-stretch ${isAr ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="w-full h-full min-h-[210px] sm:min-h-[240px] md:min-h-[270px] lg:min-h-[295px] max-h-[325px] rounded-lg sm:rounded-xl overflow-hidden border border-foreground/15 dark:border-white/10 bg-muted/20 shadow-inner group">
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
          } catch {}
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    };

    fetchSettingsAndProjects();

    const handleUpdate = () => fetchSettingsAndProjects();
    window.addEventListener('portfolio_settings_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_settings_updated', handleUpdate);
  }, []);

  // Assemble projects for the stacked deck:
  const deckProjects: Project[] = useMemo(() => {
    const featuredList = projects.filter((p: any) => p.isFeatured);
    const nonFeaturedList = projects.filter((p: any) => !p.isFeatured);
    const combined = [...featuredList, ...nonFeaturedList];
    return combined.slice(0, Math.min(combined.length, 5));
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

  // Track height: 70vh per incoming card for a tight, natural scroll
  const trackHeight = numCards === 0 ? '240vh' : (numCards === 1 ? 'auto' : `${100 + (numCards - 1) * 70}vh`);

  return (
    <section id="projects" className="scroll-mt-24 relative bg-transparent [--cards-step:36px] sm:[--cards-step:40px] lg:[--cards-step:44px]">
      {/* ── Outer Scroll Track ── */}
      <div ref={trackRef} className="relative w-full" style={{ height: trackHeight }}>
        {/* ── Single Unified Sticky Container: Locks title + cards together with proper navbar clearance ── */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-start pt-[80px] sm:pt-[84px] lg:pt-[84px] pb-4 overflow-x-clip pointer-events-none">

          {/* ── 1. Section Header: Clear margin below floating navbar ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 sm:pb-2.5 w-full pointer-events-auto">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-1">
                <SplitText
                  text={displayTitle}
                  delay={35}
                  duration={0.45}
                />
              </h2>
              {displaySubtitle && (
                <BlurText
                  text={displaySubtitle}
                  delay={20}
                  className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-2"
                />
              )}
            </div>
          </div>

          {/* ── 2. Cards Deck Container: Beautifully proportioned with comfortable height ── */}
          <div className="relative mt-1 sm:mt-2 w-full max-w-[980px] mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-start">
            {/* Scroll Indicator */}
            {!loading && numCards > 1 && (
              <div
                className={`hidden xl:flex flex-col items-center gap-2 absolute ${
                  isAr ? '-left-14' : '-right-14'
                } top-16 select-none pointer-events-none z-30`}
              >
                <div className="w-5 h-8 rounded-full border border-emerald-500/40 dark:border-emerald-400/30 flex justify-center pt-1 bg-card/40 dark:bg-black/40 backdrop-blur-xs shadow-xs">
                  <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  />
                </div>
                <span className="text-[9px] font-mono font-semibold tracking-[0.25em] uppercase text-muted-foreground/60 [writing-mode:vertical-lr] rotate-180">
                  {isAr ? 'تمرير' : 'SCROLL'}
                </span>
                <ChevronDown size={13} className="text-emerald-500/70 animate-bounce -mt-0.5" />
              </div>
            )}

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
                  <StackedCard
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

      {/* ── 3. Bottom Section: Explore All Projects Button (Standard in-flow section button) ── */}
      {totalCount > 0 && (
        <div className="pt-6 sm:pt-8 pb-16 flex justify-center px-4 relative z-20">
          <Link
            to="/projects"
            className={cn(
              buttonVariants({ variant: 'primary', size: 'lg' }),
              "font-bold tracking-wide"
            )}
          >
            <span className="relative z-10">{isAr ? `استكشاف جميع المشاريع (${totalCount})` : `EXPLORE ALL PROJECTS (${totalCount})`}</span>
            <ArrowUpRight
              size={16}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg] text-slate-950"
            />
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
