import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Mail, Sun, Moon, 
  ChevronRight, User, FolderKanban, Terminal, Briefcase, Wrench, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../components/ui/Button';
import api from '../services/api';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { applyCustomFonts } from '../utils/fontLoader';
import Footer from '../components/Footer';
import { applyThemePalette, getThemeAuras } from '../utils/themeEngine';
import SplashScreen from '../components/ui/SplashScreen';
import SmoothScrollProvider from '../components/SmoothScroll';

const PublicLayout = () => {
  const { t, currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('portfolio_splash_seen') !== 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
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
  const location = useLocation();
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);

  const navLinks = [
    { name: t('nav.about', 'About'), id: 'about', icon: User },
    { name: t('nav.projects', 'Projects'), id: 'projects', icon: FolderKanban },
    { name: t('nav.skills', 'Skills'), id: 'skills', icon: Terminal },
    { name: t('nav.experience', 'Experience'), id: 'experience', icon: Briefcase },
    { name: t('nav.services', 'Services'), id: 'services', icon: Wrench },
    { name: t('nav.faq', 'FAQ'), id: 'faq', icon: HelpCircle },
    { name: t('nav.contact', isAr ? 'تواصل' : 'Contact'), id: 'contact', icon: Mail },
  ];

  // Passive RAF scroll detection (zero reflows/lag)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          if (window.scrollY < 80 && !isNavigatingRef.current) {
            setActiveSection('');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section via Intersection Observer without jitter
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-15% 0px -50% 0px',
        threshold: [0, 0.1, 0.25],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [location.pathname, t]);

  // Handle hash scrolling on direct load or navigation (skipped on reload so refresh starts cleanly at top)
  useEffect(() => {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') ||
      (window.performance && (window.performance as any).navigation?.type === 1);

    if (isReload) {
      if (window.location.hash) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {}
      }
      return;
    }

    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setActiveSection(id);
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

    if (id === 'hero') {
      setActiveSection('');
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      setActiveSection(id);
      isNavigatingRef.current = true;
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 700);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.__lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.__lenis?.start();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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

  // Support manual replay for testing: window.dispatchEvent(new Event('replay_splash_screen'))
  useEffect(() => {
    const handleReplay = () => setShowSplash(true);
    window.addEventListener('replay_splash_screen', handleReplay);
    return () => window.removeEventListener('replay_splash_screen', handleReplay);
  }, []);

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
    : (settings?.name ? settings.name.split(' ')[0] : 'Yousef');

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col relative bg-background text-foreground font-sans selection:bg-foreground selection:text-background overflow-x-clip">

      {/* ── First-Time Session Splash Screen (Architecture Boot) ── */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onComplete={() => setShowSplash(false)}
            isAr={isAr}
          />
        )}
      </AnimatePresence>

      {/* ── Continuous Ambient Glassmorphic Background System (GPU Composited Layer) ── */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu"
        style={{ contain: 'paint layout', transform: 'translateZ(0)' }}
        aria-hidden="true"
      >
        {bgPatternClass && (
          <div className={`absolute inset-0 ${bgPatternClass} opacity-[0.10] dark:opacity-[0.25]`} />
        )}

        {enableGlow && (
          <div 
            className="absolute inset-0 overflow-hidden opacity-35 dark:opacity-40 pointer-events-none select-none"
            style={{ contain: 'strict', transform: 'translateZ(0)' }}
          >
            <div className={`absolute -top-[5%] -right-[5%] w-[460px] h-[460px] rounded-full bg-gradient-to-br ${auras.orb1} blur-2xl transform-gpu`} />
            <div className={`absolute top-[35%] -left-[10%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr ${auras.orb2} blur-2xl transform-gpu`} />
            <div className={`absolute top-[70%] -right-[5%] w-[460px] h-[460px] rounded-full bg-gradient-to-tl ${auras.orb3} blur-2xl transform-gpu`} />
            <div className={`absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[520px] h-[300px] rounded-full ${auras.orb4} blur-2xl transform-gpu`} />
          </div>
        )}
      </div>

      {/* ── Floating Glassmorphic Header (Island Architecture) ── */}
      <header className="fixed top-0 inset-x-0 z-50 py-0 md:py-3 pointer-events-none transition-all duration-300">
        <div className="w-full md:max-w-[1380px] 2xl:max-w-[1440px] md:mx-auto px-0 md:px-6 lg:px-8 pointer-events-auto">
          <div
            className={cn(
              "flex items-center justify-between px-4 sm:px-6 py-2.5 md:py-3 min-h-[64px] sm:min-h-[68px] md:min-h-[72px]",
              "rounded-none md:rounded-2xl border-b md:border",
              "border-slate-900/[0.07] dark:border-white/[0.09]",
              "bg-white/45 dark:bg-zinc-900/35",
              "backdrop-blur-xl backdrop-saturate-150",
              "shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.20)]",
              "transition-all duration-300",
              scrolled
                ? "bg-white/70 dark:bg-zinc-900/55 border-slate-900/[0.09] dark:border-white/[0.13] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_24px_rgba(0,0,0,0.30)]"
                : ""
            )}
          >
            {/* Start: Brand Logo Only (Frameless, clean, responsive) */}
            <button
              onClick={() => scrollToSection('hero')}
              className="group flex items-center transition-transform duration-200 hover:opacity-90 cursor-pointer bg-transparent border-none p-0 focus:outline-none shrink-0"
              aria-label="Home"
            >
              <img
                src="/logo.webp"
                alt="Logo"
                className="h-8 sm:h-9 md:h-10 w-auto max-w-[95px] sm:max-w-[115px] md:max-w-[130px] object-contain filter invert contrast-125 dark:filter-none select-none shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
            </button>

            {/* Center: Desktop Navigation Links (No rectangular container on hover, text color only) */}
            <nav
              className="hidden md:flex items-center gap-1 sm:gap-2"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={cn(
                      "px-3 sm:px-3.5 py-1.5 text-sm sm:text-[15px] font-semibold transition-colors duration-200 flex items-center justify-center cursor-pointer bg-transparent border-none select-none",
                      isActive
                        ? "text-emerald-500 dark:text-emerald-400 font-bold"
                        : "text-muted-foreground hover:text-black dark:hover:text-white"
                    )}
                  >
                    <span>{link.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* End: Desktop Action Controls (Theme Toggle, Language) */}
            <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
              {/* 1. Theme Toggle (Sun / Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-slate-900/[0.07] hover:border-slate-900/[0.15] dark:border-white/[0.12] dark:hover:border-white/[0.22] text-slate-700 dark:text-slate-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all cursor-pointer group shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-md flex items-center justify-center shrink-0"
                title={isDark ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode') : (isAr ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-500 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* 2. Language Selector Dropdown */}
              <LanguageSwitcher />
            </div>

            {/* Mobile Controls: Language + Theme + Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher />
              
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-slate-900/[0.07] dark:border-white/[0.12] text-foreground transition-all cursor-pointer shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] flex items-center justify-center shrink-0 backdrop-blur-md"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-slate-900/[0.07] dark:border-white/[0.12] text-foreground transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center shrink-0 backdrop-blur-md"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar Drawer (Backdrop + Sliding Panel) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Sliding Panel */}
            <motion.aside
              initial={{ x: currentDirection === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: currentDirection === 'rtl' ? '100%' : '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "fixed inset-y-0 top-0 bottom-0 z-[9999] w-[80vw] max-w-[320px] sm:max-w-[340px] h-screen bg-background dark:bg-slate-950 text-foreground shadow-2xl flex flex-col md:hidden",
                currentDirection === 'rtl'
                  ? "right-0 border-s border-border/70 dark:border-white/10"
                  : "left-0 border-e border-border/70 dark:border-white/10"
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Drawer"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/70 dark:border-white/10 shrink-0">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection('hero');
                  }}
                  className="flex items-center cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                >
                  <img
                    src="/logo.webp"
                    alt="Logo"
                    className="h-8 w-auto max-w-[90px] object-contain filter invert contrast-125 dark:filter-none select-none shrink-0"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-border text-muted-foreground hover:text-emerald-500 transition-all cursor-pointer active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar overscroll-contain">


                {/* Theme Toggle - Clean Row */}
                <div className="flex items-center justify-between py-1 text-xs font-medium text-muted-foreground border-b border-border/70 dark:border-white/10 pb-3">
                  <span className="flex items-center gap-2">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <span>{isAr ? (isDark ? 'المظهر الداكن' : 'المظهر الفاتح') : (isDark ? 'Dark Theme' : 'Light Theme')}</span>
                  </span>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 hover:border-emerald-500/50 text-xs font-semibold text-foreground transition-all cursor-pointer"
                    title="Toggle theme"
                  >
                    <span>{isDark ? (isAr ? 'تفعيل الفاتح' : 'Light') : (isAr ? 'تفعيل الداكن' : 'Dark')}</span>
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </button>
                </div>

                {/* Navigation Links - Clean list with active highlight */}
                <nav className="space-y-1 pt-1" aria-label="Sidebar Navigation">
                  {navLinks.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToSection(item.id);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-transparent border-none text-start",
                          isActive
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 font-bold border border-emerald-500/30 dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                            : "text-muted-foreground hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              isActive ? "text-emerald-500 dark:text-emerald-400" : "text-muted-foreground"
                            )}
                          />
                          <span>{item.name}</span>
                        </div>

                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 rtl:rotate-180 transition-transform",
                            isActive ? "text-emerald-500 dark:text-emerald-400" : "text-muted-foreground/60"
                          )}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 border-t border-border/70 dark:border-white/10 text-center text-[11px] text-muted-foreground space-y-1 shrink-0">
                {settings?.email && (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <a href={`mailto:${settings.email}`} className="hover:text-foreground transition-colors" dir="ltr">
                      {settings.email}
                    </a>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground/75">
                  © {new Date().getFullYear()} {brandName}. {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer
        settings={settings}
        socialLinks={socialLinks}
        scrollToSection={scrollToSection}
      />
    </div>
    </SmoothScrollProvider>
  );
};

export default PublicLayout;
