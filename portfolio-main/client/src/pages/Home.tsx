import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Mail,
  Globe,
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
import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { getMediaUrl } from '../utils/mediaUrl';
import MinimalistHero from '../components/MinimalistHero';
import AboutSection from '../components/AboutSection';
import HowItWorks from '../components/ui/how-it-works';
import SkillsSection from '../components/sections/skills';
import ProjectsSection from '../components/sections/projects';
import { FAQ } from '../components/ui/faq-tabs';
import { ServiceCarousel } from '../components/ui/services-card';
import ExperienceTimeline, { type ExperienceItem } from '../components/ExperienceTimeline';
import CertificatesCarousel, { type CertificateItem } from '../components/CertificatesCarousel';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

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
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
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

  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [rawFaqs, setRawFaqs] = useState<any[]>([]);

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
          } catch {}
        }

        if (expRes.status === 'fulfilled') {
          const expData = expRes.value.data.data || [];
          setExperiences(expData);
        }
        if (certRes.status === 'fulfilled') {
          const certData = certRes.value.data.data || [];
          setCertificates(certData);
        }
        if (servRes.status === 'fulfilled') {
          const servData = (servRes.value.data.data || []).filter((s: Service) => s.isEnabled);
          setServices(servData);
        }
        if (socialRes.status === 'fulfilled') {
          setSocialLinks(socialRes.value.data.data || []);
        }
        if (faqRes.status === 'fulfilled') {
          const fetchedFaqs = faqRes.value.data.data || [];
          if (Array.isArray(fetchedFaqs)) {
            setRawFaqs(fetchedFaqs.filter((f: any) => f.isEnabled !== false));
          }
        }
      } catch (err) {
        console.error('Failed to load portfolio data', err);
      }
    };

    fetchAll();
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

    const cats: Record<string, string> = {};
    const map: Record<string, Array<{ question: string; answer: string }>> = {};

    rawFaqs.forEach((item: any) => {
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
    if (p === 'github') return <GithubIcon size={16} />;
    if (p === 'linkedin') return <LinkedinIcon size={16} />;
    if (p === 'instagram') return <InstagramIcon size={16} />;
    if (p === 'facebook') return <FacebookIcon size={16} />;
    if (p === 'twitter' || p === 'x') return <TwitterXIcon size={16} />;
    if (p === 'whatsapp') return <WhatsappIcon size={16} />;
    if (p === 'telegram') return <TelegramIcon size={16} />;
    if (p === 'email') return <Mail size={16} />;
    return <Globe size={16} />;
  };

  const name = isAr ? (settings?.nameAr || 'يوسف الأيوبي') : (settings?.name || 'Yusuf Ayoubi');

  const bio = isAr
    ? (settings?.bioAr || t('hero.bio', 'تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات عالية الأداء للشركات الناشئة والمؤسسات، بكود نظيف وموثوق يضمن النمو المستمر.'))
    : (settings?.bio || t('hero.bio', "Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth."));

  const heroText = isAr
    ? (settings?.heroTextAr || t('hero.headline', 'تطوير برمجيات متكاملة وهندسة حلول الويب'))
    : (settings?.heroText || t('hero.headline', 'End-to-End Web Development & Software Engineering'));

  const email = settings?.email || 'hello@example.com';
  const location = settings?.location || 'Istanbul, Turkey';

  const availability = isAr
    ? (settings?.availabilityAr || t('hero.availability', 'متاح للمشاريع الحرة والاستشارات'))
    : (settings?.availability || t('hero.availability', 'Available for Freelance & Consulting'));

  const ctaText = isAr
    ? (settings?.ctaTextAr || t('hero.cta', 'شاهد أعمالي'))
    : (settings?.ctaText || t('hero.cta', 'See My Work'));

  const githubUrl = socialLinks.find(s => s.platform.toLowerCase() === 'github')?.url;
  const linkedinUrl = socialLinks.find(s => s.platform.toLowerCase() === 'linkedin')?.url;
  const instagramUrl = socialLinks.find(s => s.platform.toLowerCase() === 'instagram')?.url;
  const facebookUrl = socialLinks.find(s => s.platform.toLowerCase() === 'facebook')?.url;

  const typewriterWords = (() => {
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
    return isAr ? [
      t('hero.typewriter.fullStack', 'مطور تطبيقات ويب متكامل'),
      t('hero.typewriter.softwareEngineer', 'مهندس برمجيات ونظم'),
      t('hero.typewriter.reactNext', 'خبير React و Next.js'),
      t('hero.typewriter.backendNode', 'معماري Node.js و واجهات برمجية'),
      t('hero.typewriter.uiUx', 'مصمم واجهات وتجربة مستخدم'),
    ] : [
      'Full-Stack Developer',
      'Software Developer',
      'Web Developer',
      'Mobile App Developer',
      'UI/UX Designer',
    ];
  })();

  const heroStats = (() => {
    const source = isAr ? settings?.heroStatsAr : settings?.heroStats;
    if (source) {
      try {
        const parsed = typeof source === 'string' ? JSON.parse(source) : source;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return isAr ? [
      { value: t('hero.stats.uptimeValue', '24/7'), label: t('hero.stats.uptimeLabel', 'دعم واستشارات مستمرة') },
      { value: t('hero.stats.satisfactionValue', '100%'), label: t('hero.stats.satisfactionLabel', 'رضا العملاء') },
      { value: t('hero.stats.projectsValue', '+35'), label: t('hero.stats.projectsLabel', 'مشروع مكتمل') },
      { value: t('hero.stats.experienceValue', '+4'), label: t('hero.stats.experienceLabel', 'سنوات خبرة') },
    ] : [
      { value: '24/7', label: 'Availability & Support' },
      { value: '100%', label: 'Client Satisfaction' },
      { value: '+35', label: 'Completed Projects' },
      { value: '+4', label: 'Years Experience' },
    ];
  })();

  return (
    <div className="w-full bg-transparent overflow-x-clip">
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
          availability={availability}
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
      <AboutSection />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1.5: HOW I WORK
      ═══════════════════════════════════════════════════════════════ */}
      <HowItWorks />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: PROJECTS (Horizontal Scroll Carousel)
      ═══════════════════════════════════════════════════════════════ */}
      <ProjectsSection />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: SKILLS (3D Tag Cloud Sphere)
      ═══════════════════════════════════════════════════════════════ */}
      <SkillsSection />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: EXPERIENCE (Vertical Animated Timeline & Certificates)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="experience" className="scroll-mt-24 py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                {isAr ? (settings?.experienceBadgeAr || t('experience.badge', 'الخبرات والمسيرة المهنية')) : (settings?.experienceBadge || t('experience.badge', 'Career History & Academic Journey'))}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
              {isAr ? (settings?.experienceTitleAr || t('experience.title', 'الخبرات.')) : (settings?.experienceTitle || t('experience.title', 'Experience.'))}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl">
              {isAr ? (settings?.experienceSubtitleAr || t('experience.subtitle', 'مسار زمني تفاعلي للأسس الأكاديمية والأدوار المهنية.')) : (settings?.experienceSubtitle || t('experience.subtitle', 'An interactive roadmap of academic foundations, professional roles, and specialized technical credentials.'))}
            </p>
          </FadeIn>

          {/* Vertical Timeline with Scroll Effects */}
          <ExperienceTimeline experiences={experiences} />

          {/* Horizontal Certificates Carousel */}
          <CertificatesCarousel certificates={certificates} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: SERVICES (Offerings & Workflow Process)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="services" className="scroll-mt-24 py-28 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                {isAr ? (settings?.servicesBadgeAr || t('services.badge', 'الخدمات والحلول')) : (settings?.servicesBadge || t('services.badge', 'Consulting & Offerings'))}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-end justify-between">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                {isAr ? (settings?.servicesTitleAr || t('services.title', 'الخدمات.')) : (settings?.servicesTitle || t('services.title', 'Services.'))}
              </h2>
              <p className="text-muted-foreground text-base max-w-md">
                {isAr ? (settings?.servicesSubtitleAr || t('services.subtitle', 'خدمات تطوير برمجيات متكاملة مصممة لمساعدتك على الإطلاق بشكل أسرع والنمو بثقة.')) : (settings?.servicesSubtitle || t('services.subtitle', 'End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.'))}
              </p>
            </div>
          </FadeIn>

          {/* Draggable Services Horizontal Carousel */}
          {services.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-border/70 rounded-3xl bg-card/30 backdrop-blur-md">
              <p className="text-muted-foreground">{isAr ? 'يتم تحديث الخدمات حالياً.' : 'Services are being updated.'}</p>
            </div>
          ) : (
            <ServiceCarousel
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
          )}


        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <FAQ
        id="faq"
        title={isAr ? (settings?.faqTitleAr || t('faq.title', 'الأسئلة الشائعة.')) : (settings?.faqTitle || t('faq.title', 'Common Questions.'))}
        subtitle={isAr ? (settings?.faqBadgeAr || t('faq.subtitle', 'لديك سؤال؟')) : (settings?.faqBadge || t('faq.subtitle', 'Got a question?'))}
        categories={isAr ? {
          services: t('faq.categories.services', 'الخدمات والنطاق'),
          process: t('faq.categories.process', 'العملية والجدول الزمني'),
          tech: t('faq.categories.tech', 'التقنيات المستخدمة'),
          collab: t('faq.categories.collab', 'التعاون والعمل معاً'),
        } : faqCategories}
        faqData={faqDataMap}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: CONTACT
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="scroll-mt-24 relative overflow-hidden bg-transparent text-foreground"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* ── Left Column: Headline + CTAs ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                  {isAr ? (settings?.contactBadgeAr || t('contact.badge', 'تواصل معي')) : (settings?.contactBadge || t('contact.badge', 'Get In Touch'))}
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">
                {isAr ? (
                  settings?.contactTitleAr || (
                    <>
                      لديك فكرة أو مشروع؟
                      <br />
                      <span className="text-muted-foreground/60 italic">دعنا نتحدث.</span>
                    </>
                  )
                ) : (settings?.contactTitle ? (
                  settings.contactTitle
                ) : (
                  <>
                    Have an idea?
                    <br />
                    <span className="text-muted-foreground/60 italic">Let&apos;s talk.</span>
                  </>
                ))}
              </h2>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-10">
                {isAr ? (settings?.contactSubtitleAr || t('contact.subtitle', 'سواء كنت بحاجة إلى تطبيق متكامل، أو واجهة برمجية مخصصة، أو استشارة تقنية — أنا جاهز لتحويل فكرتك إلى واقع.')) : (settings?.contactSubtitle || t('contact.subtitle', "Whether you need a full-stack application, a custom API, or a mobile app — I'm ready to bring your vision to life."))}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* WhatsApp — primary */}
                <a
                  href={
                    settings?.whatsappNumber
                      ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`
                      : (socialLinks.find(s => s.platform.toLowerCase() === 'whatsapp')?.url || `mailto:${email}`)
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="group h-11 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer"
                >
                  <WhatsappIcon size={16} />
                  <span>{isAr ? t('contact.chatWhatsapp', 'تواصل عبر واتساب') : 'Chat on WhatsApp'}</span>
                </a>

                {/* Email — secondary */}
                <a
                  href={`mailto:${email}`}
                  className="group h-11 px-6 rounded-full bg-card/40 dark:bg-white/[0.04] hover:bg-card/70 backdrop-blur-md border border-border/70 hover:border-emerald-500/50 hover:text-emerald-400 text-foreground font-bold text-xs flex items-center justify-center gap-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <Mail size={16} />
                  <span>{isAr ? t('contact.sendEmail', 'إرسال بريد إلكتروني') : 'Send an Email'}</span>
                </a>
              </div>
            </motion.div>

            {/* ── Right Column: Info Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-card/40 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-10 space-y-8 shadow-sm">

                {/* Email row */}
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-2xl bg-card/60 dark:bg-white/[0.05] border border-border/50 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">{email}</p>
                  </div>
                  <ArrowUpRight size={14} className="ml-auto shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>

                {/* Location row */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-card/60 dark:bg-white/[0.05] border border-border/50 flex items-center justify-center shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-foreground">{location}</p>
                  </div>
                </div>

                {/* Availability row */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase mb-0.5">Status</p>
                    <p className="text-sm font-semibold text-emerald-500">{availability}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/40" />

                {/* Social links row */}
                <div>
                  <p className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase mb-4">Find me on</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {socialLinks.map(link => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.platform}
                        className="w-9 h-9 rounded-full bg-card/60 dark:bg-white/[0.04] hover:bg-card/90 border border-border/70 hover:border-emerald-500/50 hover:text-emerald-400 flex items-center justify-center text-muted-foreground transition-colors duration-200 shadow-sm"
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
