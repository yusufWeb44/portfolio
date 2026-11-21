import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  Maximize2,
  X
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getMediaUrl } from '../utils/mediaUrl';
import { buttonVariants, cn } from '../components/ui/Button';

/* ─── Interfaces ─────────────────────────────────────────────────── */
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

/* ─── Single Project Showcase Item (Stacked Under Each Other) ────── */
const ProjectShowcaseItem = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const displayTitle = isAr ? project.titleAr || project.title : project.title;
  const displayCategory = isAr ? project.categoryAr || project.category : project.category;
  const displayDescription = isAr ? project.descriptionAr || project.description : project.description;
  const displayRole = isAr ? project.roleAr || project.role : project.role;
  const formattedNumber = String(index + 1).padStart(2, '0');

  // Load real uploaded images with full media URL resolution
  const rawImages = project.images && project.images.length > 0
    ? project.images.map((img) => getMediaUrl(img.url))
    : [];

  const displayImages: string[] = rawImages.length > 0
    ? rawImages
    : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'];

  // Keep active index within bounds if images change
  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation & body scroll-lock for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, displayImages.length]);

  return (
    <article
      id={project.slug}
      className="scroll-mt-28 relative rounded-2xl sm:rounded-3xl border border-zinc-200/90 dark:border-white/[0.08] bg-white/95 dark:bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-7 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/[0.18]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ════ LEFT COLUMN: PROJECT DETAILS & INFORMATION ════ */}
        <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1 space-y-4 sm:space-y-5">
          
          <div>
            {/* 1. Number + Category & Year Strip (Matches projects.tsx deck card) */}
            <div className="flex items-baseline gap-2.5 sm:gap-3 mb-1 sm:mb-1.5">
              <span className="text-xl sm:text-2xl lg:text-[2rem] font-black font-sans tracking-tight text-foreground dark:text-white leading-none select-none">
                {formattedNumber}
              </span>
              {(displayCategory || project.year) && (
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80 dark:text-zinc-400">
                  {displayCategory ? displayCategory : ''}
                  {project.year ? ` • ${project.year}` : ''}
                </span>
              )}
            </div>

            {/* 2. Project Title */}
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold tracking-tight text-foreground dark:text-white mb-3 leading-snug">
              {displayTitle}
            </h2>

            {/* 3. Project Overview / Details */}
            <div className="space-y-1.5 mb-4">
              <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-foreground dark:text-zinc-100">
                {t('projects.projectDetails', isAr ? 'نظرة عامة على المشروع' : 'Project Overview')}
              </h3>
              <p className="text-xs sm:text-[13.5px] lg:text-sm text-muted-foreground dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {displayDescription}
              </p>
            </div>

            {/* 4. Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-2 mb-4 pt-3 border-t border-border/50 dark:border-white/[0.06]">
                <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-foreground dark:text-zinc-100">
                  {t('projects.technologies', isAr ? 'التقنيات المستخدمة' : 'Technologies Used')}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id || tech.name}
                      className="px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-mono font-medium border border-border/80 bg-card/60 dark:bg-white/[0.04] text-foreground/90 hover:border-zinc-300 dark:hover:border-white/[0.18] hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Role in Project (Only at the bottom) */}
            {displayRole && (
              <div className="space-y-1.5 pt-3 border-t border-border/50 dark:border-white/[0.06]">
                <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-foreground dark:text-zinc-100">
                  <span>{isAr ? 'الدور والمسؤوليات' : t('projects.role', 'Role & Responsibilities')}</span>
                </h3>
                <p className="text-xs sm:text-[13.5px] font-medium text-foreground dark:text-zinc-200 leading-relaxed">
                  {displayRole}
                </p>
              </div>
            )}
          </div>

          {/* 6. Action CTA Buttons */}
          {(project.liveDemo || project.github) && (
            <div className="pt-2 sm:pt-3">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: 'primary', size: 'default' }),
                      "flex-1 sm:flex-initial h-11 sm:h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-[13px] tracking-wide"
                    )}
                  >
                    <span>{isAr ? 'معاينة حية' : t('projects.liveDemo', 'Live Demo')}</span>
                    <ExternalLink size={15} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'default' }),
                      "flex-1 sm:flex-initial h-11 sm:h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-[13px] tracking-wide"
                    )}
                  >
                    <Code2 size={15} strokeWidth={1.75} className="transition-transform duration-200 group-hover:scale-110" />
                    <span>{isAr ? 'الكود المصدري' : t('projects.sourceCode', 'Source Code')}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ════ RIGHT COLUMN: INTERACTIVE MEDIA SHOWCASE WITH SLIDER ════ */}
        <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2">
          
          {/* Main Featured Image Container (100% Uncropped Display via object-contain) */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                touchStartXRef.current = e.touches[0].clientX;
              }
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current === null || displayImages.length <= 1) return;
              const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (Math.abs(deltaX) > 40) {
                if (deltaX < 0) {
                  handleNextImage();
                } else {
                  handlePrevImage();
                }
              }
            }}
            className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-slate-900/[0.03] dark:bg-black/60 backdrop-blur-xl shadow-md group flex items-center justify-center p-1.5 sm:p-2.5 cursor-zoom-in touch-pan-y"
          >
            {/* Ambient Blurred Backdrop using the image itself for premium edge-to-edge aesthetic */}
            <div
              className="absolute inset-0 bg-center bg-cover blur-2xl opacity-15 dark:opacity-25 pointer-events-none scale-110"
              style={{ backgroundImage: `url(${currentImage})` }}
            />

            {/* Active Image (uncropped, complete uploaded layout) */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={`${project.title} preview ${activeImageIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full h-full object-contain select-none relative z-10 rounded-lg drop-shadow-sm"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Fullscreen Expand Button on Hover (and visible on touch devices) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="View Fullscreen"
              className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer shadow-md"
            >
              <Maximize2 size={14} strokeWidth={1.5} />
            </button>

            {/* Image Counter Badge (Only if multiple images) */}
            {displayImages.length > 1 && (
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] sm:text-[10.5px] font-bold tracking-widest select-none pointer-events-none">
                {String(activeImageIndex + 1).padStart(2, '0')} / {String(displayImages.length).padStart(2, '0')}
              </div>
            )}

            {/* Left Navigation Arrow (Only if multiple images) */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous Image"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
              >
                <ChevronLeft size={16} strokeWidth={1.5} className="rtl:rotate-180" />
              </button>
            )}

            {/* Right Navigation Arrow (Only if multiple images) */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next Image"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
              >
                <ChevronRight size={16} strokeWidth={1.5} className="rtl:rotate-180" />
              </button>
            )}
          </div>

          {/* Mini Thumbnails Row Below Main Image (Only if multiple images) */}
          {displayImages.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5">
              {displayImages.map((imgUrl, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    type="button"
                    key={`${imgUrl}-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative flex-1 min-w-[55px] max-w-[120px] aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer bg-slate-900/[0.04] dark:bg-black/50 p-0.5 ${
                      isActive
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-[1.02] shadow-sm'
                        : 'border-border/60 hover:border-foreground/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-md"
              aria-label="Close Preview"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Previous Button in Modal */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-md shadow-2xl"
                aria-label="Previous Image"
              >
                <ChevronLeft size={22} strokeWidth={1.5} className="rtl:rotate-180" />
              </button>
            )}

            {/* Next Button in Modal */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-md shadow-2xl"
                aria-label="Next Image"
              >
                <ChevronRight size={22} strokeWidth={1.5} className="rtl:rotate-180" />
              </button>
            )}

            {/* Full Image Container (100% uncropped display) */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[95vw] max-h-[88vh] flex items-center justify-center"
            >
              <img
                src={currentImage}
                alt={`${project.title} preview`}
                className="max-w-[95vw] max-h-[86vh] object-contain rounded-lg shadow-[0_25px_80px_rgba(0,0,0,0.9)] border border-white/15"
              />
              {displayImages.length > 1 && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-white/70 font-mono text-xs tracking-widest uppercase">
                  {activeImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </article>
  );
};

/* ─── Skeleton Loader ────────────────────────────────────────────── */
const SkeletonProjects = () => (
  <div className="space-y-8 sm:space-y-12 animate-pulse">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-[440px] rounded-2xl sm:rounded-3xl bg-card/40 dark:bg-white/[0.02] border border-border/50"
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROJECTS PAGE (ALL PROJECTS STACKED VERTICALLY)
   ═══════════════════════════════════════════════════════════════════ */
const Projects = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api
      .get('/projects?public=true')
      .then((res) => {
        setProjects(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    api
      .get('/settings')
      .then((res) => {
        if (res.data?.data) {
          setSettings(res.data.data);
          try {
            localStorage.setItem('portfolio_settings', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Handle hash scrolling if url contains #slug
  useEffect(() => {
    if (!loading && location.hash) {
      const targetId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [loading, location.hash]);

  const pageTitle = isAr
    ? (settings?.projectsTitleAr || t('projects.title', 'المشاريع المنفذة'))
    : (settings?.projectsTitle || t('projects.title', 'Featured Projects'));

  const pageSubtitle = isAr
    ? (settings?.projectsSubtitleAr || t('projects.subtitle', 'مجموعة مختارة من التطبيقات ومنصات SaaS والأنظمة الرقمية المطورة وفق أعلى معايير الجودة والأداء.'))
    : (settings?.projectsSubtitle || t('projects.subtitle', 'A curated selection of production web applications, custom CRM platforms, and full-stack software architectures built for performance and measurable business impact.'));

  return (
    <div className="w-full bg-transparent min-h-screen">
      <Helmet>
        <title>{pageTitle} | {settings?.name || 'Portfolio'}</title>
        <meta name="description" content={pageSubtitle} />
      </Helmet>

      {/* Hero Header */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Back to Portfolio Button */}
            <div className="mb-5 sm:mb-6">
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                  "font-mono uppercase tracking-wider gap-2 px-3.5 py-2 text-xs sm:text-[13px] rounded-xl"
                )}
              >
                <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 rtl:rotate-180 text-muted-foreground group-hover:text-foreground" />
                <span>{isAr ? 'العودة للرئيسية' : 'Back to Portfolio'}</span>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 border-b border-border/40 pb-6 sm:pb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-2">
                  {pageTitle}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {pageSubtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Showcase Stack (Rendered Under Each Other) */}
      <section className="pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <SkeletonProjects />
          ) : projects.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border/70 rounded-2xl sm:rounded-3xl bg-card/30 backdrop-blur-md">
              <p className="text-xl font-bold tracking-tight mb-2">{t('projects.noProjects', 'No projects published yet.')}</p>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-10 md:space-y-12">
              {projects.map((project, index) => (
                <ProjectShowcaseItem
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;