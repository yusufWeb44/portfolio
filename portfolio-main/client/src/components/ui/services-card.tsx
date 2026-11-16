"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  ArrowRight, 
  Code2, 
  Palette, 
  Smartphone, 
  Globe2, 
  Database, 
  Cpu, 
  Cloud, 
  Zap, 
  Search, 
  ShieldCheck, 
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { WhatsappIcon } from "./BrandIcons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SpotlightCard } from "../react-bits";

// --- Dynamic Icon Resolver ---
export const getServiceIcon = (title?: string): LucideIcon => {
  if (!title) return Sparkles;
  const lower = title.toLowerCase();
  if (lower.includes('brand') || lower.includes('ui') || lower.includes('ux') || lower.includes('design') || lower.includes('تصميم') || lower.includes('واجهات') || lower.includes('هوية')) return Palette;
  if (lower.includes('mobile') || lower.includes('app') || lower.includes('flutter') || lower.includes('ios') || lower.includes('android') || lower.includes('موبايل') || lower.includes('هاتف') || lower.includes('تطبيق')) return Smartphone;
  if (lower.includes('web') || lower.includes('front') || lower.includes('fullstack') || lower.includes('site') || lower.includes('ويب') || lower.includes('موقع')) return Globe2;
  if (lower.includes('back') || lower.includes('data') || lower.includes('database') || lower.includes('api') || lower.includes('بيانات') || lower.includes('قواعد') || lower.includes('خلفية') || lower.includes('سيرفر')) return Database;
  if (lower.includes('cloud') || lower.includes('devops') || lower.includes('server') || lower.includes('docker') || lower.includes('سحاب') || lower.includes('سحابة')) return Cloud;
  if (lower.includes('ai') || lower.includes('arch') || lower.includes('system') || lower.includes('soft') || lower.includes('ذكاء') || lower.includes('أنظمة') || lower.includes('هندسة') || lower.includes('برمج')) return Cpu;
  if (lower.includes('seo') || lower.includes('search') || lower.includes('analy') || lower.includes('بحث') || lower.includes('سيو') || lower.includes('تحليل')) return Search;
  if (lower.includes('sec') || lower.includes('test') || lower.includes('audit') || lower.includes('أمان') || lower.includes('حماية') || lower.includes('فحص')) return ShieldCheck;
  if (lower.includes('fast') || lower.includes('perf') || lower.includes('speed') || lower.includes('scale') || lower.includes('سرعة') || lower.includes('أداء')) return Zap;
  return Code2;
};

// --- Service Interface ---
export interface Service {
  id?: string;
  number: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  icon?: React.ElementType;
  gradient?: string;
  whatsappUrl?: string;
}

// Sub-component for individual cards
export const ServiceCard = ({
  service,
  whatsappBaseUrl,
}: {
  service: Service;
  whatsappBaseUrl?: string | null;
}) => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  const title = isAr ? (service.titleAr || service.title) : service.title;
  const description = isAr ? (service.descriptionAr || service.description) : service.description;
  const IconComp = service.icon || getServiceIcon(service.title);

  const inquiryMsg = encodeURIComponent(
    isAr 
      ? `مرحباً يوسف، أود الاستفسار بخصوص خدمة: "${title}".`
      : `Hello Yousef, I'd like to inquire about: "${title}".`
  );
  const waLink = service.whatsappUrl
    ? service.whatsappUrl
    : whatsappBaseUrl
    ? `${whatsappBaseUrl}${whatsappBaseUrl.includes('?') ? '&' : '?'}text=${inquiryMsg}`
    : `https://wa.me/?text=${inquiryMsg}`;

  // Layered surface matching reviews card architecture
  const cardBg = "bg-white/95 dark:bg-zinc-900/60 backdrop-blur-xl";

  return (
    <div className="h-full">
      <SpotlightCard
        spotlightColor="rgba(0, 0, 0, 0.02)"
        darkSpotlightColor="rgba(255, 255, 255, 0.007)"
        size={360}
        darkSize={560}
        className={cn(
          "group relative flex h-[315px] sm:h-[340px] md:h-[355px] lg:h-[370px] w-full flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 border border-zinc-200/90 dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] hover:border-zinc-300 dark:hover:border-white/[0.18] transition-all duration-300 select-none",
          cardBg
        )}
      >
        {/* Upper Group: Icon + Title + Bio (properly grouped and raised directly under icon) */}
        <div className="z-10 flex flex-col items-start w-full">
          {/* Icon */}
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/[0.12] flex items-center justify-center text-foreground shadow-2xs">
            <IconComp className="h-5 w-5 md:h-5.5 md:w-5.5 text-foreground" />
          </div>

          {/* Title & Bio right below icon with deliberate, elegant spacing */}
          <div className="mt-4 sm:mt-5 w-full">
            <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs sm:text-[13.5px] md:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-4">
              {description}
            </p>
          </div>
        </div>

        {/* Lower Group: WhatsApp Inquiry Button pinned at bottom */}
        <div className="z-10 mt-auto pt-3 w-full">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              "w-full justify-between py-2 md:py-2.5 px-3.5 md:px-4 hover:text-foreground dark:hover:text-foreground hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xs group/btn"
            )}
          >
            <span className="flex items-center gap-2">
              <WhatsappIcon size={16} className="text-emerald-500 shrink-0" />
              <span className="text-foreground transition-colors group-hover/btn:text-foreground text-xs sm:text-[13px] md:text-sm">
                {isAr ? 'استفسار واتساب' : 'WhatsApp Inquiry'}
              </span>
            </span>
            <ArrowRight size={13} className="rtl:rotate-180 transition-transform duration-200 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 text-foreground" />
          </a>
        </div>
      </SpotlightCard>
    </div>
  );
};

// --- Scroll-Driven Mandatory Horizontal Carousel ---
export const ServiceCarousel = ({
  services,
  whatsappBaseUrl,
  header,
}: {
  services: Service[];
  whatsappBaseUrl?: string | null;
  header?: React.ReactNode;
}) => {
  const { currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const isRtl = currentDirection === 'rtl' || isAr;

  const trackRef = React.useRef<HTMLDivElement>(null);
  const cardsContainerRef = React.useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = React.useState(0);

  // Mobile Carousel State & Refs
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = React.useState(0);
  const isScrollingRef = React.useRef(false);
  const touchStartXRef = React.useRef<number | null>(null);
  const touchMovedRef = React.useRef(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.85,
  });

  React.useEffect(() => {
    const calcMaxScroll = () => {
      if (cardsContainerRef.current) {
        const scrollW = cardsContainerRef.current.scrollWidth;
        const clientW = window.innerWidth;
        const total = Math.max(0, scrollW - clientW);
        setMaxScroll(total);
      }
    };

    calcMaxScroll();
    window.addEventListener("resize", calcMaxScroll);
    const timer = setTimeout(calcMaxScroll, 350);
    return () => {
      window.removeEventListener("resize", calcMaxScroll);
      clearTimeout(timer);
    };
  }, [services, currentDirection]);

  // Mobile Scroll Active Dot Detection (Smooth, frame-rate safe)
  const handleMobileScroll = () => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    requestAnimationFrame(() => {
      isScrollingRef.current = false;
      const container = mobileScrollRef.current;
      if (!container) return;

      const cardElements = container.querySelectorAll<HTMLElement>('[data-service-card]');
      if (cardElements.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      cardElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveMobileIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
    });
  };

  const scrollToIndex = (index: number) => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const cardElements = container.querySelectorAll<HTMLElement>('[data-service-card]');
    const targetCard = cardElements[index];
    if (!targetCard) return;

    targetCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    setActiveMobileIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchMovedRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && e.touches.length === 1) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
      if (deltaX > 8) {
        touchMovedRef.current = true;
      }
    }
  };

  const handleCardClick = (index: number, e: React.MouseEvent) => {
    if (touchMovedRef.current) return;
    if ((e.target as HTMLElement).closest('a, button')) return;
    scrollToIndex(index);
  };

  React.useEffect(() => {
    setActiveMobileIndex(0);
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentLang]);

  const x = useTransform(smoothProgress, (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    const offset = clamped * maxScroll;
    return isRtl ? `${offset}px` : `-${offset}px`;
  });

  if (!services || services.length === 0) {
    return null;
  }

  // Mandatory horizontal scroll track height: ~45vh per card ensures silky, natural pacing
  const trackHeight = services.length > 1 ? `${100 + services.length * 45}vh` : "auto";

  return (
    <>
      {/* ─── MOBILE & TABLET VIEW (< xl): Tight header spacing + Smooth horizontal touch carousel + Interactive dots + Natural in-flow height ─── */}
      <div className="block xl:hidden w-full py-12 sm:py-14 md:py-16 lg:py-20 overflow-x-clip">
        {/* Header slot directly above cards with compact spacing */}
        {header && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-3 sm:mb-4 md:mb-6">
            {header}
          </div>
        )}

        {/* Horizontal Cards Row: Peeking cards with smooth horizontal scroll and snap support */}
        <div 
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x py-1.5 md:py-2.5"
        >
          <div className="flex gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 items-stretch px-4 sm:px-6 md:px-8">
            {services.map((service, index) => (
              <div
                key={service.id || index}
                data-service-card
                onClick={(e) => handleCardClick(index, e)}
                className="w-[82vw] max-w-[295px] sm:w-[330px] sm:max-w-none md:w-[360px] lg:w-[390px] shrink-0 cursor-pointer active:scale-[0.985] transition-transform duration-200"
              >
                <ServiceCard
                  service={service}
                  whatsappBaseUrl={whatsappBaseUrl}
                />
              </div>
            ))}
            {/* Trailing spacer ensures the last card has identical comfortable margin from screen edge */}
            <div className="w-3 md:w-6 shrink-0 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Dynamic Pagination Dots Indicator on Mobile & Tablet */}
        {services.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
            {services.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={isAr ? `الانتقال إلى الخدمة ${idx + 1}` : `Go to service ${idx + 1}`}
                className="p-1 md:p-1.5 focus:outline-none cursor-pointer"
              >
                <span
                  className={cn(
                    "block h-2 md:h-2.5 rounded-full transition-all duration-300",
                    activeMobileIndex === idx
                      ? "w-6 md:w-8 bg-emerald-500 shadow-xs"
                      : "w-2 md:w-2.5 bg-border dark:bg-white/20 hover:bg-muted-foreground/50"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── DESKTOP ONLY VIEW (>= xl): Cinematic Scroll-Driven Sticky Horizontal Carousel ─── */}
      <div
        ref={trackRef}
        className="hidden xl:block relative w-full overflow-x-clip"
        style={{ height: trackHeight }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-[74px] md:pt-[84px] pb-6 md:pb-10 overflow-x-clip overflow-y-clip [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Header slot pinned inside the sticky viewport */}
          {header && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shrink-0 mb-2 sm:mb-4">
              {header}
            </div>
          )}

          {/* Horizontal Cards Viewport */}
          <div className="w-full flex-1 flex items-center overflow-x-clip overflow-y-clip py-2.5 sm:py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <motion.div
              ref={cardsContainerRef}
              style={{ x }}
              className={cn(
                "flex gap-4 sm:gap-6 items-stretch shrink-0 py-2",
                "ps-4 sm:ps-6 lg:ps-8 xl:ps-[max(2rem,calc((100vw-80rem)/2+2rem))]",
                "pe-4 sm:pe-6 lg:pe-8 xl:pe-[max(2rem,calc((100vw-80rem)/2+2rem))]"
              )}
            >
              {services.map((service, index) => (
                <div
                  key={service.id || index}
                  className="w-[310px] md:w-[330px] lg:w-[350px] shrink-0"
                >
                  <ServiceCard
                    service={service}
                    whatsappBaseUrl={whatsappBaseUrl}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCarousel;
