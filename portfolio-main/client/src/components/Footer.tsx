import React from 'react';
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterXIcon,
  WhatsappIcon,
  TelegramIcon
} from './ui/BrandIcons';

interface FooterProps {
  settings?: any;
  socialLinks?: { platform: string; url: string; icon?: string }[];
  scrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, socialLinks = [], scrollToSection }) => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  const brandName = isAr
    ? (settings?.nameAr || 'يوسف الأيوبي')
    : (settings?.name || 'Yousef Ayoubi');

  const location = isAr
    ? (settings?.locationAr || 'إسطنبول، تركيا')
    : (settings?.location || 'Istanbul, Turkey');

  const footerText = isAr
    ? (settings?.footerTextAr || settings?.bioAr || 'بناء وتصميم منتجات رقمية وأنظمة برمجية متكاملة وقابلة للتوسع.')
    : (settings?.footerText || settings?.bio || 'Architecting scalable digital products & high-performance software systems.');

  const availabilityText = isAr
    ? (settings?.availabilityAr || 'متاح للفرص والمشاريع الجديدة')
    : (settings?.availability || 'Available for select opportunities');

  const navItems = [
    { label: t('nav.about', 'About'), id: 'about' },
    { label: t('nav.projects', 'Projects'), id: 'projects' },
    { label: t('nav.skills', 'Skills'), id: 'skills' },
    { label: t('nav.experience', 'Experience'), id: 'experience' },
    { label: t('nav.services', 'Services'), id: 'services' },
    { label: t('nav.faq', 'FAQ'), id: 'faq' },
    { label: t('nav.contact', 'Contact'), id: 'contact' },
  ];

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <GithubIcon size={15} />;
    if (p.includes('linkedin')) return <LinkedinIcon size={15} />;
    if (p.includes('insta')) return <InstagramIcon size={15} />;
    if (p.includes('face')) return <FacebookIcon size={15} />;
    if (p.includes('twitter') || p === 'x') return <TwitterXIcon size={15} />;
    if (p.includes('whats')) return <WhatsappIcon size={15} />;
    if (p.includes('tele')) return <TelegramIcon size={15} />;
    if (p.includes('mail') || p.includes('email')) return <Mail size={15} />;
    return <ArrowUpRight size={15} />;
  };

  // Compile clean social links without duplicates
  const items = [...socialLinks];
  if (items.length === 0) {
    items.push(
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'LinkedIn', url: 'https://linkedin.com' }
    );
  }
  if (settings?.email && !items.some(s => s.platform.toLowerCase().includes('mail'))) {
    items.push({ platform: 'Email', url: `mailto:${settings.email}` });
  }

  return (
    <footer className="relative mt-20 border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {/* Main Content Area: Calm 2-Column Minimalist Architecture */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 lg:gap-16">
          {/* Brand & Identity Column */}
          <div className="space-y-3.5 max-w-md">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-xl font-bold tracking-tight text-foreground hover:opacity-85 transition-opacity text-start cursor-pointer bg-transparent border-none p-0"
              >
                {brandName}
                <span className="text-emerald-500">.</span>
              </button>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
                {isAr ? 'هندسة برمجيات' : 'Software Engineer'}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {footerText}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{location}</span>
              <span className="text-border">•</span>
              <span className="text-foreground/75 font-medium">{availabilityText}</span>
            </div>
          </div>

          {/* Quick Links & Social Column */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-12 lg:gap-16">
            {/* Clean Navigation Links */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                {isAr ? 'التنقل' : 'Navigation'}
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 text-start"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Presence */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                {isAr ? 'التواصل' : 'Connect'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {items.map((sl) => (
                  <a
                    key={sl.platform}
                    href={sl.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={sl.platform}
                    title={sl.platform}
                    className="w-9 h-9 rounded-full border border-border/60 bg-card/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-muted-foreground flex items-center justify-center transition-all duration-200 cursor-pointer shadow-none hover:shadow-sm"
                  >
                    {getPlatformIcon(sl.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Back to Top */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center sm:text-start">
            © {new Date().getFullYear()} {brandName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline-block font-mono text-[11px] text-muted-foreground/60">
              {isAr ? 'كود نظيف • أداء فائق' : 'Clean Code • High Performance'}
            </span>

            <button
              onClick={() => scrollToSection('hero')}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
            >
              <span>{isAr ? 'للأعلى' : 'Back to top'}</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
