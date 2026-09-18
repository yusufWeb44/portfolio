import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '../components/ui/Button';
import api from '../services/api';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { applyCustomFonts } from '../utils/fontLoader';
import Footer from '../components/Footer';

const themeAuraGradients: Record<string, { orb1: string; orb2: string; orb3: string; orb4: string }> = {
  emerald: {
    orb1: 'from-blue-500/12 via-indigo-500/5 to-transparent dark:from-emerald-500/10 dark:via-emerald-500/[0.03]',
    orb2: 'from-sky-500/10 via-blue-500/5 to-transparent dark:from-teal-500/8 dark:via-cyan-500/[0.02]',
    orb3: 'from-indigo-600/10 via-blue-500/5 to-transparent dark:from-emerald-600/10 dark:via-emerald-500/[0.03]',
    orb4: 'bg-blue-500/8 dark:bg-emerald-500/[0.05]',
  },
  cyan: {
    orb1: 'from-cyan-500/15 via-cyan-500/5 to-transparent dark:from-cyan-500/10 dark:via-cyan-500/[0.03]',
    orb2: 'from-blue-500/12 via-sky-500/5 to-transparent dark:from-blue-500/8 dark:via-sky-500/[0.02]',
    orb3: 'from-cyan-600/15 via-cyan-500/5 to-transparent dark:from-cyan-600/10 dark:via-cyan-500/[0.03]',
    orb4: 'bg-cyan-500/10 dark:bg-cyan-500/[0.05]',
  },
  violet: {
    orb1: 'from-violet-500/15 via-violet-500/5 to-transparent dark:from-violet-500/10 dark:via-violet-500/[0.03]',
    orb2: 'from-purple-500/12 via-fuchsia-500/5 to-transparent dark:from-purple-500/8 dark:via-fuchsia-500/[0.02]',
    orb3: 'from-violet-600/15 via-violet-500/5 to-transparent dark:from-violet-600/10 dark:via-violet-500/[0.03]',
    orb4: 'bg-violet-500/10 dark:bg-violet-500/[0.05]',
  },
  amber: {
    orb1: 'from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-500/10 dark:via-amber-500/[0.03]',
    orb2: 'from-orange-500/12 via-yellow-500/5 to-transparent dark:from-orange-500/8 dark:via-yellow-500/[0.02]',
    orb3: 'from-amber-600/15 via-amber-500/5 to-transparent dark:from-amber-600/10 dark:via-amber-500/[0.03]',
    orb4: 'bg-amber-500/10 dark:bg-amber-500/[0.05]',
  },
  rose: {
    orb1: 'from-rose-500/15 via-rose-500/5 to-transparent dark:from-rose-500/10 dark:via-rose-500/[0.03]',
    orb2: 'from-pink-500/12 via-red-500/5 to-transparent dark:from-pink-500/8 dark:via-red-500/[0.02]',
    orb3: 'from-rose-600/15 via-rose-500/5 to-transparent dark:from-rose-600/10 dark:via-rose-500/[0.03]',
    orb4: 'bg-rose-500/10 dark:bg-rose-500/[0.05]',
  },
  blue: {
    orb1: 'from-blue-500/15 via-blue-500/5 to-transparent dark:from-blue-500/10 dark:via-blue-500/[0.03]',
    orb2: 'from-indigo-500/12 via-sky-500/5 to-transparent dark:from-indigo-500/8 dark:via-sky-500/[0.02]',
    orb3: 'from-blue-600/15 via-blue-500/5 to-transparent dark:from-blue-600/10 dark:via-blue-500/[0.03]',
    orb4: 'bg-blue-500/10 dark:bg-blue-500/[0.05]',
  },
  indigo: {
    orb1: 'from-indigo-500/15 via-indigo-500/5 to-transparent dark:from-indigo-500/10 dark:via-indigo-500/[0.03]',
    orb2: 'from-violet-500/12 via-blue-500/5 to-transparent dark:from-violet-500/8 dark:via-blue-500/[0.02]',
    orb3: 'from-indigo-600/15 via-indigo-500/5 to-transparent dark:from-indigo-600/10 dark:via-indigo-500/[0.03]',
    orb4: 'bg-indigo-500/10 dark:bg-indigo-500/[0.05]',
  },
};

const PublicLayout = () => {
  const { t, currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [settings, setSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached) : null;
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
    api.get('/social-links').then(res => setSocialLinks(res.data.data)).catch(() => {});
    api.get('/settings').then(res => {
      const data = res.data.data;
      setSettings(data);
      try {
        localStorage.setItem('portfolio_settings', JSON.stringify(data));
      } catch {}
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    applyCustomFonts({
      fontFamilyEn: settings?.fontFamilyEn,
      fontUrlEn: settings?.fontUrlEn,
      fontFamilyAr: settings?.fontFamilyAr,
      fontUrlAr: settings?.fontUrlAr,
    });
  }, [settings?.fontFamilyEn, settings?.fontUrlEn, settings?.fontFamilyAr, settings?.fontUrlAr, currentLang, currentDirection]);

  const toggleTheme = () => setIsDark(!isDark);

  const currentTheme = (settings?.primaryThemeColor || 'emerald').toLowerCase();
  const auras = themeAuraGradients[currentTheme] || themeAuraGradients.emerald;
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
    <div className="min-h-screen flex flex-col relative bg-background text-foreground transition-colors duration-500 font-sans selection:bg-foreground selection:text-background overflow-x-clip">
      
      {/* ── Continuous Ambient Glassmorphic Background System (GPU Composited Layer) ── */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu" 
        style={{ contain: 'paint layout', transform: 'translateZ(0)' }}
        aria-hidden="true"
      >
        {/* Ambient Grid Layer */}
        {bgPatternClass && (
          <div className={`absolute inset-0 ${bgPatternClass} opacity-[0.45] dark:opacity-[0.25]`} />
        )}

        {/* Floating Atmospheric Ambient Orbs (Optimized GPU Rendering) */}
        {enableGlow && (
          <div className="absolute inset-0 overflow-hidden opacity-70 dark:opacity-40">
            {/* Top-Right Themed Aura */}
            <div className={`absolute -top-[5%] -right-[5%] w-[480px] h-[480px] rounded-full bg-gradient-to-br ${auras.orb1} blur-3xl`} />
            
            {/* Mid-Left Secondary Themed Aura */}
            <div className={`absolute top-[35%] -left-[10%] w-[440px] h-[440px] rounded-full bg-gradient-to-tr ${auras.orb2} blur-3xl`} />

            {/* Lower-Right Deep Themed Aura */}
            <div className={`absolute top-[70%] -right-[5%] w-[480px] h-[480px] rounded-full bg-gradient-to-tl ${auras.orb3} blur-3xl`} />

            {/* Bottom Ambient Glow for Footer / Contact */}
            <div className={`absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[550px] h-[320px] rounded-full ${auras.orb4} blur-3xl`} />
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
            
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
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
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
