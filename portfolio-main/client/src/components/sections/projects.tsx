import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

/* ─── Types ──────────────────────────────────────────────────────── */
interface ProjectImage {
  id?: string;
  url: string;
  isCover: boolean;
}

interface Technology {
  id: string;
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
  challenge?: string | null;
  challengeAr?: string | null;
  solution?: string | null;
  solutionAr?: string | null;
  features?: string | null;
  featuresAr?: string | null;
  results?: string | null;
  resultsAr?: string | null;
  year?: string | null;
  category?: string | null;
  categoryAr?: string | null;
  liveDemo?: string | null;
  github?: string | null;
  images: ProjectImage[];
  technologies: Technology[];
}

/* ─── Premium Featured Project Card ───────────────────────────────── */
const FeaturedProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  // Prepare images (ensure at least 2-3 previews if images exist)
  const rawImages = project.images?.map((img) => img.url) || [];
  let displayImages = rawImages.length > 0 ? rawImages : [];
  if (displayImages.length === 1) {
    displayImages = [
      displayImages[0],
      displayImages[0],
    ];
  }

  const currentImage = displayImages[activeImgIdx] || null;

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages.length <= 1) return;
    setActiveImgIdx((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayImages.length <= 1) return;
    setActiveImgIdx((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl border border-border/60 bg-card/40 dark:bg-white/[0.025] backdrop-blur-xl hover:border-emerald-500/40 shadow-xl transition-all duration-500 overflow-hidden"
    >
      {/* Top Window / Header Bar */}
      <div className="px-6 py-3.5 border-b border-border/50 bg-card/30 dark:bg-black/20 backdrop-blur-md flex items-center justify-between">
        {/* macOS Window Controls */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="text-[11px] font-mono text-muted-foreground/70 ml-2 hidden sm:inline">
            project-{String(index + 1).padStart(2, '0')}.app
          </span>
        </div>

        {/* Live Status & Category Pill */}
        <div className="flex items-center gap-3">
          {project.liveDemo && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </div>
          )}
          {project.category && (
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              {isAr ? (project.categoryAr || project.category) : project.category}
            </span>
          )}
        </div>
      </div>

      {/* Main Card Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 md:p-10 items-center">
        
        {/* ── IMAGE SHOWCASE SIDE ── */}
        <div
          className={`lg:col-span-7 relative ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-border/60 bg-muted/40 shadow-inner group/img">
            {currentImage ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage + activeImgIdx}
                  src={currentImage}
                  alt={isAr ? (project.titleAr || project.title) : project.title}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
                  loading="lazy"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-card/60">
                <span className="text-7xl font-bold text-muted-foreground/20 font-mono">
                  {(isAr ? (project.titleAr || project.title) : project.title)[0]}
                </span>
              </div>
            )}

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Interactive Image Arrows (if multiple images available) */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous screenshot"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <ChevronLeft size={16} className="rtl:rotate-180" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next screenshot"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <ChevronRight size={16} className="rtl:rotate-180" />
                </button>
                {displayImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImgIdx === i
                        ? 'w-6 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── PROJECT DETAILS SIDE ── */}
        <div
          className={`lg:col-span-5 flex flex-col justify-between h-full ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div>
            {/* Year & Index Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-500 font-semibold tracking-wider">
                {project.year || '2025'} — {isAr ? t('projects.production', 'إنتاج حقيقي') : 'PRODUCTION'}
              </span>
              <span className="text-4xl font-extrabold text-foreground/10 font-mono select-none">
                0{index + 1}
              </span>
            </div>

            {/* Title */}
            <Link to={`/projects#${project.slug}`}>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground hover:text-emerald-400 transition-colors duration-200 leading-[1.15] mb-4">
                {isAr ? (project.titleAr || project.title) : project.title}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
              {isAr ? (project.descriptionAr || project.description) : project.description}
            </p>

            {/* Technologies Chips */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech.id || tech.name}
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium border border-border/70 bg-card/60 dark:bg-white/[0.04] backdrop-blur-md text-foreground/80 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                  >
                    {tech.name}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono text-muted-foreground">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/projects#${project.slug}`}
              className="h-10 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer"
            >
              <span>{isAr ? t('projects.viewCaseStudy', 'عرض دراسة الحالة') : 'View Case Study'}</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>

            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-5 rounded-full border border-border/70 bg-card/60 hover:bg-card/90 hover:border-emerald-500/50 hover:text-emerald-400 dark:bg-white/[0.04] backdrop-blur-md text-foreground text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer"
              >
                <span>{isAr ? t('projects.liveDemo', 'معاينة حية') : 'Live Demo'}</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Subtle bottom accent line on hover */}
      <div className={`h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent transition-all duration-500 ${isHovered ? 'via-emerald-500/60' : ''}`} />
    </motion.div>
  );
};

/* ─── Skeleton Loader ────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="space-y-8">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-[420px] rounded-3xl bg-card/40 dark:bg-white/[0.02] border border-border/50 animate-pulse"
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROJECTS SECTION
   ═══════════════════════════════════════════════════════════════════ */
const ProjectsSection = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data?.data)).catch(() => {});
    api
      .get('/projects?public=true')
      .then((res) => setProjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Prioritize featured projects first
  const featured = (() => {
    const isFeaturedList = projects.filter((p: any) => p.isFeatured);
    const nonFeaturedList = projects.filter((p: any) => !p.isFeatured);
    return [...isFeaturedList, ...nonFeaturedList].slice(0, 2);
  })();

  const displayBadge = isAr 
    ? (settings?.projectsBadgeAr || t('projects.badge', 'أعمال مختارة ودراسات حالة')) 
    : (settings?.projectsBadge || 'Featured Case Studies');
  const displayTitle = isAr 
    ? (settings?.projectsTitleAr || t('projects.title', 'المشاريع المميزة.')) 
    : (settings?.projectsTitle || 'Selected Work.');
  const displaySubtitle = isAr 
    ? (settings?.projectsSubtitleAr || t('projects.subtitle', 'مجموعة مختارة من حلول الويب، ومنصات الـ SaaS، والأنظمة المؤسسية المصممة بعناية.')) 
    : (settings?.projectsSubtitle || 'A curated selection of production web applications, custom CRM platforms, and full-stack software architectures built for performance and measurable business impact.');

  return (
    <section id="projects" className="scroll-mt-24 py-28 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                {displayBadge}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-xl">
                {displaySubtitle}
              </p>
            )}
          </div>

          <Link
            to="/projects"
            className="shrink-0 inline-flex items-center gap-2 text-xs md:text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-emerald-400 transition-colors group cursor-pointer"
          >
            <span>{t('projects.viewAll', 'View all projects')} ({projects.length})</span>
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </motion.div>

        {/* Projects Cards Showcase */}
        {loading ? (
          <Skeleton />
        ) : featured.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border/60 rounded-3xl bg-card/30 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-xl font-bold tracking-tight mb-2">{isAr ? 'قريباً: مشاريع وأعمال جديدة.' : 'Projects coming soon.'}</p>
            <p className="text-sm text-muted-foreground">{isAr ? 'يرجى العودة لاحقاً للاطلاع على أحدث دراسات الحالة.' : 'Check back later for new case studies.'}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {featured.map((project, i) => (
              <FeaturedProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA to View All */}
        {!loading && projects.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center pt-6"
          >
            <Link
              to="/projects"
              className="group h-11 px-7 rounded-full border border-border/80 hover:border-emerald-500/50 bg-card/50 hover:bg-card/80 dark:bg-white/[0.04] backdrop-blur-md text-foreground font-semibold text-xs md:text-sm uppercase tracking-wider inline-flex items-center gap-2.5 transition-colors duration-200 hover:shadow-md hover:shadow-emerald-500/10 cursor-pointer"
            >
              <span>{isAr ? `استكشف جميع المشاريع (${projects.length})` : `Explore all ${projects.length} case studies`}</span>
              <ArrowUpRight size={14} className="rtl:rotate-[-90deg] text-emerald-500" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
