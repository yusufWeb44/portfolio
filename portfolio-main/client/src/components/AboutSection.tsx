import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, TrendingUp, Zap, Cpu, Code2, ShieldCheck, Database, Server, Globe, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

/* ─── Animation Variants ─────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

/* ─── Icon Map ───────────────────────────────────────────────────── */
const getCardIcon = (iconName: string) => {
  const iconProps = { className: 'w-5 h-5', 'aria-hidden': true };
  const lower = (iconName || '').toLowerCase();
  if (lower.includes('layer') || lower.includes('طبقات')) return <Layers {...iconProps} />;
  if (lower.includes('trend') || lower.includes('grow') || lower.includes('نمو') || lower.includes('تطور')) return <TrendingUp {...iconProps} />;
  if (lower.includes('zap') || lower.includes('speed') || lower.includes('perf') || lower.includes('سرعة') || lower.includes('أداء')) return <Zap {...iconProps} />;
  if (lower.includes('cpu') || lower.includes('معالج') || lower.includes('ذكاء')) return <Cpu {...iconProps} />;
  if (lower.includes('code') || lower.includes('dev') || lower.includes('برمجة') || lower.includes('كود')) return <Code2 {...iconProps} />;
  if (lower.includes('shield') || lower.includes('sec') || lower.includes('أمان') || lower.includes('حماية')) return <ShieldCheck {...iconProps} />;
  if (lower.includes('data') || lower.includes('بيانات') || lower.includes('قواعد')) return <Database {...iconProps} />;
  if (lower.includes('server') || lower.includes('سيرفر') || lower.includes('خادم')) return <Server {...iconProps} />;
  if (lower.includes('sparkle') || lower.includes('star') || lower.includes('تميز')) return <Sparkles {...iconProps} />;
  return <Globe {...iconProps} />;
};

/* ─── Stack Pill ─────────────────────────────────────────────────── */
const StackPill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 leading-none">
    {label}
  </span>
);

/* ─── AboutSection ───────────────────────────────────────────────── */
const AboutSection = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        if (res.data?.success && res.data?.data) {
          setAboutData(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load about data', err);
      }
    };
    fetchAbout();
  }, []);

  const displayBadge = isAr 
    ? (aboutData?.badgeAr || t('about.badge', 'نبذة عني')) 
    : (aboutData?.badge || 'About Me');

  const displayHeadline = isAr 
    ? (aboutData?.headlineAr || t('about.headline', 'بناء برمجيات قابلة للتوسع بدقة واحترافية.')) 
    : (aboutData?.headline || 'Crafting Scalable Software with Purpose & Precision.');

  const displayBio1 = isAr 
    ? (aboutData?.bioParagraph1Ar || aboutData?.bioParagraph1 || '') 
    : (aboutData?.bioParagraph1 || '');

  const displayBio2 = isAr 
    ? (aboutData?.bioParagraph2Ar || aboutData?.bioParagraph2 || '') 
    : (aboutData?.bioParagraph2 || '');

  const displayCoreStackTitle = isAr ? t('about.coreStack', 'التقنيات الأساسية') : 'Core Stack';

  const coreStack: string[] = (() => {
    const raw = isAr && aboutData?.coreStackAr ? aboutData.coreStackAr : aboutData?.coreStack;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
  })();

  const displayCards: any[] = (() => {
    const raw = isAr && aboutData?.bentoCardsAr ? aboutData.bentoCardsAr : aboutData?.bentoCards;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
  })();

  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 md:py-24 px-6 bg-transparent overflow-hidden"
      aria-label="About me"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── 12-Column Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Left Column: 5 cols — Badge, Title, Bio, Stack ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-7"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Top Badge */}
            <motion.div variants={fadeUpVariants}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/60 bg-card/40 dark:bg-white/[0.04] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                  {displayBadge}
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div variants={fadeUpVariants}>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
                {displayHeadline}
              </h2>
            </motion.div>

            {/* Bio Text */}
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {displayBio1}
              </p>
              {displayBio2 && (
                <p className="text-base text-muted-foreground leading-relaxed">
                  {displayBio2}
                </p>
              )}
            </motion.div>

            {/* Tech Stack Chips */}
            <motion.div variants={fadeUpVariants}>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">
                {displayCoreStackTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {coreStack.map((tech) => (
                  <StackPill key={tech} label={tech} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: 7 cols — Bento Cards (aligned with bio text) ── */}
          <motion.div
            className="lg:col-span-7 lg:pt-[70px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayCards.map((card, i) => (
                <motion.div
                  key={card.id || i}
                  variants={cardVariants}
                  className={[
                    card.colSpan || (i === 2 && displayCards.length === 3 ? 'sm:col-span-2' : ''),
                    'group relative flex flex-col gap-5 rounded-2xl p-6 md:p-7',
                    'bg-card/40 dark:bg-white/[0.03] border border-border/60 backdrop-blur-xl',
                    'hover:border-emerald-500/40 hover:-translate-y-1.5',
                    'hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]',
                    'transition-all duration-300 ease-out cursor-default',
                    'overflow-hidden',
                  ].join(' ')}
                >
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/[0.03] group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold shrink-0">
                        {card.id || String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight group-hover:text-emerald-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                    </div>
                    <span className="text-muted-foreground/40 group-hover:text-emerald-500/60 transition-colors duration-300 shrink-0 mt-0.5">
                      {getCardIcon(card.icon)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-10">
                    {card.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/30 transition-all duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

