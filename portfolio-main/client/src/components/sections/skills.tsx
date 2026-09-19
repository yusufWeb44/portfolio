import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

/* ─── Technology Data Types ───────────────────────────────────────── */
export interface TechItem {
  label: string;
  description: string;
  size: number;
  x: number;
  y: number;
  depth: number;
}

const FALLBACK_POSITIONS: Array<{ x: number; y: number; depth: number }> = [
  { x: 10, y: 10, depth: 1 },
  { x: 55, y: 5, depth: 0.7 },
  { x: 56, y: 56, depth: 1 },
  { x: 4, y: 45, depth: 0.85 },
  { x: 60, y: 78, depth: 1 },
  { x: 28, y: 68, depth: 0.55 },
  { x: 42, y: 38, depth: 0.5 },
  { x: 12, y: 30, depth: 0.9 },
  { x: 35, y: 25, depth: 0.5 },
  { x: 18, y: 85, depth: 0.9 },
  { x: 66, y: 32, depth: 0.5 },
  { x: 30, y: 48, depth: 1 },
  { x: 70, y: 20, depth: 0.95 },
  { x: 72, y: 65, depth: 0.5 },
  { x: 46, y: 85, depth: 0.55 },
  { x: 65, y: 40, depth: 1 },
  { x: 56, y: 70, depth: 0.55 },
  { x: 15, y: 60, depth: 0.5 },
  { x: 35, y: 10, depth: 0.8 },
  { x: 15, y: 40, depth: 0.5 },
  { x: 10, y: 70, depth: 0.5 },
  { x: 45, y: 15, depth: 0.8 },
  { x: 70, y: 10, depth: 0.5 },
  { x: 20, y: 20, depth: 0.4 },
  { x: 40, y: 58, depth: 0.5 },
  { x: 5, y: 78, depth: 0.9 },
];

/* ─── Animation Variants ─────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

/* ─── Scatter Cloud (Desktop) ────────────────────────────────────── */
const ScatterCloud = ({ items }: { items: TechItem[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div ref={ref} className="relative w-full h-[550px] lg:h-[600px] select-none">
      {items.map((tech, i) => {
        const isActive = hovered === i;

        return (
          <div
            key={tech.label + i}
            className="absolute inline-block group"
            style={{
              left: `${tech.x}%`,
              top: `${tech.y}%`,
              zIndex: isActive ? 50 : Math.floor(tech.depth * 10),
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.span
              className="inline-block cursor-default whitespace-nowrap font-extrabold tracking-tight transition-colors duration-150"
              style={{
                fontSize: `${tech.size}px`,
                lineHeight: 1.2,
                color: isActive 
                  ? 'hsl(var(--emerald-500))' 
                  : `hsl(var(--emerald-500) / ${Math.max(0.45, tech.depth)})`,
                textShadow: isActive
                  ? '0 0 16px hsl(var(--emerald-500) / 0.35)'
                  : 'none',
              }}
              initial={{
                x: (50 - tech.x) * 5,
                y: (50 - tech.y) * 4.5,
                opacity: 0,
                scale: 0.3,
              }}
              animate={
                isInView
                  ? { x: 0, y: 0, opacity: 1, scale: 1 }
                  : undefined
              }
              transition={{
                type: 'spring',
                stiffness: 55,
                damping: 13,
                delay: i * 0.035,
                opacity: { duration: 0.5, delay: i * 0.035 },
              }}
              whileHover={{ scale: 1.12 }}
            >
              {tech.label}
            </motion.span>

            {/* Floating Tooltip Window - Centered Above Text */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 8, x: '-50%', scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                  exit={{ opacity: 0, y: 4, x: '-50%', scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-full left-1/2 mb-3 pointer-events-none w-64 z-50"
                >
                  <div className="bg-card/90 dark:bg-neutral-900/90 border border-emerald-500/40 backdrop-blur-xl p-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] text-start relative">
                    <p className="text-xs font-semibold mb-1 text-emerald-400">
                      {tech.label}
                    </p>
                    <p className="text-[11px] text-foreground/80 leading-relaxed font-normal whitespace-normal">
                      {tech.description}
                    </p>
                    {/* Centered Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-8 border-transparent border-t-card/90 dark:border-t-neutral-900/90" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Main Section ───────────────────────────────────────────────── */
const SkillsSection = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [rawSkillsData, setRawSkillsData] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [selectedMobile, setSelectedMobile] = useState<number | null>(null);

  useEffect(() => {
    const fetchSkillsAndSettings = () => {
      Promise.all([
        api.get('/skills'),
        api.get('/settings')
      ])
        .then(([skillsRes, settingsRes]) => {
          if (settingsRes.data?.data) {
            setSettings(settingsRes.data.data);
          }

          const rawSkills = skillsRes.data?.data;
          if (Array.isArray(rawSkills) && rawSkills.length > 0) {
            const activeSkills = rawSkills.filter((s: any) => s.isEnabled !== false);
            activeSkills.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setRawSkillsData(activeSkills);
          }
        })
        .catch((err) => {
          console.error('Failed to load skills from database', err);
        });
    };

    fetchSkillsAndSettings();

    const handleUpdate = () => fetchSkillsAndSettings();
    window.addEventListener('portfolio_settings_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_settings_updated', handleUpdate);
  }, []);

  const skillsItems: TechItem[] = rawSkillsData.map((s: any, idx: number) => {
    const fallback = FALLBACK_POSITIONS[idx % FALLBACK_POSITIONS.length];
    const label = isAr ? (s.nameAr || s.name) : s.name;
    const description = isAr 
      ? (s.descriptionAr || s.description || `${label} - تطوير وبرمجة متقدمة.`)
      : (s.description || `${s.name} development & integration.`);

    return {
      label,
      description,
      size: typeof s.size === 'number' && s.size > 0 ? s.size : (fallback.x ? 20 : 20),
      x: typeof s.x === 'number' ? s.x : fallback.x,
      y: typeof s.y === 'number' ? s.y : fallback.y,
      depth: typeof s.depth === 'number' ? s.depth : fallback.depth,
    };
  });

  const resolveField = (key: string, arVal?: string, enVal?: string, fallback?: string) => {
    if (isAr) {
      return t(key, arVal || fallback);
    }
    return t(key, enVal || fallback);
  };

  const badgeText = resolveField('skills.badge', settings?.skillsBadgeAr, settings?.skillsBadge, 'Skills & Expertise');
  const mainTitle = resolveField('skills.title', settings?.skillsTitleAr, settings?.skillsTitle, 'Engineered Core Capabilities');
  const p1 = resolveField('skills.subtitle', settings?.skillsParagraph1Ar || settings?.skillsDescriptionAr, settings?.skillsParagraph1 || settings?.skillsDescription, 'I architect full-stack systems end-to-end — from clean Node.js service layers with normalized relational schemas, to reactive React and Next.js frontends built for performance, accessibility, and long-term maintainability.');
  const p2 = isAr
    ? (settings?.skillsParagraph2Ar || t('skills.paragraph2', 'كل قرار هندسي يرتكز على قابلية التوسع: تصميم واجهات برمجية API معيارية، وفهرسة دقيقة لقواعد البيانات، وخطوط نشر مجربة تضمن استقرار النظام تحت الضغط العالي.'))
    : (settings?.skillsParagraph2 || 'Every engineering decision is grounded in scalability: modular API design, precise database indexing, and production-tested deployment workflows that keep systems reliable under real-world load and rapid iteration.');

  const point1Title = resolveField('skills.point1.title', settings?.skillsPoint1TitleAr, settings?.skillsPoint1Title, 'Architecture First');
  const point1Text = resolveField('skills.point1.desc', settings?.skillsPoint1TextAr, settings?.skillsPoint1Text, 'Clean RESTful APIs & modular database design built to last.');
  const point2Title = resolveField('skills.point2.title', settings?.skillsPoint2TitleAr, settings?.skillsPoint2Title, 'Modern Stack');
  const point2Text = resolveField('skills.point2.desc', settings?.skillsPoint2TextAr, settings?.skillsPoint2Text, 'High-performance React, Next.js, and Tailwind implementations.');

  return (
    <section
      id="skills"
      className="scroll-mt-24 py-24 md:py-36 px-6 bg-transparent overflow-hidden"
      aria-label="Skills and expertise"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* ── Left Column (5 cols) ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-7"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Badge */}
            <motion.div variants={fadeUpVariants}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/60 bg-card/40 dark:bg-white/[0.04] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                  {badgeText}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUpVariants}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                {mainTitle === 'Engineered Core Capabilities' ? (
                  <>
                    Engineered Core{' '}
                    <span className="text-emerald-400">Capabilities</span>
                  </>
                ) : (
                  mainTitle
                )}
              </h2>
            </motion.div>

            {/* Body Paragraphs */}
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {p1}
              </p>
              {p2 && (
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {p2}
                </p>
              )}
            </motion.div>

            {/* Key Metrics / Highlights */}
            <motion.div variants={fadeUpVariants} className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">
                    {point1Title}
                  </span>
                  {' — '}
                  {point1Text}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">
                    {point2Title}
                  </span>
                  {' — '}
                  {point2Text}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column (7 cols): Scatter Cloud — desktop ── */}
          <div className="hidden md:block lg:col-span-7 lg:translate-x-20 rtl:lg:-translate-x-20">
            {skillsItems.length > 0 ? (
              <ScatterCloud items={skillsItems} />
            ) : (
              <div className="h-[500px] flex items-center justify-center text-muted-foreground text-sm">
                Loading skills...
              </div>
            )}
          </div>

          {/* ── Mobile: Text badge grid ── */}
          <div className="md:hidden lg:col-span-7 space-y-4">
            <motion.div
              className="flex flex-wrap gap-2.5 justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {skillsItems.map((tech, i) => {
                const isSelected = selectedMobile === i;
                return (
                  <motion.button
                    key={tech.label + i}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                    }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() =>
                      setSelectedMobile(isSelected ? null : i)
                    }
                    className={[
                      'px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight border cursor-pointer transition-all duration-200',
                      isSelected
                        ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                        : 'border-border/60 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 bg-card/40 backdrop-blur-sm',
                    ].join(' ')}
                  >
                    {tech.label}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Mobile: description drawer */}
            <AnimatePresence mode="wait">
              {selectedMobile !== null && skillsItems[selectedMobile] && (
                <motion.div
                  key={selectedMobile}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border border-border/60 bg-card/40 dark:bg-white/[0.03] backdrop-blur-xl rounded-xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="text-emerald-400 font-semibold">
                        {skillsItems[selectedMobile].label}
                      </span>
                      {' — '}
                      {skillsItems[selectedMobile].description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SkillsSection;