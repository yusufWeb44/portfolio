import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  Code, 
  Terminal, 
  Users, 
  ShieldCheck,
  Sparkles,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface CertificateItem {
  id: string;
  title: string;
  titleAr?: string | null;
  issuer: string;
  issuerAr?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  icon?: string | null;
  skills?: string | null;
  skillsAr?: string | null;
  order?: number;
}

interface CertificatesCarouselProps {
  certificates: CertificateItem[];
}

const getCertIcon = (iconName?: string | null, issuer?: string) => {
  const name = `${iconName || ''} ${issuer || ''}`.toLowerCase();
  if (name.includes('cloud') || name.includes('aws') || name.includes('azure') || name.includes('gcp') || name.includes('سحاب')) {
    return <Cloud size={18} className="text-amber-500" />;
  }
  if (name.includes('code') || name.includes('react') || name.includes('meta') || name.includes('برمج') || name.includes('كود')) {
    return <Code size={18} className="text-blue-500" />;
  }
  if (name.includes('term') || name.includes('type') || name.includes('script') || name.includes('طرفية')) {
    return <Terminal size={18} className="text-emerald-500" />;
  }
  if (name.includes('user') || name.includes('scrum') || name.includes('agile') || name.includes('إدارة') || name.includes('أجايل')) {
    return <Users size={18} className="text-purple-500" />;
  }
  if (name.includes('shield') || name.includes('sec') || name.includes('أمان') || name.includes('حماية')) {
    return <ShieldCheck size={18} className="text-rose-500" />;
  }
  return <Award size={18} className="text-amber-500" />;
};

export const CertificatesCarousel = ({ certificates }: CertificatesCarouselProps) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const currentScroll = Math.abs(scrollLeft);
      const maxScroll = Math.max(0, scrollWidth - clientWidth);

      if (isRtl) {
        setCanScrollLeft(currentScroll < maxScroll - 10);
        setCanScrollRight(currentScroll > 10);
      } else {
        setCanScrollLeft(currentScroll > 10);
        setCanScrollRight(currentScroll < maxScroll - 10);
      }
    }
  };

  const handleContainerScroll = () => {
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      checkScroll();
      rafIdRef.current = null;
    });
  };

  useEffect(() => {
    const mountRaf = requestAnimationFrame(() => checkScroll());
    window.addEventListener('resize', handleContainerScroll, { passive: true });
    return () => {
      cancelAnimationFrame(mountRaf);
      window.removeEventListener('resize', handleContainerScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [certificates, isRtl]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  // Drag-to-scroll support for mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    handleContainerScroll();
  };

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-16 pb-6 max-w-6xl mx-auto">
      {/* Sub-Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-2">
        <div className="text-start">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              {isRtl ? 'التراخيص والشهادات' : 'Licenses & Credentials'}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            {isRtl ? 'الشهادات والاعتمادات' : 'Certifications & Honors'}
            <Sparkles size={20} className="text-amber-500" />
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            {isRtl
              ? 'شهادات معتمدة عالمياً، تراخيص موثقة، ودورات هندسية متخصصة ومحدثة باستمرار.'
              : 'Industry-recognized credentials, verified certifications, and specialized engineering courses.'}
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={isRtl ? "التمرير لليسار" : "Scroll left"}
            className="w-9 h-9 rounded-full border border-border/70 bg-card/60 hover:bg-card/90 hover:border-emerald-500/50 hover:text-emerald-400 dark:bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200 cursor-pointer"
          >
            <ChevronLeft size={16} className="rtl:rotate-180" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={isRtl ? "التمرير لليمين" : "Scroll right"}
            className="w-9 h-9 rounded-full border border-border/70 bg-card/60 hover:bg-card/90 hover:border-emerald-500/50 hover:text-emerald-400 dark:bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200 cursor-pointer"
          >
            <ChevronRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Horizontal Swipeable Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="flex gap-5 overflow-x-auto pb-6 pt-2 px-2 scroll-smooth select-none cursor-grab active:cursor-grabbing no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {certificates.map((cert, idx) => {
          const rawSkills = isRtl && cert.skillsAr ? cert.skillsAr : cert.skills;
          const skillsList = rawSkills
            ? rawSkills.split(',').map(s => s.trim()).filter(Boolean)
            : [];

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              style={{ scrollSnapAlign: 'start' }}
              className="flex-shrink-0 w-[290px] sm:w-[320px] rounded-2xl bg-card/70 dark:bg-white/[0.03] backdrop-blur-xl border border-border/70 hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
            >
              {/* Subtle top glowing bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Header: Icon & Issue Date */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {getCertIcon(cert.icon, cert.issuer)}
                  </div>

                  {cert.issueDate && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-muted/60 text-muted-foreground border border-border/40">
                      {cert.issueDate}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-base text-foreground tracking-tight line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                  {isRtl ? (cert.titleAr || cert.title) : cert.title}
                </h4>

                {/* Issuer */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-medium truncate">{isRtl ? (cert.issuerAr || cert.issuer) : cert.issuer}</span>
                </div>

                {/* Credential ID */}
                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-muted-foreground/70 bg-muted/30 px-2 py-0.5 rounded inline-block mb-3">
                    ID: {cert.credentialId}
                  </div>
                )}

                {/* Skills Pills */}
                {skillsList.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {skillsList.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/80 border border-border/50 text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                    {skillsList.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-muted-foreground/60">
                        +{skillsList.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button: Verify Credential / View PDF or Image */}
              {cert.credentialUrl ? (() => {
                const rawUrl = cert.credentialUrl;
                const isLocal = rawUrl.startsWith('/uploads/');
                const finalUrl = isLocal ? `http://localhost:5000${rawUrl}` : rawUrl;
                const isPdf = rawUrl.toLowerCase().endsWith('.pdf') || rawUrl.toLowerCase().includes('.pdf');
                const isImg = /\.(jpg|jpeg|png|webp|avif)$/i.test(rawUrl);

                return (
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-1.5 w-full h-9 px-4 rounded-lg text-xs font-semibold bg-background hover:bg-emerald-500 hover:text-slate-950 text-foreground border border-border/70 hover:border-emerald-500 transition-colors duration-200 cursor-pointer group/btn"
                  >
                    {isPdf ? (
                      <>
                        <FileText size={13} className="text-rose-500 group-hover/btn:text-slate-950 transition-colors" />
                        <span>{isRtl ? 'عرض الشهادة (PDF)' : 'View Certificate (PDF)'}</span>
                      </>
                    ) : isImg ? (
                      <>
                        <ImageIcon size={13} className="text-blue-500 group-hover/btn:text-slate-950 transition-colors" />
                        <span>{isRtl ? 'عرض الشهادة (صورة)' : 'View Certificate (Image)'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isRtl ? 'التحقق من الشهادة' : 'Verify Credential'}</span>
                        <ExternalLink size={12} className="rtl:rotate-180" />
                      </>
                    )}
                  </a>
                );
              })() : (
                <div className="mt-2 flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground/50">
                  <span>{isRtl ? 'شهادة معتمدة ومحققة' : 'Verified Credential'}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificatesCarousel;
