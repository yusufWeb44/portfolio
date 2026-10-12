import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMediaUrl } from '../../utils/mediaUrl';
import SectionBadge from '../ui/SectionBadge';

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

/* ─── Fallback Projects (Guarantees complete deck matching reference) ─── */
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

/* ─── Project Media Visual ─────────────────────────────────────────── */
const ProjectMediaVisual = ({
  project,
  cardIndex,
  imageScale,
}: {
  project: Project;
  cardIndex: number;
  imageScale?: MotionValue<number>;
}) => {
  const coverImage =
    project.images?.find((img) => img.isCover)?.url ||
    project.images?.[0]?.url;

  if (coverImage) {
    return (
      <div className="w-full h-full relative overflow-hidden group">
        <motion.img
          src={getMediaUrl(coverImage)}
          alt={project.title}
          width={700}
          height={450}
          style={imageScale ? { scale: imageScale } : undefined}
          className="w-full h-full object-cover select-none"
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
      <motion.div
        style={imageScale ? { scale: imageScale } : undefined}
        className="relative z-10 flex items-center gap-3.5 sm:gap-4 drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-[8px] bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md" />
      </motion.div>

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
  i: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  isAr: boolean;
}

const StackedCard = ({
  project,
  i,
  progress,
  range,
  targetScale,
  isAr,
}: StackedCardProps) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardContainerRef,
    offset: ['start end', 'start start'],
  });

  // Parallax scale on media preview while scrolling into view
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);

  // Dynamic gradual scale-down on scroll as subsequent cards stack over this card
  const scale = useTransform(progress, range, [1, targetScale]);

  // Dynamic Content Overrides
  const displayTitle = isAr ? project.titleAr || project.title : project.title;
  const displayCategory = isAr ? project.categoryAr || project.category : project.category;
  const displayDescription = isAr ? project.descriptionAr || project.description : project.description;
  const formattedNumber = String(i + 1).padStart(2, '0');

  return (
    <div
      ref={cardContainerRef}
      className="h-screen flex items-center justify-center sticky top-0 px-4 sm:px-6 pointer-events-none"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-2vh + ${i * 28}px)`,
          transformOrigin: 'top center',
        }}
        className="w-full max-w-[920px] lg:max-w-[1020px] rounded-[28px] sm:rounded-[34px] border border-slate-200/90 dark:border-emerald-500/25 bg-white dark:bg-[#0c1017] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),0_0_30px_-10px_rgba(16,185,129,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_-10px_rgba(16,185,129,0.16)] overflow-hidden relative pointer-events-auto"
      >
        {/* Subtle atmospheric brand emerald sheen in corner */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />

        {/* ── Main Card Body Grid: Balanced layout with wider media preview (5:7 ratio) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 p-6 sm:p-7 lg:p-8 items-stretch min-h-[410px] sm:min-h-[435px] lg:min-h-[460px]">
          
          {/* Details Column (5 cols of 12) */}
          <div
            className={`lg:col-span-5 flex flex-col justify-between ${
              isAr ? 'text-right lg:order-2' : 'text-left lg:order-1'
            }`}
          >
            <div>
              {/* 1. Pill Number Badge */}
              <div className={`flex items-center mb-4 sm:mb-5 ${isAr ? 'justify-end' : 'justify-start'}`}>
                <div className="w-12 h-7 sm:w-13 sm:h-7.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-center font-mono text-xs font-semibold text-foreground dark:text-emerald-400">
                  {formattedNumber}
                </div>
              </div>

              {/* 2. Metadata Line: Year • Category */}
              <div className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground dark:text-zinc-400 mb-2">
                {project.year || '2025'}{displayCategory ? ` • ${displayCategory}` : ''}
              </div>

              {/* 3. Project Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-tight text-foreground dark:text-white mb-2.5 leading-snug">
                {displayTitle}
              </h3>

              {/* 4. Project Description */}
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

            {/* 6. Action Button */}
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

          {/* Media Column (7 cols of 12) */}
          <div className={`lg:col-span-7 flex items-stretch ${isAr ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-foreground/15 dark:border-white/10 bg-muted/20 shadow-inner group">
              <ProjectMediaVisual project={project} cardIndex={i} imageScale={imageScale} />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
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

  // Scroll Container for the entire stacking deck
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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

  // Assemble projects for the stacked deck:
  const deckProjects: Project[] = useMemo(() => {
    const featuredList = projects.filter((p: any) => p.isFeatured);
    const nonFeaturedList = projects.filter((p: any) => !p.isFeatured);
    const combined = [...featuredList, ...nonFeaturedList];

    if (combined.length >= 3) {
      return combined.slice(0, Math.min(combined.length, 5));
    }
    const needed = 3 - combined.length;
    const fillers = FALLBACK_PROJECTS.slice(0, needed);
    return [...combined, ...fillers];
  }, [projects]);

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

  const totalCount = Math.max(projects.length, deckProjects.length);

  return (
    <section id="projects" className="scroll-mt-24 relative bg-transparent">
      {/* ── 1. Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-4 sm:pb-6">
        <SectionBadge>
          {displayBadge}
        </SectionBadge>

        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-3">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── 2. Scrollable Stacking Cards Track ── */}
      <div ref={containerRef} className="relative">
        {/* Fixed Sticky Scroll Indicator (Rendered ONLY ONCE for the entire section) */}
        {!loading && (
          <div className="sticky top-0 h-0 w-full pointer-events-none z-30 flex justify-center">
            <div className="relative w-full max-w-[920px] lg:max-w-[1020px] h-screen flex items-center px-4 sm:px-6">
              <div
                className={`hidden xl:flex flex-col items-center gap-2.5 absolute ${
                  isAr ? '-left-14' : '-right-14'
                } top-1/2 -translate-y-1/2 select-none`}
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
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-[920px] h-[450px] rounded-[32px] bg-card/40 dark:bg-white/[0.02] border border-border/50 animate-pulse flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          </div>
        ) : (
          deckProjects.map((project, i) => {
            const targetScale = 1 - (deckProjects.length - i) * 0.05;
            const range: [number, number] = [i * 0.25, 1];
            return (
              <StackedCard
                key={project.id || `p_${i}`}
                project={project}
                i={i}
                total={deckProjects.length}
                progress={scrollYProgress}
                range={range}
                targetScale={targetScale}
                isAr={isAr}
              />
            );
          })
        )}
      </div>

      {/* ── 3. Bottom Section: Explore All Projects Button ── */}
      <div className="pt-6 sm:pt-10 pb-16 sm:pb-24 flex justify-center px-4">
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
