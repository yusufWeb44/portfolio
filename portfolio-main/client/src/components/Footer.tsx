import React, { useEffect, useState } from 'react';
import {
  ArrowUp, ArrowRight, ArrowLeft, Mail, MapPin, Phone, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterXIcon,
  WhatsappIcon,
  TelegramIcon
} from './ui/BrandIcons';

interface QuickLinkItem {
  id: string;
  label: string;
  labelAr: string;
  url: string;
  isEnabled: boolean;
  order: number;
}

interface FooterData {
  brandName?: string;
  brandNameAr?: string;
  brandRole?: string;
  brandRoleAr?: string;
  brandDescription?: string;
  brandDescriptionAr?: string;
  showSocialLinks?: boolean;
  customSocialLinks?: string | any[];

  servicesTitle?: string;
  servicesTitleAr?: string;
  servicesLinkText?: string;
  servicesLinkTextAr?: string;
  servicesLinkUrl?: string;
  servicesLimit?: number;
  showServicesCol?: boolean;

  quickLinksTitle?: string;
  quickLinksTitleAr?: string;
  quickLinks?: string | QuickLinkItem[];
  showQuickLinksCol?: boolean;

  contactTitle?: string;
  contactTitleAr?: string;
  contactEmail?: string;
  contactLocation?: string;
  contactLocationAr?: string;
  contactPhone?: string;
  showContactCol?: boolean;

  copyrightText?: string;
  copyrightTextAr?: string;
  secondaryBadge?: string;
  secondaryBadgeAr?: string;
  showBackToTop?: boolean;
}

interface FooterProps {
  settings?: any;
  socialLinks?: { platform: string; url: string; icon?: string }[];
  scrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, socialLinks = [], scrollToSection }) => {
  const { currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const isRtl = currentDirection === 'rtl';

  const [footerConfig, setFooterConfig] = useState<FooterData | null>(null);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // Fetch dynamic footer configuration & services
  const loadFooterData = async () => {
    try {
      const [footerRes, servicesRes] = await Promise.allSettled([
        api.get('/footer'),
        api.get('/services')
      ]);

      if (footerRes.status === 'fulfilled' && footerRes.value.data?.data) {
        setFooterConfig(footerRes.value.data.data);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data?.data) {
        const rawServices = servicesRes.value.data.data;
        if (Array.isArray(rawServices)) {
          setServicesList(rawServices.filter((s: any) => s.isEnabled !== false));
        }
      }
    } catch (err) {
      console.warn('Footer fetch notice:', err);
    }
  };

  useEffect(() => {
    loadFooterData();

    // Listen for live CMS updates
    const handleUpdated = () => {
      loadFooterData();
    };
    window.addEventListener('portfolio_footer_updated', handleUpdated);
    return () => window.removeEventListener('portfolio_footer_updated', handleUpdated);
  }, []);

  // Parse quick links
  let quickLinks: QuickLinkItem[] = [];
  if (footerConfig?.quickLinks) {
    if (Array.isArray(footerConfig.quickLinks)) {
      quickLinks = footerConfig.quickLinks;
    } else if (typeof footerConfig.quickLinks === 'string') {
      try {
        quickLinks = JSON.parse(footerConfig.quickLinks);
      } catch {}
    }
  }

  // Brand Name & Role strictly from CMS / settings
  const brandName = isAr
    ? (footerConfig?.brandNameAr ?? settings?.nameAr ?? '')
    : (footerConfig?.brandName ?? settings?.name ?? '');

  const brandRole = isAr
    ? (footerConfig?.brandRoleAr ?? '')
    : (footerConfig?.brandRole ?? '');

  // Bio / Tagline strictly from CMS
  const brandBio = isAr
    ? (footerConfig?.brandDescriptionAr ?? settings?.footerTextAr ?? settings?.bioAr ?? '')
    : (footerConfig?.brandDescription ?? settings?.footerText ?? settings?.bio ?? '');

  // Services Column Title & Links strictly from CMS
  const servicesTitle = isAr
    ? (footerConfig?.servicesTitleAr ?? '')
    : (footerConfig?.servicesTitle ?? '');

  const rawServicesLinkText = isAr
    ? (footerConfig?.servicesLinkTextAr ?? '')
    : (footerConfig?.servicesLinkText ?? '');

  // Strip any existing arrow symbols to prevent double arrows (e.g. "All Services → →")
  const cleanServicesLinkText = rawServicesLinkText.replace(/[→←]/g, '').trim();

  const servicesLinkUrl = footerConfig?.servicesLinkUrl || '#services';
  const servicesLimit = footerConfig?.servicesLimit || 4;
  const displayedServices = servicesList.slice(0, servicesLimit);

  // Quick Links Column Title strictly from CMS
  const quickLinksTitle = isAr
    ? (footerConfig?.quickLinksTitleAr ?? '')
    : (footerConfig?.quickLinksTitle ?? '');

  // Contact Column Title & Data strictly from CMS
  const contactTitle = isAr
    ? (footerConfig?.contactTitleAr ?? '')
    : (footerConfig?.contactTitle ?? '');

  const contactEmail = footerConfig?.contactEmail ?? settings?.email ?? '';
  const contactLocation = isAr
    ? (footerConfig?.contactLocationAr ?? settings?.locationAr ?? '')
    : (footerConfig?.contactLocation ?? settings?.location ?? '');
  const contactPhone = footerConfig?.contactPhone ?? settings?.whatsappNumber ?? '';

  // Copyright Text strictly from CMS
  const currentYear = new Date().getFullYear();
  const defaultCopyrightAr = brandName ? `جميع الحقوق محفوظة © ${currentYear} لمنصة ${brandName}.` : '';
  const defaultCopyrightEn = brandName ? `All rights reserved © ${currentYear} ${brandName}.` : '';

  const copyrightText = isAr
    ? (footerConfig?.copyrightTextAr || defaultCopyrightAr)
    : (footerConfig?.copyrightText || defaultCopyrightEn);

  const secondaryBadge = isAr
    ? (footerConfig?.secondaryBadgeAr ?? '')
    : (footerConfig?.secondaryBadge ?? '');

  const showSocialLinks = footerConfig?.showSocialLinks ?? true;
  const showServicesCol = footerConfig?.showServicesCol ?? true;
  const showQuickLinksCol = footerConfig?.showQuickLinksCol ?? true;
  const showContactCol = footerConfig?.showContactCol ?? true;
  const showBackToTop = footerConfig?.showBackToTop ?? true;

  // Platform icon resolver
  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <GithubIcon size={16} />;
    if (p.includes('linkedin')) return <LinkedinIcon size={16} />;
    if (p.includes('insta')) return <InstagramIcon size={16} />;
    if (p.includes('face')) return <FacebookIcon size={16} />;
    if (p.includes('twitter') || p === 'x') return <TwitterXIcon size={16} />;
    if (p.includes('whats')) return <WhatsappIcon size={16} />;
    if (p.includes('tele')) return <TelegramIcon size={16} />;
    if (p.includes('mail') || p.includes('email')) return <Mail size={16} />;
    return <ExternalLink size={16} />;
  };

  // Compile social links list from CMS customSocialLinks
  let socialItems: { platform: string; url: string; isEnabled?: boolean }[] = [];
  if (footerConfig?.customSocialLinks) {
    try {
      const parsed = typeof footerConfig.customSocialLinks === 'string'
        ? JSON.parse(footerConfig.customSocialLinks)
        : footerConfig.customSocialLinks;
      if (Array.isArray(parsed)) {
        socialItems = parsed.filter((s: any) => s.isEnabled !== false);
      }
    } catch {}
  } else if (!footerConfig && socialLinks && socialLinks.length > 0) {
    socialItems = [...socialLinks];
  }

  // Handle section navigation
  const handleNavClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) {
      e.preventDefault();
      const sectionId = url.replace('#', '');
      scrollToSection(sectionId);
    }
  };

  return (
    <footer className="relative mt-10 md:mt-12 border-t border-border/40 bg-background text-foreground transition-colors duration-300">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 md:pt-12 pb-6 md:pb-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">

          {/* COLUMN 1: Brand & Identity (Far Right in Arabic RTL) */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity text-start cursor-pointer bg-transparent border-none p-0 group"
                aria-label="Home"
              >
                <img
                  src="/logo.webp"
                  alt={brandName}
                  className="h-9 sm:h-10 w-auto max-w-[120px] object-contain filter invert contrast-125 dark:filter-none select-none transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-foreground leading-tight">
                  {brandName}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {brandRole}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              {brandBio}
            </p>

            {/* Social Icons row */}
            {showSocialLinks && socialItems.length > 0 && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {socialItems.map((sl) => (
                  <a
                    key={sl.platform}
                    href={sl.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={sl.platform}
                    title={sl.platform}
                    className="relative w-8 h-8 rounded-lg border border-border/60 bg-card/40 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 text-muted-foreground flex items-center justify-center transition-colors transition-transform duration-200 cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5 transform-gpu will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] isolate after:absolute after:-bottom-1 after:inset-x-0 after:h-2 after:content-['']"
                  >
                    {getPlatformIcon(sl.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: User's Services (خدماتي) - Title starting flush without icon */}
          {showServicesCol && (
            <div className="space-y-3.5">
              <h3 className="text-foreground font-bold text-sm sm:text-base tracking-tight">
                {servicesTitle}
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm">
                {displayedServices.map((service, idx) => (
                  <li key={service.id || idx}>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 text-start block leading-relaxed group"
                    >
                      <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 inline-block transition-transform duration-200">
                        {isAr ? (service.titleAr || service.title) : service.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Action Link: Brand Emerald Call-To-Action (No yellow) with single arrow */}
              {cleanServicesLinkText && (
                <div className="pt-0.5">
                  <a
                    href={servicesLinkUrl}
                    onClick={(e) => handleNavClick(e, servicesLinkUrl)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-500 hover:text-emerald-400 dark:text-emerald-400 transition-colors group cursor-pointer"
                  >
                    <span>{cleanServicesLinkText}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* COLUMN 3: Quick Links (روابط سريعة) - Title starting flush without icon */}
          {showQuickLinksCol && (
            <div className="space-y-3.5">
              <h3 className="text-foreground font-bold text-sm sm:text-base tracking-tight">
                {quickLinksTitle}
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm">
                {quickLinks
                  .filter((item) => item.isEnabled !== false)
                  .map((item) => {
                    const label = isAr ? (item.labelAr || item.label) : item.label;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.url}
                          onClick={(e) => handleNavClick(e, item.url)}
                          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer block leading-relaxed group"
                        >
                          <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 inline-block transition-transform duration-200">
                            {label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {/* COLUMN 4: Support & Contact (الدعم والتواصل) - Address is the LAST line */}
          {showContactCol && (
            <div className="space-y-3.5">
              <h3 className="text-foreground font-bold text-sm sm:text-base tracking-tight">
                {contactTitle}
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                {/* 1. Email Item: First */}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2.5 hover:text-foreground transition-colors group py-0.5"
                  >
                    <Mail className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs truncate dir-ltr">{contactEmail}</span>
                  </a>
                )}

                {/* 2. Phone Item: Second */}
                {contactPhone && (
                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 hover:text-foreground transition-colors group py-0.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs dir-ltr">{contactPhone}</span>
                  </a>
                )}

                {/* 3. Location / Address Item: LAST LINE */}
                {contactLocation && (
                  <div className="flex items-center gap-2.5 text-muted-foreground py-0.5">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{contactLocation}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM BAR: Separator + Copyright + Back To Top */}
        <div className="mt-8 md:mt-10 pt-5 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Copyright: Brand Emerald (No yellow) */}
          <p className="text-center md:text-start leading-relaxed">
            {copyrightText ? (
              <span>{copyrightText}</span>
            ) : isAr ? (
              <>
                جميع الحقوق محفوظة © <span className="font-bold text-emerald-500 dark:text-emerald-400">{currentYear}</span> لمنصة <span className="font-bold text-foreground">{brandName}</span>.
              </>
            ) : (
              <>
                All rights reserved © <span className="font-bold text-emerald-500 dark:text-emerald-400">{currentYear}</span> for <span className="font-bold text-foreground">{brandName}</span>.
              </>
            )}
          </p>

          <div className="flex items-center gap-6">
            {secondaryBadge && (
              <span className="hidden sm:inline-block font-mono text-[11px] text-muted-foreground/70">
                {secondaryBadge}
              </span>
            )}

            {showBackToTop && (
              <button
                onClick={() => scrollToSection('hero')}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                aria-label="Back to top"
              >
                <span>{isAr ? 'للأعلى' : 'Back to top'}</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-emerald-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
