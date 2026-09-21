import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '../components/ui/Button';
import api from '../services/api';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { applyCustomFonts } from '../utils/fontLoader';
import Footer from '../components/Footer';
import { applyThemePalette, getThemeAuras } from '../utils/themeEngine';
import ThemeToggle from '../components/ThemeToggle';

const PublicLayout = () => {
  const { t, currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    }
    return true; // Dark is the primary default
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      const parsed = cached ? JSON.parse(cached) : null;
      if (parsed?.primaryThemeColor) {
        applyThemePalette(parsed.primaryThemeColor);
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: t('nav.about', 'About'), id: 'about' },
    { name: t('nav.projects', 'Projects'), id: 'projects' },
    { name: t('nav.skills', 'Skills'), id: 'skills' },
    { name: t('nav.experience', 'Experience'), id: 'experience' },
    { name: t('nav.services', 'Services'), id: 'services' },
    { name: t('nav.faq', 'FAQ'), id: 'faq' },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Track active section via Intersection Observer
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [location.pathname, t]);

  // Handle hash scrolling on direct load or navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -75;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    } else if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    api.get('/social-links').then(res => setSocialLinks(res.data.data)).catch(() => { });
    const fetchSettings = () => {
      api.get('/settings').then(res => {
        const data = res.data.data;
        setSettings(data);
        if (data?.primaryThemeColor) {
          applyThemePalette(data.primaryThemeColor);
        }
        try {
          localStorage.setItem('portfolio_settings', JSON.stringify(data));
        } catch { }
      }).catch(() => { });
    };
    fetchSettings();

    window.addEventListener('portfolio_settings_updated', fetchSettings);
    return () => window.removeEventListener('portfolio_settings_updated', fetchSettings);
  }, []);

  useEffect(() => {
    if (settings?.primaryThemeColor) {
      applyThemePalette(settings.primaryThemeColor);
    }
  }, [settings?.primaryThemeColor]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    applyThemePalette(settings?.primaryThemeColor, isDark);
  }, [isDark, settings?.primaryThemeColor]);

  useEffect(() => {
    applyCustomFonts({
      fontFamilyEn: settings?.fontFamilyEn,
      fontUrlEn: settings?.fontUrlEn,
      fontFamilyAr: settings?.fontFamilyAr,
      fontUrlAr: settings?.fontUrlAr,
    });
  }, [settings?.fontFamilyEn, settings?.fontUrlEn, settings?.fontFamilyAr, settings?.fontUrlAr, currentLang, currentDirection]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const nextIsDark = !isDark;

    const performThemeSwitch = () => {
      if (nextIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      applyThemePalette(settings?.primaryThemeColor, nextIsDark);
      setIsDark(nextIsDark);
    };

    // If browser supports View Transitions API, trigger circular ripple effect from click position
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? 0;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = (document as any).startViewTransition(() => {
        performThemeSwitch();
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 320,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // Fallback: Instant synchronous execution
    performThemeSwitch();
  };

  const auras = getThemeAuras(settings?.primaryThemeColor);
  const enableGlow = settings?.enableGlow !== false;
  const bgPatternClass = settings?.backgroundPattern === 'dots'
    ? 'bg-dots-pattern'
    : settings?.backgroundPattern === 'none'
      ? ''
      : 'bg-grid-pattern';

  const brandName = isAr
    ? (settings?.nameAr ? settings.nameAr.split(' ')[0] : 'يوسف')
    : (settings?.name ? settings.name.split(' ')[0] : 'Yusuf');

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground font-sans selection:bg-foreground selection:text-background overflow-x-clip">

      {/* ── Continuous Ambient Glassmorphic Background System (GPU Composited Layer) ── */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu"
        style={{ contain: 'paint layout', transform: 'translateZ(0)' }}
        aria-hidden="true"
      >
        {/* Ambient Grid Layer */}
        {bgPatternClass && (
          <div className={`absolute inset-0 ${bgPatternClass} opacity-[0.10] dark:opacity-[0.25]`} />
        )}

        {/* Floating Atmospheric Ambient Orbs (Optimized GPU Rendering) */}
        {enableGlow && (
          <div 
            className="absolute inset-0 overflow-hidden opacity-35 dark:opacity-40 pointer-events-none select-none"
            style={{ contain: 'strict', transform: 'translateZ(0)' }}
          >
            {/* Top-Right Themed Aura */}
            <div className={`absolute -top-[5%] -right-[5%] w-[460px] h-[460px] rounded-full bg-gradient-to-br ${auras.orb1} blur-2xl transform-gpu`} />

            {/* Mid-Left Secondary Themed Aura */}
            <div className={`absolute top-[35%] -left-[10%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr ${auras.orb2} blur-2xl transform-gpu`} />

            {/* Lower-Right Deep Themed Aura */}
            <div className={`absolute top-[70%] -right-[5%] w-[460px] h-[460px] rounded-full bg-gradient-to-tl ${auras.orb3} blur-2xl transform-gpu`} />

            {/* Bottom Ambient Glow for Footer / Contact */}
            <div className={`absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[520px] h-[300px] rounded-full ${auras.orb4} blur-2xl transform-gpu`} />
          </div>
        )}
      </div>

      {/* Fixed Sticky Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
          scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-lg font-bold tracking-tighter uppercase z-50 cursor-pointer bg-transparent border-none p-0 text-start"
          >
            {brandName}<span className="text-accent opacity-50">.</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="flex bg-muted/50 rounded-full p-1 border border-border/50 me-2 backdrop-blur-md">
              {navLinks.map(link => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer",
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                    )}
                  >
                    {link.name}
                  </button>
                );
              })}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Animated Theme Toggle */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} iconSize={15} />
            <button
              onClick={() => scrollToSection('contact')}
              className="ms-2 h-9 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-full transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('nav.startProject', 'Start a project')}</span>
              <ArrowRight size={13} className="rtl:rotate-180" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 z-50">
            <LanguageSwitcher />
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} iconSize={17} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-32 px-8 flex flex-col"
          >
            <nav className="flex flex-col space-y-8 text-4xl font-bold tracking-tighter">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection(link.id);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  className="text-start hover:text-muted-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('contact');
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-accent flex items-center gap-4 text-2xl mt-8 text-start cursor-pointer bg-transparent border-none p-0"
              >
                <span>{t('nav.startProject', 'Start a project')}</span>
                <ArrowRight className="rtl:rotate-180" />
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        settings={settings}
        socialLinks={socialLinks}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

export default PublicLayout;
