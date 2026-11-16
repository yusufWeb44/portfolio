import { useState, useEffect, useMemo, useRef } from 'react';
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
import { SkillPill, SkillBrandIcon } from '../icons/SkillBrandIcon';
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
  { name: 'JavaScript', nameAr: 'JavaScript', description: 'Modern ES6+ web development and dynamic interactivity.', descriptionAr: 'توظيف معايير ES6+ الحديثة، وحلقة الأحداث (Event Loop)، والبرمجة غير المتزامنة لكتابة أكواد ويب عالية الأداء.' },
  { name: 'TypeScript', nameAr: 'TypeScript', description: 'Type-safe enterprise software design and maintainable architectures.', descriptionAr: 'تطبيق الأمان الصارم للأنواع (Type Safety) ونمذجة النطاقات عبر كامل النظام البرمجي لمنع أخطاء وقت التشغيل.' },
  { name: 'React', nameAr: 'React', description: 'Component-driven front-end UI architecture and state management.', descriptionAr: 'بناء واجهات مستخدم تفاعلية قائمة على المكونات باستخدام الخطافات المخصصة (Custom Hooks) وإدارة الحالة المتقدمة لتطبيقات الويب المؤسسية.' },
  { name: 'Next.js', nameAr: 'Next.js', description: 'Server-side rendering, static site generation, and full-stack React apps.', descriptionAr: 'توظيف تقنيات العرض من جهة الخادم (SSR) والتوليد الثابت المتزايد (ISR) لبناء مواقع إنتاجية فائقة السرعة ومتوافقة مع محركات البحث.' },
  { name: 'Drizzle ORM', nameAr: 'Drizzle ORM', description: 'Type-safe TypeScript ORM with fast SQL query execution.', descriptionAr: 'إدارة قواعد البيانات العلائقية في TypeScript بأمان تام للأنواع واستعلامات SQL فائقة السرعة.' },
  { name: 'GraphQL', nameAr: 'GraphQL', description: 'Schema-first API design and optimized flexible data fetching.', descriptionAr: 'بناء واجهات برمجية معتمدة على المخططات (Schema-First) لمنع جلب البيانات الفائضة وتمكين استعلامات مرنة للواجهة الأمامية.' },
  { name: 'CSS', nameAr: 'CSS', description: 'Modern layout design with CSS Grid, Flexbox, and micro-animations.', descriptionAr: 'بناء أنظمة التخطيط المتقدمة باستخدام CSS Grid و Flexbox، مع الحركات الانسيابية والمتغيرات المخصصة.' },
  { name: 'Tailwind CSS', nameAr: 'Tailwind CSS', description: 'Utility-first modern responsive design system.', descriptionAr: 'تصميم أنظمة واجهات مستخدم متجاوبة ودقيقة الأبعاد (Pixel-Perfect) باستخدام أنماط التصميم الزجاجي الحديثة.' },
  { name: 'PostgreSQL', nameAr: 'PostgreSQL', description: 'Robust relational database architecture and query optimization.', descriptionAr: 'هندسة قواعد البيانات العلائقية مع الفهرسة المتقدمة، والمفاتيح الخارجية، وتحسين أداء الاستعلامات المعقدة.' },
  { name: 'Node.js', nameAr: 'Node.js', description: 'High-performance scalable backend services and microservices.', descriptionAr: 'تطوير خدمات خلفية قابلة للتوسع، ومسارات RESTful، وقنوات اتصال فورية في الوقت الفعلي عبر WebSockets.' },
  { name: 'Express', nameAr: 'Express', description: 'Fast, minimalist Node.js web and API framework.', descriptionAr: 'هيكلة طبقات الـ API الخفيفة في Node.js، وبرمجيات الوسيط (Middlewares)، ومتحكمات المسارات المعيارية.' },
  { name: 'MongoDB', nameAr: 'MongoDB', description: 'Document-oriented NoSQL database for flexible data schemas.', descriptionAr: 'نمذجة قواعد بيانات NoSQL المستندية لهياكل البيانات المرنة وعمليات القراءة والكتابة ذات الكثافة العالية.' },
  { name: 'MySQL', nameAr: 'MySQL', description: 'Relational data management and ACID-compliant storage.', descriptionAr: 'تصميم قواعد بيانات إنتاجية معيارية، وإجراءات مخزنة (Stored Procedures)، وهياكل بيانات عالية التوافر والموثوقية.' },
  { name: 'HTML', nameAr: 'HTML', description: 'Semantic, accessible, and SEO-friendly document structuring.', descriptionAr: 'بناء هيكلية صفحات ويب دلالية (Semantic) متوافقة مع معايير الوصول الشامل وقارئات الشاشة ومحركات المتصفحات الحديثة.' },
  { name: 'Docker', nameAr: 'Docker', description: 'Containerization, reproducible environments, and cloud deployment.', descriptionAr: 'تحزيم بيئات التطوير المتكاملة داخل حاويات باستخدام Docker Compose لضمان نشر سلس وموحد من البيئة المحلية إلى السحابة.' },
  { name: 'Git & GitHub', nameAr: 'Git & GitHub', description: 'Version control, collaborative workflows, and CI/CD pipelines.', descriptionAr: 'إدارة إصدارات الأكواد البرمجية عبر استراتيجيات التفريع المنظمة، والدمج التفاعلي، وخطوط التكامل والنشر المستمر (CI/CD).' },
  { name: 'prisma ORM', nameAr: 'prisma ORM', description: 'Next-generation ORM for Node.js and TypeScript.', descriptionAr: 'إدارة تهجير قواعد البيانات (Migrations) وتنفيذ استعلامات SQL عبر واجهات برمجية مولدة تلقائياً وآمنة الأنواع.' },
  { name: 'Flutter', nameAr: 'Flutter', description: 'Cross-platform mobile applications for iOS and Android.', descriptionAr: 'تطوير تطبيقات الهواتف الذكية المتعددة المنصات باستخدام معمارية BLoC، والحركات المخصصة، والتكامل السلس مع خصائص النظام.' },
  { name: 'Dart', nameAr: 'Dart', description: 'Client-optimized object-oriented language for mobile apps.', descriptionAr: 'كتابة المنطق الأساسي لتطبيقات الهواتف بهيكلة كائنية متينة، مع إدارة التدفقات غير المتزامنة (Async Streams) والأمان التام للقيم الفارغة.' },
  { name: 'Figma', nameAr: 'Figma', description: 'UI/UX prototyping, design systems, and wireframing.', descriptionAr: 'تصميم المخططات التفاعلية والنماذج الأولية للواجهات (UI/UX)، وتحويل عناصر التصميم مباشرة إلى كود برمجي دقيق.' },
  { name: 'ASP.NET', nameAr: 'ASP.NET', description: 'Enterprise backend solutions and C# Web APIs.', descriptionAr: 'بناء واجهات برمجية وخدمات خلفية على مستوى المؤسسات بالاعتماد على لغة C# وبيئة عمل .NET المتكاملة.' },
  { name: 'java', nameAr: 'java', description: 'Object-oriented backend software and enterprise applications.', descriptionAr: 'تطوير تطبيقات كائنية التوجه صارمة الأنواع، وبناء الخدمات الخلفية، وحل المشكلات الخوارزمية المعقدة.' },
  { name: 'REST APIs', nameAr: 'REST APIs', description: 'Standardized RESTful microservices and secure JSON endpoints.', descriptionAr: 'هندسة واجهات برمجية RESTful نظيفة ومؤمنة بمصادقة JWT، مع تحديد معدل الطلبات (Rate Limiting) والتوثيق وفق معايير OpenAPI.' },
  { name: 'database design', nameAr: 'database design', description: 'Normalized database schema design and performance tuning.', descriptionAr: 'تصميم مخططات الكيانات والعلاقات (ERD)، وتطبيع جداول البيانات (Normalization)، وضبط القيود العلائقية بكفاءة عالية.' },
  { name: 'OOP', nameAr: 'OOP', description: 'SOLID design principles and object-oriented software patterns.', descriptionAr: 'تطبيق مبادئ SOLID والوراثة والتغليف لبناء أنظمة برمجية قابلة لإعادة الاستخدام وسهلة الصيانة والتطوير.' },
  { name: 'Data Structure & Algorithm', nameAr: 'Data Structure & Algorithm', description: 'Efficient algorithmic problem solving and time-complexity optimization.', descriptionAr: 'حل المشكلات البرمجية المعقدة بأفضل كفاءة للوقت والذاكرة (Time & Space Complexity) باستخدام هياكل البيانات المتقدمة.' },
  { name: 'prompt engineering', nameAr: 'prompt engineering', description: 'LLM agent workflows, prompt optimization, and AI tool integration.', descriptionAr: 'تصميم الأوامر النظامية (System Prompts)، وأنماط التوجيه الذكية، ودمج النماذج اللغوية الكبيرة (LLMs) داخل المنتجات البرمجية.' },
  { name: 'SEO', nameAr: 'SEO', description: 'Search engine optimization, metadata tuning, and Core Web Vitals.', descriptionAr: 'تحسين مؤشرات الأداء الأساسية للويب (Core Web Vitals)، والبيانات الوصفية الدلالية، وهيكلة البيانات لتصدر نتائج محركات البحث.' },
  { name: 'Postman', nameAr: 'Postman', description: 'API testing, automated request collections, debugging, and endpoint documentation.', descriptionAr: 'اختبار واجهات البرمجة (APIs)، تتبع الأخطاء، وتوثيق نقاط الاتصال لضمان موثوقية الربط مع الخوادم.' },
];

/* ─── Floating Tooltip Window (Above the skill with pointed arrow, smart flip if near top) ── */
const FloatingTooltip = ({ skill, isAr }: { skill: HoveredSkillData; isAr: boolean }) => {
  // Compact, sleeker tooltip width with mobile safety margins
  const tooltipWidth = typeof window !== 'undefined' ? Math.min(260, window.innerWidth - 32) : 260;
  const halfW = tooltipWidth / 2;

  // Check if pill is too close to top of viewport (e.g. within 140px of top)
  const isNearTop = skill.rect.top < 140;
  const topPos = isNearTop ? skill.rect.bottom + 8 : skill.rect.top - 8;

  // X-position clamped inside screen margins
  const pillCenterX = skill.rect.left + skill.rect.width / 2;
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 390;
  const clampedX = Math.max(
    halfW + 16,
    Math.min(screenW - halfW - 16, pillCenterX)
  );

  // Arrow offset relative to tooltip center, safely clamped within tooltip bounds
  const rawOffset = pillCenterX - clampedX;
  const arrowOffset = Math.max(-halfW + 18, Math.min(halfW - 18, rawOffset));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, x: '-50%', y: isNearTop ? '0%' : '-100%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%', y: isNearTop ? '0%' : '-100%' }}
      exit={{ opacity: 0, scale: 0.94, x: '-50%', y: isNearTop ? '0%' : '-100%' }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="fixed pointer-events-none z-[99999]"
      style={{
        top: `${topPos}px`,
        left: `${clampedX}px`,
        width: `${tooltipWidth}px`,
      }}
    >
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="bg-popover dark:bg-[#121417] border border-border/80 dark:border-white/10 p-2.5 sm:p-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.85)] text-start relative select-none backdrop-blur-md"
      >
        {/* Tooltip Header: Skill Brand Icon & English Name */}
        <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-border/40">
          <div className="scale-90 origin-left rtl:origin-right flex items-center shrink-0">
            <SkillBrandIcon name={skill.originalName || skill.label} />
          </div>
          <span className="text-xs font-bold text-foreground font-sans" dir="ltr">
            {skill.label}
          </span>
        </div>

        {/* Skill Description */}
        <p className="text-[11px] text-foreground/85 leading-relaxed font-normal whitespace-normal">
          {skill.description}
        </p>

        {/* Sharp Pointed / Tapered Arrow (Points down if above pill, points up if below pill) */}
        <div
          className={`absolute pointer-events-none ${isNearTop ? 'bottom-full -mb-[1px]' : 'top-full -mt-[1px]'}`}
          style={{
            left: `calc(50% + ${arrowOffset}px)`,
            transform: `translateX(-50%) ${isNearTop ? 'rotate(180deg)' : ''}`,
          }}
        >
          <svg width="16" height="8" viewBox="0 0 16 8" className="block overflow-visible">
            <polygon
              points="0,0 8,8 16,0"
              className="fill-popover dark:fill-[#121417] stroke-border/80 dark:stroke-white/10"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line
              x1="0.5"
              y1="0"
              x2="15.5"
              y2="0"
              className="stroke-popover dark:stroke-[#121417]"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Infinite Marquee Row with 60fps GPU Compositing ──────────────── */
interface MarqueeRowProps {
  skills: TechItem[];
  direction: 1 | -1;
  baseSpeed: number;
  velocityFactor: any;
  isPaused: boolean;
  onHover: (data: HoveredSkillData) => void;
  onToggle: (skill: TechItem, e: React.MouseEvent) => void;
  onLeave: () => void;
}

const SkillMarqueeRow = ({
  skills,
  direction,
  baseSpeed,
  velocityFactor,
  isPaused,
  onHover,
  onToggle,
  onLeave,
}: MarqueeRowProps) => {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_t, delta) => {
    // When hovering or tapping a skill, row pauses so user can read tooltip comfortably
    if (isPaused) return;

    // delta is time in ms (~16.6ms at 60fps)
    const extraVelocity = velocityFactor ? Math.abs(velocityFactor.get()) : 0;
    // Clamped lightweight velocity acceleration
    const speedMultiplier = 1 + Math.min(extraVelocity, 8) * 1.2;
    const moveBy = direction * baseSpeed * speedMultiplier * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  if (skills.length === 0) return null;

  return (
    <div className="flex select-none py-1">
      <motion.div className="flex shrink-0 will-change-transform" style={{ x }}>
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 items-center gap-2.5 sm:gap-4 pr-2.5 sm:pr-4"
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
                onClick={(e) => onToggle(skill, e)}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Full Marquee System (Right Column) ─────────────────────────── */
const InfiniteSkillsMarquee = ({ items, isAr }: { items: TechItem[]; isAr: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  // Close tooltip on page scroll or outside click/tap
  useEffect(() => {
    if (!activeHover) return;
    const handleDismiss = (e: MouseEvent | TouchEvent) => {
      if ((e.target as HTMLElement).closest('.group\\/pill')) return;
      setActiveHover(null);
    };
    const handleScroll = () => setActiveHover(null);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleDismiss);
    window.addEventListener('touchend', handleDismiss);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleDismiss);
      window.removeEventListener('touchend', handleDismiss);
    };
  }, [activeHover]);

  const handleToggle = (skill: TechItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeHover?.label === skill.label) {
      setActiveHover(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveHover({
      label: skill.label,
      originalName: skill.originalName,
      description: skill.description,
      rect,
    });
  };

  // Dynamic row splitting:
  // - Mobile (< 768px): 3 rows
  // - Tablets & Large iPads (768px <= width < 1280px): exactly 4 rows (eliminates item repetition across wide tablet screen)
  // - Desktop (>= 1280px): 5 rows (in the 7-col side-by-side grid)
  const rows = useMemo(() => {
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1280;

    let numRows = 4;
    if (isMobile) {
      numRows = 3;
    } else if (isTablet) {
      numRows = 4;
    } else {
      numRows = items.length >= 15 ? 5 : 4;
    }

    const result: TechItem[][] = Array.from({ length: numRows }, () => []);
    if (items.length === 0) return result;

    items.forEach((item, index) => {
      result[index % numRows].push(item);
    });

    return result;
  }, [items, viewportWidth]);

  // Alternating directions and organic base speeds for natural depth
  const rowConfigs: Array<{ direction: 1 | -1; baseSpeed: number }> = [
    { direction: -1, baseSpeed: 1.6 },
    { direction: 1, baseSpeed: 1.2 },
    { direction: -1, baseSpeed: 1.8 },
    { direction: 1, baseSpeed: 1.3 },
    { direction: -1, baseSpeed: 1.5 },
  ];

  // 100% WebKit/Safari compatible multi-stop percentage alpha mask (zero calc() syntax issues)
  const maskGradient = 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 1.5%, rgba(0,0,0,0.5) 3.5%, rgba(0,0,0,0.85) 6%, black 9%, black 91%, rgba(0,0,0,0.85) 94%, rgba(0,0,0,0.5) 96.5%, rgba(0,0,0,0.15) 98.5%, transparent 100%)';

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="w-full relative overflow-hidden flex flex-col gap-2.5 sm:gap-3 py-2 isolate"
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
      }}
    >
      {/* Edge fade overlays for 100% seamless background blending across all iPad & mobile browsers */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 md:w-20 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 md:w-20 bg-gradient-to-l from-background via-background/60 to-transparent z-10" />
      {rows.map((rowSkills, rIdx) => {
        const config = rowConfigs[rIdx % rowConfigs.length];
        return (
          <SkillMarqueeRow
            key={rIdx}
            skills={rowSkills}
            direction={config.direction}
            baseSpeed={config.baseSpeed}
            velocityFactor={velocityFactor}
            isPaused={activeHover !== null || !isInView}
            onHover={setActiveHover}
            onToggle={handleToggle}
            onLeave={() => {
              // On desktop mouse leave, close tooltip
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                setActiveHover(null);
              }
            }}
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
              isAr={isAr}
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
  const [rawSkillsData, setRawSkillsData] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_skills');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

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
            try {
              localStorage.setItem('portfolio_skills', JSON.stringify(activeSkills));
            } catch {}
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
      // Keep the skill name in English as requested
      const label = s.name;
      const description = isAr 
        ? (s.descriptionAr || s.description || `${label} — تطوير وهندسة برمجية متقدمة.`)
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
      className="scroll-mt-24 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-x-clip"
      aria-label="Skills and expertise"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-10 xl:gap-12 items-start">

          {/* ── Left Column (5 cols on desktop, full width on tablets & mobile) ── */}
          <motion.div
            className="xl:col-span-5 flex flex-col gap-5 sm:gap-6 xl:gap-7 max-w-3xl xl:max-w-none"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Headline */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
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
            <FadeContent delay={0.15} blur={false} distance={16} className="space-y-4">
              {p1 ? (
                <>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {p1}
                  </p>
                  {p2 && (
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
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

          {/* ── Right Column (7 cols on desktop, full width on tablets & mobile): Infinite Horizontal Scroll Marquee ── */}
          <div className="w-full xl:col-span-7 -mt-2 xl:-mt-3">
            {skillsItems.length > 0 ? (
              <InfiniteSkillsMarquee items={skillsItems} isAr={isAr} />
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