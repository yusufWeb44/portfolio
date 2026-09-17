import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Layers,
  Code2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

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

  // Ensure at least 3-4 images for the interactive slider
  const rawImages = project.images && project.images.length > 0 ? project.images.map((i) => i.url) : [];
  let displayImages: string[] = [...rawImages];

  if (displayImages.length === 0) {
    displayImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ];
  } else if (displayImages.length === 1) {
    displayImages = [
      displayImages[0],
      displayImages[0],
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ];
  } else if (displayImages.length === 2) {
    displayImages = [
      displayImages[0],
      displayImages[1],
      displayImages[0],
      displayImages[1],
    ];
  } else if (displayImages.length === 3) {
    displayImages = [...displayImages, displayImages[0]];
  }

  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <article
      id={project.slug}
      className="scroll-mt-28 relative rounded-3xl border border-border/70 bg-card/40 dark:bg-white/[0.025] backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-emerald-500/40"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* ════ LEFT COLUMN: PROJECT DETAILS & INFORMATION ════ */}
        <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
          
          {/* Category Tag & Index Number */}
          <div className="flex items-center justify-between gap-3">
            {(project.category || (isAr && project.categoryAr)) ? (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-border/80 bg-card/60 dark:bg-white/[0.04] backdrop-blur-md text-foreground">
                {isAr ? (project.categoryAr || project.category) : project.category}
              </span>
            ) : (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-border/80 bg-card/60 dark:bg-white/[0.04] backdrop-blur-md text-muted-foreground">
                {isAr ? 'دراسة حالة' : 'Case Study'}
              </span>
            )}

            <span className="text-3xl font-mono font-extrabold text-foreground/15 select-none">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Project Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-foreground leading-[1.1]">
            {isAr ? (project.titleAr || project.title) : project.title}
          </h2>

          {/* Meta Row: Year, Role, Status */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground py-1">
            {project.year && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-500" />
                <span>{project.year}</span>
              </div>
            )}
            {(project.role || (isAr && project.roleAr)) && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Layers size={14} className="text-emerald-500" />
                  <span>{isAr ? (project.roleAr || project.role) : project.role}</span>
                </div>
              </>
            )}
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('projects.production', 'PRODUCTION')}</span>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-500" />
              {t('projects.projectDetails', 'Project Details')}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {isAr ? (project.descriptionAr || project.description) : project.description}
            </p>
          </div>

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {t('projects.technologies', 'Technologies Used')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id || tech.name}
                    className="px-3 py-1.5 rounded-full text-xs font-mono font-medium border border-border/70 bg-card/40 dark:bg-white/[0.03] backdrop-blur-md text-foreground/90 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role in Project (Dynamic from Dashboard) */}
          {(project.role || (isAr && project.roleAr)) && (
            <div className="pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500" />
                {isAr ? 'الدور والمسؤوليات في المشروع' : t('projects.role', 'Role')}
              </h3>
              <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                {isAr ? (project.roleAr || project.role) : project.role}
              </p>
            </div>
          )}

          {/* CTA Buttons: Visit Site & View Source (NO Request Similar Project) */}
          {(project.liveDemo || project.github) && (
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="group h-10 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer"
                >
                  <span>{t('projects.liveDemo', 'Live Demo')}</span>
                  <ExternalLink size={14} />
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group h-10 px-5 rounded-full bg-card/60 dark:bg-white/[0.04] hover:bg-card/90 border border-border/70 hover:border-emerald-500/50 hover:text-emerald-400 backdrop-blur-md text-foreground font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                >
                  <Code2 size={14} />
                  <span>{t('projects.sourceCode', 'Source Code')}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ════ RIGHT COLUMN: INTERACTIVE MEDIA SHOWCASE WITH SLIDER ════ */}
        <div className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
          
          {/* Main Featured Image Container */}
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/70 bg-card/30 dark:bg-white/[0.02] backdrop-blur-xl shadow-xl group">
            {/* Active Image with smooth cross-fade animation */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={`${project.title} preview ${activeImageIndex + 1}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full h-full object-cover select-none"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Image Counter Badge */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold tracking-widest select-none">
              {String(activeImageIndex + 1).padStart(2, '0')} / {String(displayImages.length).padStart(2, '0')}
            </div>

            {/* Left Navigation Arrow */}
            <button
              onClick={handlePrevImage}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200 active:scale-95 cursor-pointer shadow-md"
            >
              <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={handleNextImage}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center transition-colors duration-200 active:scale-95 cursor-pointer shadow-md"
            >
              <ChevronRight size={16} className="rtl:rotate-180" />
            </button>
          </div>

          {/* 4 Mini Thumbnails Row Below Main Image */}
          <div className="grid grid-cols-4 gap-3 pt-1">
            {displayImages.map((imgUrl, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <button
                  key={`${imgUrl}-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-[1.03] shadow-md shadow-emerald-500/10'
                      : 'border-border/60 hover:border-foreground/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </article>
  );
};

/* ─── Skeleton Loader ────────────────────────────────────────────── */
const SkeletonProjects = () => (
  <div className="space-y-16 animate-pulse">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-[520px] rounded-3xl bg-card/40 dark:bg-white/[0.02] border border-border/50"
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN PROJECTS PAGE (ALL PROJECTS STACKED VERTICALLY)
   ═══════════════════════════════════════════════════════════════════ */
const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
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

  return (
    <div className="w-full bg-transparent min-h-screen">
      <Helmet>
        <title>{t('projects.title', 'Projects & Case Studies')} | Yusuf</title>
        <meta name="description" content="All architectural case studies and full-stack projects by Yusuf." />
      </Helmet>

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Back to Portfolio Button */}
            <div className="mb-6">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 h-9 px-4 rounded-full bg-card/70 dark:bg-white/[0.04] border border-border/80 hover:border-emerald-500/50 hover:text-emerald-400 backdrop-blur-md text-foreground text-xs font-mono font-semibold uppercase tracking-wider transition-colors duration-200 shadow-sm cursor-pointer"
              >
                <ArrowLeft size={13} className="text-emerald-500 rtl:rotate-180" />
                <span>{t('projects.backToProjects', 'Back to Portfolio')}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
                {t('projects.badge', 'All Case Studies')}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.05]">
                {t('projects.title', 'Selected Work.')}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-sm leading-relaxed md:text-right">
                {projects.length > 0
                  ? `${projects.length} ${t('projects.production', 'Projects')}`
                  : t('projects.subtitle', 'Digital products, enterprise architectures & web applications.')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Showcase Stack (Rendered Under Each Other) */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <SkeletonProjects />
          ) : projects.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border/70 rounded-3xl bg-card/30 backdrop-blur-md">
              <p className="text-2xl font-bold tracking-tight mb-2">{t('projects.noProjects', 'No projects published yet.')}</p>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24">
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
