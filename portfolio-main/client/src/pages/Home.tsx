import { motion } from 'framer-motion';
import {
  Mail,
  Globe,
  MapPin,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterXIcon,
  WhatsappIcon,
  TelegramIcon,
} from '../components/ui/BrandIcons';
import { useEffect, useState, useMemo, Suspense, startTransition } from 'react';
import api from '../services/api';
import { getMediaUrl } from '../utils/mediaUrl';
import MinimalistHero from '../components/MinimalistHero';
import type { ExperienceItem } from '../components/ExperienceTimeline';
import type { CertificateItem } from '../components/CertificatesCarousel';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

// Direct imports for stable section rendering, zero scroll jumps, and immediate anchor availability
import AboutSection from '../components/AboutSection';
import HowItWorks from '../components/ui/how-it-works';
import SkillsSection from '../components/sections/skills';
import ProjectsSection from '../components/sections/projects';
import { FAQ } from '../components/ui/faq-tabs';
import { ServiceCarousel } from '../components/ui/services-card';
import ExperienceTimeline from '../components/ExperienceTimeline';
import CertificatesCarousel from '../components/CertificatesCarousel';
import { buttonVariants, cn } from '../components/ui/Button';
import { SocialButton } from '../components/ui/SocialButton';
import { SplitText, BlurText, FadeContent, SpotlightCard } from '../components/react-bits';

/* ─── Types ──────────────────────────────────────────────────────── */

interface Service {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  isEnabled: boolean;
}

interface Settings {
  name?: string;
  nameAr?: string;
  bio?: string;
  bioAr?: string;
  heroText?: string;
  heroTextAr?: string;
  ctaText?: string;
  ctaTextAr?: string;
  location?: string;
  locationAr?: string;
  availability?: string;
  availabilityAr?: string;
  email?: string;
  profilePhoto?: string;
  typewriterWords?: string | string[];
  typewriterWordsAr?: string | string[];
  footerText?: string;
  footerTextAr?: string;
  whatsappNumber?: string;
  heroStats?: string;
  heroStatsAr?: string;

  workflowBadge?: string;
  workflowBadgeAr?: string;
  workflowTitle?: string;
  workflowTitleAr?: string;
  workflowSubtitle?: string;
  workflowSubtitleAr?: string;
  projectsBadge?: string;
  projectsBadgeAr?: string;
  projectsTitle?: string;
  projectsTitleAr?: string;
  projectsSubtitle?: string;
  projectsSubtitleAr?: string;
  skillsBadge?: string;
  skillsBadgeAr?: string;
  skillsTitle?: string;
  skillsTitleAr?: string;
  skillsDescription?: string;
  skillsDescriptionAr?: string;
  experienceBadge?: string;
  experienceBadgeAr?: string;
  experienceTitle?: string;
  experienceTitleAr?: string;
  experienceSubtitle?: string;
  experienceSubtitleAr?: string;
  certificatesTitle?: string;
  certificatesTitleAr?: string;
  certificatesSubtitle?: string;
  certificatesSubtitleAr?: string;
  servicesBadge?: string;
  servicesBadgeAr?: string;
  servicesTitle?: string;
  servicesTitleAr?: string;
  servicesSubtitle?: string;
  servicesSubtitleAr?: string;
  faqBadge?: string;
  faqBadgeAr?: string;
  faqTitle?: string;
  faqTitleAr?: string;
  faqSubtitle?: string;
  faqSubtitleAr?: string;
  contactBadge?: string;
  contactBadgeAr?: string;
  contactTitle?: string;
  contactTitleAr?: string;
  contactSubtitle?: string;
  contactSubtitleAr?: string;
}

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
}

const FadeIn = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <FadeContent
    delay={delay}
    blur={false}
    distance={18}
    className={className}
  >
    {children}
  </FadeContent>
);

const Home = () => {
  const { t, currentLang } = useLanguage();
  /* ─── State ──────────────────────────────────────────────────────── */
  const [settings, setSettings] = useState<Settings | null>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_experiences');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_certificates');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_services');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_social_links');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [rawFaqs, setRawFaqs] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_faqs');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  /* ─── Data Fetching ─────────────────────────────────────────────── */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settRes, expRes, certRes, servRes, socialRes, faqRes] = await Promise.allSettled([
          api.get('/settings'),
          api.get('/experience'),
          api.get('/certificates'),
          api.get('/services'),
          api.get('/social-links'),
          api.get('/faqs'),
        ]);

        if (settRes.status === 'fulfilled') {
          const settData = settRes.value.data.data;
          setSettings(settData);
          try {
            localStorage.setItem('portfolio_settings', JSON.stringify(settData));
          } catch { }
        } else {
          setSettings(null);
        }

        // Below-the-fold data — defer with startTransition to avoid blocking paint
        startTransition(() => {
          if (expRes.status === 'fulfilled') {
            const expData = expRes.value.data.data || [];
            setExperiences(expData);
            try { localStorage.setItem('portfolio_experiences', JSON.stringify(expData)); } catch { }
          } else {
            setExperiences([]);
          }
          if (certRes.status === 'fulfilled') {
            const certData = certRes.value.data.data || [];
            setCertificates(certData);
            try { localStorage.setItem('portfolio_certificates', JSON.stringify(certData)); } catch { }
          } else {
            setCertificates([]);
          }
          if (servRes.status === 'fulfilled') {
            const servData = (servRes.value.data.data || []).filter((s: Service) => s.isEnabled);
            setServices(servData);
            try { localStorage.setItem('portfolio_services', JSON.stringify(servData)); } catch { }
          } else {
            setServices([]);
          }
          if (socialRes.status === 'fulfilled') {
            const socialData = socialRes.value.data.data || [];
            setSocialLinks(socialData);
            try {
              localStorage.setItem('portfolio_social_links', JSON.stringify(socialData));
            } catch { }
          } else {
            setSocialLinks([]);
          }
          if (faqRes.status === 'fulfilled') {
            const fetchedFaqs = faqRes.value.data.data;
            if (Array.isArray(fetchedFaqs) && fetchedFaqs.length > 0) {
              const valid = fetchedFaqs.filter((f: any) => f.isEnabled !== false);
              setRawFaqs(valid);
              try { localStorage.setItem('portfolio_faqs', JSON.stringify(valid)); } catch { }
            } else {
              setRawFaqs([]);
            }
          } else {
            setRawFaqs([]);
          }
        });
      } catch (err) {
        console.error('Failed to load portfolio data', err);
      }
    };

    fetchAll();

    const handleSettingsUpdated = () => {
      api.get('/settings').then(res => {
        if (res.data?.data) {
          setSettings(res.data.data);
          try {
            localStorage.setItem('portfolio_settings', JSON.stringify(res.data.data));
          } catch { }
        }
      }).catch(() => { });
    };

    window.addEventListener('portfolio_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('portfolio_settings_updated', handleSettingsUpdated);
  }, []);

  const isAr = currentLang === 'ar';

  /* ─── Dynamic Bilingual FAQs ─────────────────────────────────────── */
  const { faqCategories, faqDataMap } = useMemo(() => {
    const categoryNamesEn: Record<string, string> = {
      services: 'Services & Scope',
      process: 'Process & Timeline',
      tech: 'Tech Stack',
      collab: 'Working Together',
    };
    const categoryNamesAr: Record<string, string> = {
      services: 'الخدمات ونطاق العمل',
      process: 'منهجية وسير العمل',
      tech: 'التقنيات المستخدمة',
      collab: 'التعاون والبدء',
    };

    const cats: Record<string, string> = {
      services: isAr ? categoryNamesAr.services : categoryNamesEn.services,
      process: isAr ? categoryNamesAr.process : categoryNamesEn.process,
      tech: isAr ? categoryNamesAr.tech : categoryNamesEn.tech,
      collab: isAr ? categoryNamesAr.collab : categoryNamesEn.collab,
    };
    const map: Record<string, Array<{ question: string; answer: string }>> = {
      services: [],
      process: [],
      tech: [],
      collab: [],
    };

    const itemsToProcess = rawFaqs || [];

    itemsToProcess.forEach((item: any) => {
      const catKey = item.category || 'services';
      if (!cats[catKey]) {
        cats[catKey] = isAr
          ? (item.categoryAr || categoryNamesAr[catKey] || catKey)
          : (categoryNamesEn[catKey] || (catKey.charAt(0).toUpperCase() + catKey.slice(1)));
      }
      if (!map[catKey]) map[catKey] = [];
      map[catKey].push({
        question: isAr ? (item.questionAr || item.question) : item.question,
        answer: isAr ? (item.answerAr || item.answer) : item.answer,
      });
    });

    return { faqCategories: cats, faqDataMap: map };
  }, [rawFaqs, isAr]);

  /* ─── Social Icon Map ────────────────────────────────────────────── */
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === 'github') return <GithubIcon size={18} />;
    if (p === 'linkedin') return <LinkedinIcon size={18} />;
    if (p === 'instagram') return <InstagramIcon size={18} />;
    if (p === 'facebook') return <FacebookIcon size={18} />;
    if (p === 'twitter' || p === 'x') return <TwitterXIcon size={18} />;
    if (p === 'whatsapp') return <WhatsappIcon size={18} />;
    if (p === 'telegram') return <TelegramIcon size={18} />;
    if (p === 'email') return <Mail size={18} />;
    return <Globe size={18} />;
  };

  const resolveField = (key: string, arSetting?: string, enSetting?: string, fallback?: string) => {
    if (isAr) {
      return t(key, arSetting || fallback);
    }
    return t(key, enSetting || fallback);
  };

  const name = isAr ? (settings?.nameAr || 'يوسف الأيوبي') : (settings?.name || 'Yusuf Ayoubi');

  const bio = resolveField(
    'hero.bio',
    settings?.bioAr,
    settings?.bio,
    ""
  );

  const heroText = resolveField(
    'hero.headline',
    settings?.heroTextAr,
    settings?.heroText,
    'End-to-End Web Development & Software Engineering'
  );

  const email = settings?.email || '';
  const location = isAr
    ? (settings?.locationAr || settings?.location || '')
    : (settings?.location || '');

  const ctaText = resolveField(
    'hero.cta',
    settings?.ctaTextAr,
    settings?.ctaText,
    'See My Work'
  );

  const githubUrl = socialLinks.find(s => s.platform.toLowerCase() === 'github')?.url;
  const linkedinUrl = socialLinks.find(s => s.platform.toLowerCase() === 'linkedin')?.url;
  const instagramUrl = socialLinks.find(s => s.platform.toLowerCase() === 'instagram')?.url;
  const facebookUrl = socialLinks.find(s => s.platform.toLowerCase() === 'facebook')?.url;

  const typewriterWords = useMemo(() => {
    const source = isAr ? settings?.typewriterWordsAr : settings?.typewriterWords;
    if (Array.isArray(source) && source.length > 0) return source;
    if (typeof source === 'string' && source.trim()) {
      try {
        const parsed = JSON.parse(source);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        const split = source.split(',').map(s => s.trim()).filter(Boolean);
        if (split.length > 0) return split;
      }
    }
    return isAr
      ? ['مطور تطبيقات ويب', 'مهندس برمجيات', 'تصميم وتطوير واجهات', 'حلول رقمية متكاملة']
      : ['Full Stack Developer', 'Software Engineer', 'Frontend Specialist', 'Creative Technologist'];
  }, [isAr, settings?.typewriterWordsAr, settings?.typewriterWords]);

  const heroStats = useMemo(() => {
    const source = isAr ? settings?.heroStatsAr : settings?.heroStats;
    if (source) {
      try {
        const parsed = typeof source === 'string' ? JSON.parse(source) : source;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return isAr
      ? [
          { value: '+4', label: 'سنوات خبرة' },
          { value: '+25', label: 'مشروع منجز' },
          { value: '+15', label: 'عميل سعيد' },
          { value: '100%', label: 'التزام بالمواعيد' },
        ]
      : [
          { value: '+4', label: 'Years Experience' },
          { value: '+25', label: 'Projects Completed' },
          { value: '+15', label: 'Satisfied Clients' },
          { value: '100%', label: 'Commitment' },
        ];
  }, [isAr, settings?.heroStatsAr, settings?.heroStats]);

  return (
    <div className="w-full bg-transparent">
      <SEO
        pageKey="home"
        title={`${name} | Software Developer & Engineer`}
        description={bio}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 0: HERO (MinimalistHero)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="hero" className="scroll-mt-24">
        <MinimalistHero
          headline={heroText}
          bioText={bio}
          ctaText={ctaText}
          ctaHref="#projects"
          imageSrc={settings?.profilePhoto ? getMediaUrl(settings.profilePhoto) : '/portfolio_photo.webp'}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          instagramUrl={instagramUrl}
          facebookUrl={facebookUrl}
          typewriterWords={typewriterWords}
          stats={heroStats}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: ABOUT
      ═══════════════════════════════════════════════════════════════ */}
      <Suspense fallback={<div className="min-h-[160px]" />}>
        <AboutSection />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1.5: HOW I WORK
      ═══════════════════════════════════════════════════════════════ */}
      <Suspense fallback={<div className="min-h-[160px]" />}>
        <HowItWorks />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: PROJECTS (Horizontal Scroll Carousel)
      ═══════════════════════════════════════════════════════════════ */}
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ProjectsSection />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: SKILLS (Horizontal Marquee Pills)
      ═══════════════════════════════════════════════════════════════ */}
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <SkillsSection />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: EXPERIENCE (Vertical Animated Timeline & Certificates)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="experience" className="scroll-mt-24 pt-10 sm:pt-14 md:pt-18 pb-4 sm:pb-6 relative overflow-x-clip">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-4">
              <SplitText
                text={resolveField('experience.title', settings?.experienceTitleAr, settings?.experienceTitle, 'Experience.')}
                delay={35}
                duration={0.45}
              />
            </h2>
            <div className="max-w-2xl">
              <BlurText
                text={resolveField('experience.subtitle', settings?.experienceSubtitleAr, settings?.experienceSubtitle, 'An interactive roadmap of academic foundations, professional roles, and specialized technical credentials.')}
                delay={20}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              />
            </div>
          </FadeIn>

          {/* Vertical Timeline with Scroll Effects */}
          {experiences.length > 0 ? (
            <Suspense fallback={<div className="min-h-[200px]" />}>
              <ExperienceTimeline experiences={experiences} />
            </Suspense>
          ) : (
            <div className="py-14 text-center border border-dashed border-border/70 rounded-xl bg-card/30 backdrop-blur-md">
              <p className="text-muted-foreground">{isAr ? 'يتم تحديث مسار الخبرات حالياً.' : 'Experience timeline is being updated.'}</p>
            </div>
          )}
        </div>

        {/* Full-width seamless Certificates Carousel */}
        {certificates.length > 0 && (
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <CertificatesCarousel
              certificates={certificates}
              title={resolveField(
                'certificates.title',
                settings?.certificatesTitleAr,
                settings?.certificatesTitle,
                isAr ? 'الشهادات والمؤهلات' : 'CERTIFICATES'
              )}
              subtitle={resolveField(
                'certificates.subtitle',
                settings?.certificatesSubtitleAr,
                settings?.certificatesSubtitle,
                isAr
                  ? 'مؤهلات وشهادات معتمدة توثق الكفاءة التقنية والإنجازات الأكاديمية.'
                  : 'Recognized industry credentials, academic achievements, and verified technical licenses.'
              )}
            />
          </Suspense>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: SERVICES (Scroll-Driven Mandatory Horizontal Scroll)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="services" className="scroll-mt-20 relative w-full">
        {services.length === 0 ? (
          <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8 text-center border border-dashed border-border/70 rounded-xl bg-card/30 backdrop-blur-md">
            <p className="text-muted-foreground">{isAr ? 'يتم تحديث الخدمات حالياً.' : 'Services are being updated.'}</p>
          </div>
        ) : (
          <Suspense fallback={<div className="min-h-[480px]" />}>
            <ServiceCarousel
              header={
                <FadeIn>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-1 sm:mb-1.5">
                    <SplitText
                      text={resolveField('services.title', settings?.servicesTitleAr, settings?.servicesTitle, 'Services.')}
                      delay={35}
                      duration={0.45}
                    />
                  </h2>
                  <div className="max-w-2xl">
                    <BlurText
                      text={resolveField('services.subtitle', settings?.servicesSubtitleAr, settings?.servicesSubtitle, 'End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.')}
                      delay={20}
                      className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2"
                    />
                  </div>
                </FadeIn>
              }
              services={services.map((service, i) => ({
                id: service.id,
                number: String(i + 1).padStart(2, '0'),
                title: isAr ? (service.titleAr || service.title) : service.title,
                description: isAr ? (service.descriptionAr || service.description) : service.description,
              }))}
              whatsappBaseUrl={
                settings?.whatsappNumber
                  ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`
                  : socialLinks.find(s => s.platform.toLowerCase() === 'whatsapp')?.url
              }
            />
          </Suspense>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: FAQ
      ═══════════════════════════════════════════════════════════════ */}
      {rawFaqs.length > 0 && (
        <Suspense fallback={<div className="min-h-[160px]" />}>
          <FAQ
            id="faq"
            title={resolveField('faq.title', settings?.faqTitleAr, settings?.faqTitle, 'Common Questions.')}
            categories={faqCategories}
            faqData={faqDataMap}
          />
        </Suspense>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: CONTACT
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="scroll-mt-24 relative overflow-hidden bg-transparent text-foreground py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="relative z-10 max-w-[620px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.04)"
              darkSpotlightColor="rgba(255, 255, 255, 0.025)"
              size={360}
              darkSize={240}
              className={cn(
                "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-7 sm:p-10",
                "bg-white dark:bg-[#121417]/95",
                "border border-slate-200/90 dark:border-white/[0.08]",
                "shadow-[0_1px_2px_rgba(15,23,42,0.03),0_16px_36px_-12px_rgba(15,23,42,0.08)]",
                "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_48px_-16px_rgba(0,0,0,0.5)]",
                "transition-all duration-300"
              )}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* 1. Headline */}
                <h2 className="text-3xl sm:text-4xl md:text-[36px] font-extrabold tracking-tight leading-[1.18] text-foreground">
                  {resolveField(
                    'contact.headline',
                    settings?.contactTitleAr,
                    settings?.contactTitle,
                    isAr ? 'لديك فكرة أو مشروع؟' : 'Have an idea?'
                  )}
                </h2>

                {/* 2. Subtitle */}
                <p className="mt-3.5 text-xs sm:text-sm md:text-[14.5px] text-slate-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto">
                  {resolveField(
                    'contact.subtitle',
                    settings?.contactSubtitleAr,
                    settings?.contactSubtitle,
                    isAr
                      ? 'سواء كنت بحاجة إلى تطبيق ويب متكامل، أو واجهة برمجية مخصصة، أو لوحة تحكم حديثة، أو تطبيق هاتف — أنا جاهز لتحويل رؤيتك إلى واقع.'
                      : "Whether you need a full-stack application, a custom API, a modern dashboard, or a mobile app — I'm ready to bring your vision to life."
                  )}
                </p>

                {/* 3. Action Buttons */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  <a
                    href={
                      settings?.whatsappNumber
                        ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`
                        : (socialLinks.find(s => s.platform.toLowerCase() === 'whatsapp')?.url || `mailto:${email}`)
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: 'primary', size: 'default' }),
                      "w-full sm:w-auto shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)]"
                    )}
                  >
                    <WhatsappIcon size={16} />
                    <span>{isAr ? t('contact.chatWhatsapp', 'تواصل عبر واتساب') : 'Chat on WhatsApp'}</span>
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'default' }),
                      "w-full sm:w-auto bg-slate-50 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.09]",
                      "border-slate-200/90 dark:border-white/15 hover:border-slate-300 dark:hover:border-white/25",
                      "!text-foreground hover:!text-foreground dark:hover:!text-foreground",
                      "[&_svg]:!text-foreground [&_span]:!text-foreground",
                      "hover:shadow-xs transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    )}
                  >
                    <Mail size={16} strokeWidth={1.5} className="!text-foreground" />
                    <span className="!text-foreground">{isAr ? t('contact.sendEmail', 'إرسال بريد إلكتروني') : 'Send an Email'}</span>
                  </a>
                </div>

                {/* 4. Location Row */}
                {location && (
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground select-none font-medium">
                    <MapPin size={13} className="text-emerald-500 shrink-0" strokeWidth={1.5} />
                    <span>{location}</span>
                  </div>
                )}

                {/* 5. Hairline Gradient Divider */}
                {socialLinks.length > 0 && (
                  <div className="w-full my-6 flex items-center justify-center" aria-hidden="true">
                    <div className="h-px w-full max-w-[240px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
                  </div>
                )}

                {/* 6. Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                      {isAr ? t('contact.findMe', 'أو تابعنا على:') : t('contact.findMe', 'Find me on:')}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {socialLinks.map(link => (
                        <SocialButton
                          key={link.platform}
                          href={link.url}
                          label={link.platform}
                          icon={getSocialIcon(link.platform)}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
