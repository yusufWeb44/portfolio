import { useEffect, useState, useRef } from 'react';
import { Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LogOut, LayoutDashboard, FolderKanban, Briefcase, Wrench, 
  MessageSquare, Settings, Menu, X, ArrowLeft, Terminal,
  Layers, Pin, Award, HelpCircle, Globe, Languages, PanelBottom, Sparkles, MessageSquareQuote,
  ShieldCheck, Sun, Moon, User, ChevronUp, Mail
} from 'lucide-react';
import { clsx } from 'clsx';
import { Helmet } from 'react-helmet-async';
import { resolveImageUrl } from '../utils/mediaUrl';

const AdminLayout = () => {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const { currentLang, currentDirection, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached)?.logoUrl || '' : '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const cached = localStorage.getItem('portfolio_settings');
        if (cached) {
          setLogoUrl(JSON.parse(cached)?.logoUrl || '');
        }
      } catch {}
    };
    window.addEventListener('portfolio_settings_updated', handleSync);
    return () => window.removeEventListener('portfolio_settings_updated', handleSync);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const contentNavItems = [
    { key: 'admin.overview', fallback: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={17} /> },
    { key: 'admin.heroSection', fallback: 'Hero Section', path: '/admin/hero', icon: <Sparkles size={17} /> },
    { key: 'admin.generalSettings', fallback: 'General Settings', path: '/admin/settings', icon: <Settings size={17} /> },
    { key: 'admin.aboutSection', fallback: 'About Section', path: '/admin/about', icon: <Layers size={17} /> },
    { key: 'admin.workflow', fallback: 'Workflow Steps', path: '/admin/workflow', icon: <Pin size={17} /> },
    { key: 'admin.projects', fallback: 'Projects', path: '/admin/projects', icon: <FolderKanban size={17} /> },
    { key: 'admin.skills', fallback: 'Skills', path: '/admin/skills', icon: <Terminal size={17} /> },
    { key: 'admin.experience', fallback: 'Experience', path: '/admin/experience', icon: <Briefcase size={17} /> },
    { key: 'admin.certificates', fallback: 'Certificates', path: '/admin/certificates', icon: <Award size={17} /> },
    { key: 'admin.services', fallback: 'Services', path: '/admin/services', icon: <Wrench size={17} /> },
    { key: 'admin.faqs', fallback: 'FAQs', path: '/admin/faqs', icon: <HelpCircle size={17} /> },
    { key: 'admin.reviews', fallback: 'Reviews & Feedback', path: '/admin/reviews', icon: <MessageSquareQuote size={17} /> },
    { key: 'admin.contactSection', fallback: 'Contact Section', path: '/admin/contact', icon: <Mail size={17} /> },
    { key: 'admin.footer', fallback: 'Footer Section', path: '/admin/footer', icon: <PanelBottom size={17} /> },
  ];

  const systemNavItems = [
    { key: 'admin.security', fallback: 'Security & Password', path: '/admin/security', icon: <ShieldCheck size={17} /> },
    { key: 'admin.messages', fallback: 'Messages', path: '/admin/messages', icon: <MessageSquare size={17} /> },
    { key: 'admin.seo', fallback: 'SEO Hub', path: '/admin/seo', icon: <Globe size={17} /> },
    { key: 'admin.translations', fallback: 'Translations', path: '/admin/translations', icon: <Languages size={17} /> },
  ];

  const isRtl = currentDirection === 'rtl';

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-border/40 shrink-0">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src={resolveImageUrl(logoUrl) || '/logo.webp'}
            alt="Logo"
            className="h-8 w-auto object-contain filter invert contrast-125 dark:filter-none select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = '/logo.webp';
            }}
          />
          <div>
            <span className="font-bold tracking-tight text-base block leading-none">Yusuf CMS</span>
            <span className="text-[10px] text-muted-foreground">{t('admin.controlCenter', 'Admin Control Center')}</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
            {t('admin.portfolioContent', 'Portfolio Content')}
          </p>
          <nav className="space-y-0.5">
            {contentNavItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium",
                    isActive 
                      ? "bg-foreground text-background font-bold shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{t(item.key, item.fallback)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
            {t('admin.growthSettings', 'System & Preferences')}
          </p>
          <nav className="space-y-0.5">
            {systemNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium",
                    isActive 
                      ? "bg-foreground text-background font-bold shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{t(item.key, item.fallback)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: Profile Popover Button (Email Hidden for Privacy) */}
      <div className="mt-auto p-4 border-t border-border/50 relative" ref={profileMenuRef}>
        {/* Floating Profile Popover Menu */}
        {profileMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl p-1.5 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <Link
              to="/admin/security"
              onClick={() => {
                setProfileMenuOpen(false);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>{t('admin.securitySettings', 'Security & 2FA')}</span>
            </Link>

            <div className="h-px bg-border/60 my-1" />

            <button
              onClick={() => {
                setProfileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} className="shrink-0" />
              <span>{t('admin.signOut', 'Sign out')}</span>
            </button>
          </div>
        )}

        {/* Profile Trigger Button */}
        <button
          type="button"
          onClick={() => setProfileMenuOpen((prev) => !prev)}
          className={clsx(
            "w-full flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 text-start group cursor-pointer",
            profileMenuOpen 
              ? "bg-muted border-border shadow-sm ring-1 ring-border" 
              : "bg-muted/40 hover:bg-muted/80 border-border/60"
          )}
          aria-expanded={profileMenuOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              <User size={15} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <span className="text-xs font-bold block truncate text-foreground">
                {t('admin.profile', 'Admin Profile')}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                {t('admin.administrator', 'Administrator')}
              </span>
            </div>
          </div>
          <ChevronUp 
            size={16} 
            className={clsx(
              "text-muted-foreground transition-transform duration-200 shrink-0",
              profileMenuOpen ? "rotate-180" : ""
            )} 
          />
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="min-h-screen flex bg-muted/20 font-sans selection:bg-foreground selection:text-background text-foreground"
      dir={currentDirection}
    >
      <Helmet>
        <title>Admin Dashboard | Yusuf</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Desktop Sidebar */}
      <aside className={clsx(
        "w-64 bg-card hidden lg:flex flex-col h-screen sticky top-0 shrink-0",
        isRtl ? "border-l border-border" : "border-r border-border"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className={clsx(
            "relative w-72 max-w-[80%] bg-card h-full flex flex-col shadow-2xl border-border animate-in duration-300 z-50",
            isRtl ? "border-l slide-in-from-right" : "border-r slide-in-from-left"
          )}>
            <button 
              className={clsx(
                "absolute top-5 p-2 text-muted-foreground hover:text-foreground",
                isRtl ? "left-4" : "right-4"
              )}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link 
              to="/" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={15} className={clsx("transition-transform", isRtl && "rotate-180")} /> 
              <span>{t('admin.backToPublic', 'Back to public site')}</span>
            </Link>
          </div>
          
          {/* Quick Controls: Dark/Light Mode + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={clsx(
                  "px-2.5 py-1 rounded-md font-mono transition-all text-xs font-semibold",
                  currentLang === 'en'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={clsx(
                  "px-2.5 py-1 rounded-md font-sans transition-all text-xs font-semibold",
                  currentLang === 'ar'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="التحويل إلى العربية"
              >
                عربي
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
              title={isDark ? t('admin.lightMode', 'Light Mode') : t('admin.darkMode', 'Dark Mode')}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
