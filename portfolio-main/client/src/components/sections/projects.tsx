import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMediaUrl } from '../../utils/mediaUrl';

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
  github?: string | null;
  isFeatured?: boolean;
  order?: number;
  images: ProjectImage[];
  technologies: Technology[];
}

/* ─── Fallback Projects (Guarantees complete 3-card deck matching reference) ─── */
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'healio-medical-app',
    title: 'Healio',
    titleAr: 'هيليو',
    slug: 'healio-medical-app',
    year: '2025',
    category: 'Medical • Mobile App',
    categoryAr: 'رعاية صحية • تطبيق هاتف',
    description:
      'A patient-centered platform with intuitive navigation and calming visual architecture focused on healthcare accessibility and real-time consultations.',
    descriptionAr:
      'منصة طبية متكاملة تركز على تجربة المريض مع تصميم هادئ وواجهات سلسة تهدف لتسهيل الوصول للرعاية الصحية والاستشارات الفورية.',
    technologies: [
      { name: 'React Native' },
      { name: 'Node.js' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'PostgreSQL' },
    ],
    images: [],
  },
  {
    id: 'finflow-banking-system',
    title: 'FinFlow',
    titleAr: 'فين فلو',
    slug: 'finflow-banking-system',
    year: '2024',
    category: 'Fintech • Enterprise Core',
    categoryAr: 'تقنية مالية • أنظمة مصرفية',
    description:
      'Next-generation treasury management and automated financial ledger system engineered for high-throughput transactional velocity and audit-grade safety.',
    descriptionAr:
      'منصة مالية ومصرفية متقدمة لإدارة السيولة والتحويلات المالية الفورية بنظام قيود مشفر يلبي أعلى معايير الأمان المالي.',
    technologies: [
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'Go' },
      { name: 'Prisma' },
      { name: 'Redis' },
    ],
    images: [],
  },
  {
    id: 'aether-crm-enterprise',
    title: 'Aether CRM',
    titleAr: 'إيثر سي آر إم',
    slug: 'aether-crm-enterprise',
    year: '2024',
    category: 'Enterprise • SaaS Platform',
    categoryAr: 'أنظمة سحابية • إدارة أعمال',
    description:
      'Scalable multi-tenant enterprise orchestration suite providing deep revenue analytics, automated pipeline workflows, and unified team collaboration.',
    descriptionAr:
      'نظام إدارة علاقات عملاء مؤسسي متعدد المستأجرين مع تحليلات إيرادات مدعومة بالأتمتة وخطط سير عمل مخصصة لفرق المبيعات.',
    technologies: [
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'Docker' },
      { name: 'GraphQL' },
      { name: 'PostgreSQL' },
    ],
    images: [],
  },
];

/* ─── Project Media Visual (Matches Healio reference: Square • Circle • Circle) ─── */
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
      {/* Subtle colorful ambient light reflections from the mockup */}
      <div className="absolute -top-12 -left-12 w-52 h-52 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent to-black/40 pointer-events-none" />

      {/* Iconic Geometric Shapes Logo: [ Square • Circle • Circle ] from reference mockup */}
      <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[8px] bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
      </div>

      {/* Minimalistic corner branding tag */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[10px] font-mono tracking-widest uppercase text-white/30 font-medium">
        {project.slug.split('-')[0].toUpperCase()}
      </div>
    </div>
  );
};

/* ─── Stacked Card Item Component ────────────────────────────────── */
interface StackedCardProps {
  project: Project;
  index: number;
  activeCard: number;
  isAr: boolean;
  onSelect: () => void;
}

const StackedCard = ({
  project,
  index,
  activeCard,
  isAr,
  onSelect,
}: StackedCardProps) => {
  // Relative position in the 3-card rotating deck: 0 = Front, 1 = Middle, 2 = Back
  const pos = (index - activeCard + 3) % 3;
  const isFront = pos === 0;

  // Exact Portfolio Identity Color Tokens:
  // Dark: Deep Obsidian Matrix with crisp emerald borders and atmospheric glow
  // Light: Clean Crisp White with subtle slate borders
  const cardLayerStyles = [
    // Position 0 (Front)
    'bg-white dark:bg-[#0c1017] border-slate-300/80 dark:border-emerald-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),0_0_30px_-10px_rgba(16,185,129,0.12)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95),0_0_40px_-15px_rgba(16,185,129,0.18)]',
    // Position 1 (Middle)
    'bg-slate-50 dark:bg-[#090d14] border-slate-300/70 dark:border-emerald-500/20 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]',
    // Position 2 (Back)
    'bg-slate-100 dark:bg-[#070a0f] border-slate-300/60 dark:border-emerald-500/12 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.75)]',
  ];

  const currentBgStyle = cardLayerStyles[pos];

  // Dynamic Content Overrides
  const displayTitle = isAr ? project.titleAr || project.title : project.title;
  const displayCategory = isAr ? project.categoryAr || project.category : project.category;
  const displayDescription = isAr ? project.descriptionAr || project.description : project.description;
  const formattedNumber = String(index + 1).padStart(2, '0');

  // Exact Stacking Geometry matching Healio reference:
  // - Vertical stacking step: exactly 34px per layer (y: 0 -> y: -34 -> y: -68)
  // - Top-center transform origin with scale 0.91 and 0.83 creates identical ~38px symmetrical horizontal indents
  const cardVariants: any = {
    front: {
      y: 0,
      scale: 1,
      zIndex: 30,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        scale: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        opacity: { duration: 0.2 },
        zIndex: { delay: 0 },
      },
    },
    middle: {
      y: -34,
      scale: 0.91,
      zIndex: 20,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        scale: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        opacity: { duration: 0.2 },
        zIndex: { delay: 0 },
      },
    },
    back: {
      y: -68,
      scale: 0.83,
      zIndex: 10,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        scale: { type: 'spring', stiffness: 220, damping: 24, mass: 0.5 },
        opacity: { duration: 0.2 },
        zIndex: { delay: 0.15 },
      },
    },
  };

  const currentVariant = pos === 0 ? 'front' : pos === 1 ? 'middle' : 'back';

  return (
    <motion.div
      variants={cardVariants}
      animate={currentVariant}
      initial={false}
      style={{ transformOrigin: 'top center' }}
      onClick={!isFront ? onSelect : undefined}
      className={`absolute top-0 left-0 right-0 w-full rounded-[28px] sm:rounded-[34px] border overflow-hidden ${currentBgStyle} ${
        !isFront ? 'cursor-pointer hover:border-foreground/30 dark:hover:border-emerald-500/40 transition-colors' : ''
      }`}
    >
      {/* Subtle atmospheric brand emerald sheen in corner */}
      {isFront && (
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* ── Main Card Body Grid: Balanced layout with wider media preview (5:7 ratio) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 p-6 sm:p-7 lg:p-8 items-stretch min-h-[410px] sm:min-h-[435px] lg:min-h-[460px]">
        
        {/* Left Column: Project Details (5 cols of 12) */}
        <div
          className={`lg:col-span-5 flex flex-col justify-between ${
            isAr ? 'text-right' : 'text-left'
          } transition-opacity duration-300 ${
            isFront ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none select-none'
          }`}
        >
          <div>
            {/* 1. Pill Number Badge (Standalone oval pill matching Healio reference) */}
            <div className={`flex items-center mb-4 sm:mb-5 ${isAr ? 'justify-end' : 'justify-start'}`}>
              <div className="w-12 h-7 sm:w-13 sm:h-7.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-center font-mono text-xs font-semibold text-foreground dark:text-emerald-400">
                {formattedNumber}
              </div>
            </div>

            {/* 2. Metadata Line: Year • Category */}
            <div className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-400 mb-2">
              {project.year || '2025'}{displayCategory ? ` • ${displayCategory}` : ''}
            </div>

            {/* 3. Project Title — Harmonized with portfolio typography */}
            <h3 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-tight text-foreground dark:text-white mb-2.5 leading-snug">
              {displayTitle}
            </h3>

            {/* 4. Project Description: Expanded to show full content and fill vertical space */}
            <p className="text-xs sm:text-[13.5px] lg:text-sm text-muted-foreground dark:text-zinc-300 leading-relaxed sm:leading-[1.65] line-clamp-5 sm:line-clamp-6 mb-4 sm:mb-5 w-full">
              {displayDescription}
            </p>

            {/* 5. Technologies Badges */}
            {project.technologies && project.technologies.length > 0 && (
              <div
                className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mb-5 ${
                  isAr ? 'justify-end' : 'justify-start'
                }`}
              >
                {project.technologies.map((tech, tIdx) => (
                  <span
                    key={tech.id || tech.name || tIdx}
                    className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono font-medium border border-border/70 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-foreground dark:text-zinc-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 6. Action Button: Substantial, ergonomic pill with signature emerald hover glow */}
          <div className={`pt-2 flex items-center ${isAr ? 'justify-end' : 'justify-start'}`}>
            <Link
              to={`/projects#${project.slug}`}
              className="group inline-flex items-center gap-3 h-11 px-7 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 dark:text-emerald-400 hover:text-slate-950 dark:hover:text-slate-950 border border-emerald-500/35 hover:border-emerald-500 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
            >
              <span>{isAr ? 'عرض دراسة الحالة' : 'VIEW CASE STUDY'}</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 rtl:rotate-180 text-emerald-500 dark:text-emerald-400 group-hover:text-slate-950 dark:group-hover:text-slate-950"
              />
            </Link>
          </div>
        </div>

        {/* Right Column: Prominent Rounded Media Preview (7 cols of 12, takes more space to the left) */}
        <div className="lg:col-span-7 flex items-stretch">
          <div className="w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-foreground/15 dark:border-white/10 bg-muted/20 shadow-inner group">
            <ProjectMediaVisual project={project} cardIndex={index} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROJECTS SECTION COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const ProjectsSection = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Scroll Track: 250vh provides generous scroll room with dedicated lead-in zone
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeCard, setActiveCard] = useState(0);

  // Scroll progress listener:
  // Flipping starts only when cards are centered in viewport!
  // Card 0 remains stationary & centered for initial scroll lead-in (< 0.28).
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Ignore intermediate scroll progress during programmatic click-navigation
      if (isProgrammaticScrollRef.current) return;

      let targetCard = 0;
      if (latest < 0.28) {
        targetCard = 0;
      } else if (latest < 0.65) {
        targetCard = 1;
      } else {
        targetCard = 2;
      }

      setActiveCard((current) => (current !== targetCard ? targetCard : current));
    });
  }, [scrollYProgress]);

  // Cancel programmatic scroll lock if user manually touches or scrolls wheel
  useEffect(() => {
    const handleUserInterrupt = () => {
      isProgrammaticScrollRef.current = false;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Load Settings & Projects directly from Backend API (Dashboard Driven)
  useEffect(() => {
    const fetchSettingsAndProjects = () => {
      api.get('/settings').then((res) => setSettings(res.data?.data)).catch(() => {});
      api
        .get('/projects?public=true')
        .then((res) => setProjects(res.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchSettingsAndProjects();

    const handleUpdate = () => fetchSettingsAndProjects();
    window.addEventListener('portfolio_settings_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_settings_updated', handleUpdate);
  }, []);

  // Assemble exactly 3 projects for the stacked deck:
  const deckProjects: Project[] = useMemo(() => {
    const featuredList = projects.filter((p: any) => p.isFeatured);
    const nonFeaturedList = projects.filter((p: any) => !p.isFeatured);
    const combined = [...featuredList, ...nonFeaturedList];

    if (combined.length >= 3) {
      return combined.slice(0, 3);
    }
    const needed = 3 - combined.length;
    const fillers = FALLBACK_PROJECTS.slice(0, needed);
    return [...combined, ...fillers];
  }, [projects]);

  // Card selector with glitch-free smooth scrolling lock
  const handleSelectCard = (index: number) => {
    if (index === activeCard) return;

    // Immediately trigger framer-motion spring to selected card
    setActiveCard(index);

    // Lock scroll listener updates during the smooth scroll animation
    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const targetRatio = index === 0 ? 0.10 : index === 1 ? 0.46 : 0.82;
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      const targetScroll = scrollTop + targetRatio * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    // Release lock once programmatic smooth scroll is complete
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 850);
  };

  const resolveField = (key: string, arVal?: string, enVal?: string, fallback?: string) => {
    if (isAr) {
      return t(key, arVal || fallback);
    }
    return t(key, enVal || fallback);
  };

  // Section Heading & Subtitle Overrides from Dashboard
  const displayBadge = resolveField('projects.badge', settings?.projectsBadgeAr, settings?.projectsBadge, 'Featured Case Studies');
  const displayTitle = resolveField('projects.title', settings?.projectsTitleAr, settings?.projectsTitle, 'Selected Work.');
  const displaySubtitle = resolveField(
    'projects.subtitle',
    settings?.projectsSubtitleAr,
    settings?.projectsSubtitle,
    'A curated selection of production web applications, custom CRM platforms, and full-stack software architectures built for performance and measurable business impact.'
  );

  const totalCount = Math.max(projects.length, 3);

  return (
    <section id="projects" className="scroll-mt-20 relative bg-transparent">
      {/* ── 1. Section Header: Slim, Elegant & Compact ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-border/60 bg-card/40 dark:bg-white/[0.04] backdrop-blur-md mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            {displayBadge}
          </span>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-foreground mb-1.5">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── 2. Sticky Scroll Track: Taller cards centered vertically in viewport ── */}
      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-visible">
          
          <div className="relative w-full max-w-[900px] lg:max-w-[980px] xl:max-w-[1020px] mx-auto flex flex-col items-center">
            
            {/* Vertical Scroll Indicator floating on the side */}
            <div
              className={`hidden md:flex flex-col items-center gap-2.5 absolute ${
                isAr ? '-left-12 lg:-left-16' : '-right-12 lg:-right-16'
              } top-1/2 -translate-y-1/2 select-none pointer-events-none z-40`}
            >
              <div className="w-5 h-9 rounded-full border border-emerald-500/40 dark:border-emerald-400/30 flex justify-center pt-1.5 bg-card/40 dark:bg-black/40 backdrop-blur-xs shadow-xs">
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
              </div>
              <span className="text-[9px] font-mono font-semibold tracking-[0.25em] uppercase text-muted-foreground/60 [writing-mode:vertical-lr] rotate-180">
                {isAr ? 'تمرير' : 'SCROLL'}
              </span>
              <ChevronDown size={14} className="text-emerald-500/70 animate-bounce -mt-1" />
            </div>

            {/* 3D Stack of Cards: Taller & more spacious layout */}
            <div className="relative w-full pt-20 pb-2">
              <div className="relative w-full min-h-[410px] sm:min-h-[435px] lg:min-h-[460px]">
                {loading ? (
                  <div className="w-full h-[450px] rounded-[32px] bg-card/40 dark:bg-white/[0.02] border border-border/50 animate-pulse flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
                  </div>
                ) : (
                  deckProjects.map((project, i) => (
                    <StackedCard
                      key={project.id}
                      project={project}
                      index={i}
                      activeCard={activeCard}
                      isAr={isAr}
                      onSelect={() => handleSelectCard(i)}
                    />
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── 3. Bottom Section: ONLY the Explore All Projects Button (Brought closer) ── */}
      <div className="pt-4 sm:pt-6 pb-12 sm:pb-16 flex justify-center px-4">
        <Link
          to="/projects"
          className="group relative inline-flex items-center gap-3 h-12 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-md hover:shadow-xl hover:shadow-emerald-500/30 cursor-pointer overflow-hidden"
        >
          <span className="relative z-10">{isAr ? `استكشاف جميع المشاريع (${totalCount})` : `EXPLORE ALL PROJECTS (${totalCount})`}</span>
          <ArrowUpRight
            size={16}
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg] text-slate-950"
          />
        </Link>
      </div>
    </section>
  );
};

export default ProjectsSection;

