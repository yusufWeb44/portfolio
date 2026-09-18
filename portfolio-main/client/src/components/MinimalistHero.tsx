import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
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

    const timeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum]);

  return (
    <span className="tabular-nums">
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
  availability?: string;
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

/* ─── Availability Badge (shared between mobile & desktop) ─────── */
const AvailabilityBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-normal shadow-sm backdrop-blur-sm">
    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
    <span className="truncate">{text}</span>
  </div>
);

const MinimalistHero: React.FC<MinimalistHeroProps> = ({
  imageSrc = '/portfolio_photo_1.png',
  headline,
  heroText,
  bioText = 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.',
  availability,
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

  const headlineContent = headline || heroText || 'End-to-End Web Development & Software Engineering';
  const availabilityStatus = availability || 'Available for Freelance & Consulting';
  const activeStats = stats && stats.length > 0 ? stats : defaultStats;

  const words = typewriterWords && typewriterWords.length > 0
    ? typewriterWords
    : [
      'Full-Stack Developer',
      'Software Developer',
      'Web Developer',
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
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-20 pb-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── Left Column (desktop): Headline, Bio, CTA, Social, Stats ── */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start z-10 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.08, duration: 0.35, ease: cubicEase }}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
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

            {/* ── Mobile-only: badge then typewriter stacked above image ── */}
            <div className="lg:hidden w-full flex flex-col gap-2.5 mb-4 px-1 ">
              {/* Availability Badge — left aligned */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-start"
              >
                <AvailabilityBadge text={availabilityStatus} />
              </motion.div>

              {/* Typewriter — centered below badge, min-h prevents layout shift */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center pt-6 sm:pt-8"
              >
                <h2
                  className="min-h-[2.2rem] text-xl sm:text-2xl font-extrabold tracking-tight uppercase text-foreground text-center"
                  style={{
                    lineHeight: '1.35',
                    overflowWrap: 'normal',
                    wordBreak: 'normal',
                    whiteSpace: 'normal',
                  }}
                >
                  <Typewriter
                    words={words}
                    speed={70}
                    delayBetweenWords={2200}
                    cursor={true}
                    cursorChar="_"
                    className="text-foreground"
                  />
                </h2>
              </motion.div>
            </div>

            {/* Blob + Profile Image */}
            <div className="relative flex justify-center items-center min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] w-full">
              {/* Fluid Blob */}
              {/* Fluid Blob */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: cubicEase, delay: 0.2 }}
                className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px] z-0 pointer-events-none"
              >
                {/* Ambient glow behind blob without expensive filter */}
                <div className="absolute inset-6 rounded-full bg-blue-500/20 dark:bg-emerald-500/25 blur-3xl -z-10" />
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    {/* Dark Mode Gradient: Cyan into Emerald */}
                    <linearGradient id="fluid-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#064E3B" />
                    </linearGradient>
                    {/* Light Mode Gradient: Electric Sky into Royal Cobalt into Deep Blue */}
                    <linearGradient id="fluid-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <radialGradient id="glow-gradient-dark" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="glow-gradient-light" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="250" cy="250" r="230" className="dark:fill-[url(#glow-gradient-dark)] fill-[url(#glow-gradient-light)]" />
                  <motion.path
                    className="dark:fill-[url(#fluid-gradient-dark)] fill-[url(#fluid-gradient-light)]"
                    d={blobPath1}
                    animate={{ d: [blobPath1, blobPath2, blobPath3, blobPath1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: cubicEase, delay: 0.4 }}
                className="relative z-10 flex items-center justify-center pointer-events-none"
              >
                <motion.img
                  src={imageSrc}
                  alt=""
                  aria-label="Profile photo"
                  loading="eager"
                  decoding="async"
                  // @ts-ignore
                  fetchpriority="high"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  }}
                  className="w-[240px] sm:w-[300px] lg:w-[420px] h-auto object-contain scale-[1.55] pointer-events-auto transition-transform duration-500 hover:scale-[1.6]"
                />
              </motion.div>
            </div>
          </div>

          {/* ── Right Column (desktop only): Availability Badge + Typewriter ── */}
          <div className="hidden lg:flex order-3 lg:col-span-3 lg:justify-end rtl:lg:justify-start lg:items-start z-10 min-w-0 w-full lg:-mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="w-full lg:max-w-[340px] xl:max-w-[380px] text-left lg:text-right rtl:lg:text-left"
            >
              {/* Dynamic Availability Badge */}
              <div className="flex items-center justify-end rtl:justify-start mb-3">
                <AvailabilityBadge text={availabilityStatus} />
              </div>

              {/* Typewriter */}
              <div className="min-h-[120px] lg:min-h-[155px] flex items-center justify-end rtl:justify-start">
                <h2
                  className="text-2xl sm:text-3xl lg:text-[2.2rem] xl:text-[2.6rem] font-extrabold tracking-tight uppercase text-foreground"
                  style={{
                    lineHeight: '1.35',
                    overflowWrap: 'normal',
                    wordBreak: 'normal',
                    whiteSpace: 'normal',
                    maxWidth: '100%',
                  }}
                >
                  <Typewriter
                    words={words}
                    speed={70}
                    delayBetweenWords={2200}
                    cursor={true}
                    cursorChar="_"
                    className="text-foreground"
                  />
                </h2>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MinimalistHero;
