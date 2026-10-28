import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  wrap,
} from 'framer-motion';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { SkillPill, SkillBrandIcon } from '../../components/ui/SkillBrandIcon';
import { SplitText, FadeContent } from '../react-bits';

/* ─── Technology Data Types ───────────────────────────────────────── */
export interface TechItem {
  label: string;
  originalName?: string;
  description: string;
  size?: number;
  x?: number;
  y?: number;
  depth?: number;
}

interface HoveredSkillData {
  label: string;
  originalName?: string;
  description: string;
  rect: DOMRect;
}

/* ─── Default Fallback Skills ────────────────────────────────────── */
const DEFAULT_SKILLS = [
  { name: 'JavaScript', nameAr: 'جافاسكريبت', description: 'Modern ES6+ web development and dynamic interactivity.' },
  { name: 'TypeScript', nameAr: 'تايب سكريبت', description: 'Type-safe enterprise software design and maintainable architectures.' },
  { name: 'React', nameAr: 'رياكت', description: 'Component-driven front-end UI architecture and state management.' },
  { name: 'Next.js', nameAr: 'نكست جي اس', description: 'Server-side rendering, static site generation, and full-stack React apps.' },
  { name: 'Drizzle ORM', nameAr: 'دريزل او ار ام', description: 'Type-safe TypeScript ORM with fast SQL query execution.' },
  { name: 'GraphQL', nameAr: 'جراف كيو ال', description: 'Schema-first API design and optimized flexible data fetching.' },
  { name: 'CSS', nameAr: 'سي اس اس', description: 'Modern layout design with CSS Grid, Flexbox, and micro-animations.' },
  { name: 'Tailwind CSS', nameAr: 'تيلويند سي اس اس', description: 'Utility-first modern responsive design system.' },
  { name: 'PostgreSQL', nameAr: 'بوستجريسكيول', description: 'Robust relational database architecture and query optimization.' },
  { name: 'Node.js', nameAr: 'نود جي اس', description: 'High-performance scalable backend services and microservices.' },
  { name: 'Express', nameAr: 'اكسبرس', description: 'Fast, minimalist Node.js web and API framework.' },
  { name: 'MongoDB', nameAr: 'مونجو دي بي', description: 'Document-oriented NoSQL database for flexible data schemas.' },
  { name: 'MySQL', nameAr: 'ماي اس كيو ال', description: 'Relational data management and ACID-compliant storage.' },
  { name: 'HTML', nameAr: 'اتش تي ام ال', description: 'Semantic, accessible, and SEO-friendly document structuring.' },
  { name: 'Docker', nameAr: 'دوكر', description: 'Containerization, reproducible environments, and cloud deployment.' },
  { name: 'Git & GitHub', nameAr: 'جيت وجيتهاب', description: 'Version control, collaborative workflows, and CI/CD pipelines.' },
  { name: 'prisma ORM', nameAr: 'بريزما', description: 'Next-generation ORM for Node.js and TypeScript.' },
  { name: 'Flutter', nameAr: 'فلاتر', description: 'Cross-platform mobile applications for iOS and Android.' },
  { name: 'Dart', nameAr: 'دارت', description: 'Client-optimized object-oriented language for mobile apps.' },
  { name: 'Figma', nameAr: 'فيجما', description: 'UI/UX prototyping, design systems, and wireframing.' },
  { name: 'ASP.NET', nameAr: 'ايه اس بي دوت نت', description: 'Enterprise backend solutions and C# Web APIs.' },
  { name: 'java', nameAr: 'جافا', description: 'Object-oriented backend software and enterprise applications.' },
  { name: 'REST APIs', nameAr: 'واجهات برمجة التطبيقات', description: 'Standardized RESTful microservices and secure JSON endpoints.' },
  { name: 'database design', nameAr: 'تصميم قواعد البيانات', description: 'Normalized database schema design and performance tuning.' },
  { name: 'OOP', nameAr: 'البرمجة كائنية التوجه', description: 'SOLID design principles and object-oriented software patterns.' },
  { name: 'Data Structure & Algorithm', nameAr: 'هياكل البيانات والخوارزميات', description: 'Efficient algorithmic problem solving and time-complexity optimization.' },
  { name: 'prompt engineering', nameAr: 'هندسة الأوامر', description: 'LLM agent workflows, prompt optimization, and AI tool integration.' },
  { name: 'SEO', nameAr: 'تحسين محركات البحث', description: 'Search engine optimization, metadata tuning, and Core Web Vitals.' },
];

/* ─── Floating Tooltip Window (Above the skill with pointed arrow) ── */
const FloatingTooltip = ({ skill }: { skill: HoveredSkillData }) => {
  // Compact, sleeker tooltip width
  const tooltipWidth = 230;
  const halfW = tooltipWidth / 2;

  // Float directly above the skill capsule with 6px clearance
  const topPos = skill.rect.top - 6;

  // X-position clamped inside screen margins
  const pillCenterX = skill.rect.left + skill.rect.width / 2;
  const clampedX = Math.max(
    halfW + 12,
    Math.min(window.innerWidth - halfW - 12, pillCenterX)
  );

  // Arrow offset relative to tooltip center, safely clamped within tooltip bounds
  const rawOffset = pillCenterX - clampedX;
  const arrowOffset = Math.max(-halfW + 18, Math.min(halfW - 18, rawOffset));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, x: '-50%', y: '-100%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-100%' }}
      exit={{ opacity: 0, scale: 0.94, x: '-50%', y: '-100%' }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="fixed pointer-events-none z-[99999]"
      style={{
        top: `${topPos}px`,
        left: `${clampedX}px`,
        width: `${tooltipWidth}px`,
      }}
    >
      <div className="bg-white dark:bg-[#0c100e] border border-emerald-500/50 p-2.5 sm:p-3 rounded-xl shadow-[0_12px_28px_rgba(15,23,42,0.16)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.95)] text-start relative select-none">
        {/* Tooltip Header: Skill Name & Brand Icon directly adjacent */}
        <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-border/40">
          <span className="text-xs font-bold text-foreground font-sans">
            {skill.label}
          </span>
          <div className="scale-90 origin-left rtl:origin-right">
            <SkillBrandIcon name={skill.originalName || skill.label} />
          </div>
        </div>

        {/* Skill Description */}
        <p className="text-[11px] text-foreground/85 leading-relaxed font-normal whitespace-normal">
          {skill.description}
        </p>

        {/* Sharp Pointed / Tapered Arrow at bottom (سهم مدبب يلامس البويضة) */}
        <div
          className="absolute top-full -mt-[1px] pointer-events-none"
          style={{
            left: `calc(50% + ${arrowOffset}px)`,
            transform: 'translateX(-50%)',
          }}
        >
          <svg width="16" height="8" viewBox="0 0 16 8" className="block overflow-visible">
            <polygon
              points="0,0 8,8 16,0"
              className="fill-white dark:fill-[#0c100e] stroke-emerald-500/50"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line
              x1="0.5"
              y1="0"
              x2="15.5"
              y2="0"
              className="stroke-white dark:stroke-[#0c100e]"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Infinite Marquee Row with Scroll Acceleration ──────────────── */
interface MarqueeRowProps {
  skills: TechItem[];
  direction: 1 | -1;
  baseSpeed: number;
  velocityFactor: any;
  isPaused: boolean;
  onHover: (data: HoveredSkillData) => void;
  onLeave: () => void;
}

const SkillMarqueeRow = ({
  skills,
  direction,
  baseSpeed,
  velocityFactor,
  isPaused,
  onHover,
  onLeave,
}: MarqueeRowProps) => {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_t, delta) => {
    // When hovering over any skill, row pauses so user can read tooltip comfortably
    if (isPaused) return;

    // delta is time in ms (~16.6ms at 60fps)
    const extraVelocity = Math.abs(velocityFactor.get());
    // Smooth dynamic scroll acceleration
    const speedMultiplier = 1 + Math.min(extraVelocity, 15) * 1.6;
    const moveBy = direction * baseSpeed * speedMultiplier * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  if (skills.length === 0) return null;

  return (
    <div className="flex overflow-hidden select-none py-1">
      <motion.div className="flex shrink-0 will-change-transform" style={{ x }}>
        {[0, 1, 2, 3].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4"
          >
            {skills.map((skill, sIdx) => (
              <SkillPill
                key={`${skill.originalName || skill.label}-${copyIndex}-${sIdx}`}
                skill={skill}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onHover({
                    label: skill.label,
                    originalName: skill.originalName,
                    description: skill.description,
                    rect,
                  });
                }}
                onMouseLeave={onLeave}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Full Marquee System (Right Column) ─────────────────────────── */
const InfiniteSkillsMarquee = ({ items }: { items: TechItem[] }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [activeHover, setActiveHover] = useState<HoveredSkillData | null>(null);

  // Close tooltip on page scroll so marquee accelerates cleanly
  useEffect(() => {
    const handleScroll = () => {
      if (activeHover) setActiveHover(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeHover]);

  // Stagger items into 5 rows (or 4 if few items)
  const rows = useMemo(() => {
    const numRows = items.length >= 15 ? 5 : 4;
    const result: TechItem[][] = Array.from({ length: numRows }, () => []);
    if (items.length === 0) return result;

    items.forEach((item, index) => {
      result[index % numRows].push(item);
    });

    return result;
  }, [items]);

  // Alternating directions and organic base speeds for natural depth
  const rowConfigs: Array<{ direction: 1 | -1; baseSpeed: number }> = [
    { direction: -1, baseSpeed: 1.6 },
    { direction: 1, baseSpeed: 1.2 },
    { direction: -1, baseSpeed: 1.8 },
    { direction: 1, baseSpeed: 1.3 },
    { direction: -1, baseSpeed: 1.5 },
  ];

  return (
    <div className="w-full relative overflow-hidden flex flex-col gap-2.5 sm:gap-3 py-2 [mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)]">
      {rows.map((rowSkills, rIdx) => {
        const config = rowConfigs[rIdx % rowConfigs.length];
        return (
          <SkillMarqueeRow
            key={rIdx}
            skills={rowSkills}
            direction={config.direction}
            baseSpeed={config.baseSpeed}
            velocityFactor={velocityFactor}
            isPaused={activeHover !== null}
            onHover={setActiveHover}
            onLeave={() => setActiveHover(null)}
          />
        );
      })}

      {/* Floating Interactive Tooltip Window */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeHover && (
            <FloatingTooltip
              key={activeHover.label}
              skill={activeHover}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

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

/* ─── Main Skills Section ────────────────────────────────────────── */
const SkillsSection = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [rawSkillsData, setRawSkillsData] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = () => {
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

    fetchData();
    window.addEventListener('portfolio_skills_updated', fetchData);
    window.addEventListener('portfolio_settings_updated', fetchData);
    return () => {
      window.removeEventListener('portfolio_skills_updated', fetchData);
      window.removeEventListener('portfolio_settings_updated', fetchData);
    };
  }, []);

  const skillsItems: TechItem[] = useMemo(() => {
    const dataSource = rawSkillsData.length > 0 ? rawSkillsData : DEFAULT_SKILLS;

    return dataSource.map((s: any) => {
      const label = isAr ? (s.nameAr || s.name) : s.name;
      const description = isAr 
        ? (s.descriptionAr || s.description || `${label} - تطوير وبرمجة متقدمة.`)
        : (s.description || `${s.name} development & integration.`);

      return {
        label,
        originalName: s.name,
        description,
      };
    });
  }, [rawSkillsData, isAr]);

  const mainTitle = isAr 
    ? (settings?.skillsTitleAr || t('skills.title', 'القدرات الهندسية الأساسية')) 
    : (settings?.skillsTitle || 'Engineered Core Capabilities');

  const p1 = isAr 
    ? (settings?.skillsParagraph1Ar || settings?.skillsDescriptionAr || '')
    : (settings?.skillsParagraph1 || settings?.skillsDescription || '');

  const p2 = isAr
    ? (settings?.skillsParagraph2Ar || '')
    : (settings?.skillsParagraph2 || '');

  const point1Title = isAr ? settings?.skillsPoint1TitleAr : settings?.skillsPoint1Title;
  const point1Text = isAr ? settings?.skillsPoint1TextAr : settings?.skillsPoint1Text;
  const point2Title = isAr ? settings?.skillsPoint2TitleAr : settings?.skillsPoint2Title;
  const point2Text = isAr ? settings?.skillsPoint2TextAr : settings?.skillsPoint2Text;

  return (
    <section
      id="skills"
      className="scroll-mt-24 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-x-clip"
      aria-label="Skills and expertise"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* ── Left Column (5 cols) - Preserved exactly as requested ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-7"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                {mainTitle === 'Engineered Core Capabilities' ? (
                  <>
                    <SplitText text="Engineered Core" delay={30} duration={0.45} />{' '}
                    <span className="text-emerald-400">
                      <SplitText text="Capabilities" delay={30} duration={0.45} />
                    </span>
                  </>
                ) : (
                  <SplitText text={String(mainTitle)} delay={30} duration={0.45} />
                )}
              </h2>
            </div>

            {/* Body Paragraphs */}
            <FadeContent delay={0.15} blur={true} distance={20} className="space-y-4">
              {p1 ? (
                <>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {p1}
                  </p>
                  {p2 && (
                    <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {p2}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base text-muted-foreground leading-relaxed">
                  {isAr ? 'يتم تحديث المهارات والتقنيات حالياً.' : 'Skills and technical capabilities are being updated.'}
                </p>
              )}
            </FadeContent>

            {/* Key Metrics / Highlights */}
            {(point1Title || point2Title) && (
              <motion.div variants={fadeUpVariants} className="space-y-3 pt-1">
                {point1Title && (
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-bold">
                        {point1Title}
                      </span>
                      {point1Text ? ` — ${point1Text}` : ''}
                    </p>
                  </div>
                )}
                {point2Title && (
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-bold">
                        {point2Title}
                      </span>
                      {point2Text ? ` — ${point2Text}` : ''}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* ── Right Column (7 cols): Infinite Horizontal Scroll Marquee ── */}
          <div className="w-full lg:col-span-7 lg:translate-x-6 rtl:lg:-translate-x-6 -mt-2 lg:-mt-3 overflow-hidden">
            {skillsItems.length > 0 ? (
              <InfiniteSkillsMarquee items={skillsItems} />
            ) : (
              <div className="h-[240px] flex items-center justify-center border border-dashed border-border/70 rounded-3xl bg-card/20 text-muted-foreground text-sm">
                {isAr ? 'لا توجد مهارات معروضة حالياً.' : 'No skills available yet.'}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SkillsSection;