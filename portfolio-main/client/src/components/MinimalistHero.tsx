import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Typewriter } from '@/components/ui/typewriter';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './ui/BrandIcons';

/* ─── Animated Count-up for Hero Stats ────────────────────────────── */
const AnimatedStatValue: React.FC<{ value: string }> = ({ value }) => {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);

  if (!match) {
    return <span>{value}</span>;
  }

  const prefix = match[1];
  const targetNum = parseInt(match[2], 10);
  const suffix = match[3];

  const [currentNum, setCurrentNum] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Only start animation when element is visible in viewport
  useEffect(() => {
    if (hasAnimated || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let startTimestamp: number | null = null;
    const duration = 1600;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(easeOut * targetNum);
      setCurrentNum(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasAnimated, targetNum]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{currentNum}{suffix}
    </span>
  );
};

export interface StatItem {
  value: string;
  label: string;
}

export interface MinimalistHeroProps {
  imageSrc?: string;
  headline?: string;
  heroText?: string;
  bioText?: string;
  stats?: StatItem[];
  typewriterWords?: string[];
  ctaText?: string;
  ctaHref?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
];

const defaultStats: StatItem[] = [
  { value: '+4', label: 'Years Experience' },
  { value: '+8', label: 'Completed Projects' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Availability & Support' },
];

const MinimalistHeroComponent: React.FC<MinimalistHeroProps> = ({
  imageSrc = '/portfolio_photo.webp',
  headline,
  heroText,
  bioText = 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.',
  stats,
  typewriterWords,
  ctaText = 'See My Work',
  ctaHref = '#projects',
  githubUrl = 'https://github.com',
  linkedinUrl = 'https://linkedin.com',
  instagramUrl = 'https://instagram.com',
  facebookUrl = 'https://facebook.com',
}) => {
  const cubicEase = [0.22, 1, 0.36, 1] as any;

  const blobPath1 = 'M410.5,317.5Q372,385,299,419.5Q226,454,161.5,410Q97,366,66,298Q35,230,73.5,166Q112,102,181,71.5Q250,41,319,72Q388,103,418.5,176.5Q449,250,410.5,317.5Z';
  const blobPath2 = 'M395,310Q350,370,285,410Q220,450,155,410Q90,370,65,300Q40,230,75,165Q110,100,180,65Q250,30,320,65Q390,100,415,165Q440,230,395,310Z';
  const blobPath3 = 'M420,320Q380,390,300,425Q220,460,150,415Q80,370,55,295Q30,220,70,155Q110,90,185,60Q260,30,330,60Q400,90,430,160Q460,230,420,320Z';

  const [startMorph, setStartMorph] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStartMorph(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const headlineContent = headline || heroText || 'End-to-End Web Development & Software Engineering';
  const activeStats = stats && stats.length > 0 ? stats : defaultStats;

  const words = typewriterWords && typewriterWords.length > 0
    ? typewriterWords
    : [
      'Computer Engineer',
      'Full-Stack Developer',
      'Mobile App Developer',
      'UI/UX Designer',
    ];

  const resolvedLinks = socialLinks.map((s) => ({
    ...s,
    href:
      s.label === 'GitHub' ? (githubUrl || s.href) :
        s.label === 'LinkedIn' ? (linkedinUrl || s.href) :
          s.label === 'Instagram' ? (instagramUrl || s.href) :
            s.label === 'Facebook' ? (facebookUrl || s.href) :
              s.href,
  }));

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-transparent select-none">

      {/* Main Hero Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 sm:pt-28 md:pt-32 pb-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── Left Column (desktop): Headline, Bio, CTA, Social, Stats ── */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start z-10 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 w-full"
            >
              {/* Headline + Bio */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-3">
                  {headlineContent}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {bioText}
                </p>
              </div>

              {/* CTA Button */}
              <div>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={ctaHref}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer"
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </motion.a>
              </div>

              {/* Social Icons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 }}
                className="flex items-center gap-2.5 pt-1"
              >
                {resolvedLinks.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 + i * 0.03, duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-border/70 bg-card/60 dark:bg-white/[0.04] backdrop-blur-sm text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    <s.Icon size={16} />
                  </motion.a>
                ))}
              </motion.div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/40 mt-6 w-full"
              >
                {activeStats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col group">
                    <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono transition-colors group-hover:text-emerald-400">
                      <AnimatedStatValue value={stat.value} />
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1 leading-snug">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ── Center Column: Blob + Image ── */}
          {/*
            On mobile (order-1): we show the image FIRST (above the bio).
            Above the image we stack: availability badge (left) + typewriter (center).
          */}
          <div className="order-1 lg:order-2 lg:col-span-4 relative flex flex-col justify-center items-center min-w-0">

            {/* ── Mobile-only: typewriter above image ── */}
            <div className="lg:hidden w-full flex flex-col mb-4 px-1">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="flex justify-center items-center min-h-[3.2rem] sm:min-h-[3.8rem]"
              >
                <h2
                  className="text-xl sm:text-2xl font-extrabold tracking-tight rtl:tracking-normal uppercase rtl:normal-case text-foreground text-center leading-[1.45] rtl:leading-[1.55]"
                  dir="auto"
                  style={{
                    overflowWrap: 'break-word',
                    wordBreak: 'normal',
                  }}
                >
                  <Typewriter
                    words={words}
                    speed={65}
                    delayBetweenWords={2200}
                    cursor={true}
                    className="text-foreground inline-block"
                  />
                </h2>
              </motion.div>
            </div>

            {/* Blob + Profile Image */}
            <div className="relative flex justify-center items-center min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] w-full">
              {/* Fluid Blob Backdrop — Enlarged to match reference photo, perfectly framing profile */}
              <div className="absolute -top-6 sm:-top-8 lg:-top-11 w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] lg:w-[450px] lg:h-[450px] z-0 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: cubicEase }}
                  className="w-full h-full relative"
                >
                {/* Ambient glow behind blob without expensive filter */}
                <div className="absolute inset-6 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 blur-3xl -z-10" />
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    {/* Dark Mode Gradient: Cyan into Primary Theme */}
                    <linearGradient id="fluid-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                      <stop offset="100%" stopColor="var(--theme-primary-hex, #064E3B)" style={{ stopColor: 'var(--theme-primary-hex, #064E3B)', filter: 'brightness(0.5)' }} />
                    </linearGradient>
                    {/* Light Mode Gradient: Luminous, eye-friendly theme gradient */}
                    <linearGradient id="fluid-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)', filter: 'brightness(1.15)' }} />
                      <stop offset="60%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} />
                      <stop offset="100%" stopColor="var(--theme-primary-hex, #064E3B)" style={{ stopColor: 'var(--theme-primary-hex, #064E3B)', filter: 'brightness(0.75)' }} />
                    </linearGradient>
                    <radialGradient id="glow-gradient-dark" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="glow-gradient-light" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--theme-primary-hex, #10B981)" style={{ stopColor: 'var(--theme-primary-hex, #10B981)' }} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="250" cy="250" r="230" className="dark:fill-[url(#glow-gradient-dark)] fill-[url(#glow-gradient-light)]" />
                  <motion.path
                    className="dark:fill-[url(#fluid-gradient-dark)] fill-[url(#fluid-gradient-light)]"
                    d={blobPath1}
                    animate={startMorph ? { d: [blobPath1, blobPath2, blobPath3, blobPath1] } : undefined}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>
            </div>

              {/* Profile Image — Completely fluid, continuous feather-soft eased gradient with zero visible steps or lines */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: cubicEase }}
                className="relative z-10 flex items-center justify-center pointer-events-none"
              >
                <img
                  src={imageSrc}
                  alt=""
                  aria-label="Profile photo"
                  loading="eager"
                  decoding="async"
                  // @ts-ignore
                  fetchPriority="high"
                  width={420}
                  height={420}
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, black 76%, rgba(0, 0, 0, 0.99) 79%, rgba(0, 0, 0, 0.96) 82%, rgba(0, 0, 0, 0.91) 85%, rgba(0, 0, 0, 0.82) 88%, rgba(0, 0, 0, 0.69) 91%, rgba(0, 0, 0, 0.52) 94%, rgba(0, 0, 0, 0.33) 96.5%, rgba(0, 0, 0, 0.15) 98.2%, rgba(0, 0, 0, 0.04) 99.2%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 76%, rgba(0, 0, 0, 0.99) 79%, rgba(0, 0, 0, 0.96) 82%, rgba(0, 0, 0, 0.91) 85%, rgba(0, 0, 0, 0.82) 88%, rgba(0, 0, 0, 0.69) 91%, rgba(0, 0, 0, 0.52) 94%, rgba(0, 0, 0, 0.33) 96.5%, rgba(0, 0, 0, 0.15) 98.2%, rgba(0, 0, 0, 0.04) 99.2%, transparent 100%)',
                  }}
                  className="w-[240px] sm:w-[300px] lg:w-[420px] h-auto object-contain scale-[1.55] pointer-events-auto transition-transform duration-500 hover:scale-[1.6]"
                />
              </motion.div>
            </div>
          </div>

          {/* ── Right Column (desktop only): Specialties stacked vertically, single line with prestige dash prefix ── */}
          <div className="hidden lg:flex order-3 lg:col-span-3 lg:justify-start rtl:lg:justify-start lg:items-center z-10 min-w-0 w-full pl-2 lg:pl-4 xl:pl-6 rtl:pl-0 rtl:pr-2 rtl:lg:pr-4 rtl:xl:pr-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="w-auto min-w-max flex flex-col items-start rtl:items-start text-start rtl:text-start space-y-4 lg:space-y-5 xl:space-y-6"
            >
              {words.map((role, idx) => {
                const cleanRole = typeof role === 'string'
                  ? (role.trim().startsWith('-') || role.trim().startsWith('—') ? role.trim().substring(1).trim() : role.trim())
                  : role;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + idx * 0.05 }}
                    className="flex items-center group cursor-default select-none"
                  >
                    <span className="text-emerald-500 dark:text-emerald-400 font-extrabold text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mr-3 rtl:mr-0 rtl:ml-3 select-none shrink-0 group-hover:text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all duration-200 leading-none">
                      -
                    </span>
                    <span
                      className="whitespace-nowrap text-lg sm:text-xl lg:text-[1.35rem] xl:text-[1.7rem] 2xl:text-[1.95rem] font-extrabold tracking-tight rtl:tracking-normal uppercase rtl:normal-case text-foreground/90 group-hover:text-emerald-400 transition-colors duration-200 select-none leading-none"
                      dir="auto"
                    >
                      {cleanRole}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const MinimalistHero = React.memo(MinimalistHeroComponent);
export default MinimalistHero;
