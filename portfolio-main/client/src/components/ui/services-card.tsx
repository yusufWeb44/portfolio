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

  // Crisp, high-contrast solid card surface with zero blur filter
  const cardBg = "bg-white dark:bg-[#121417]";

  return (
    <div className="h-full">
      <SpotlightCard
        spotlightColor="rgba(0, 0, 0, 0.02)"
        darkSpotlightColor="rgba(255, 255, 255, 0.03)"
        size={280}
        darkSize={200}
        className={cn(
          "group relative flex h-[360px] sm:h-[375px] w-full flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/[0.09] shadow-xs hover:border-slate-300 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 select-none",
          cardBg
        )}
      >
        {/* Upper Group: Icon + Title + Bio (properly grouped and raised directly under icon) */}
        <div className="z-10 flex flex-col items-start w-full">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/[0.12] flex items-center justify-center text-foreground shadow-2xs">
            <IconComp className="h-5 w-5 text-foreground" />
          </div>

          {/* Title & Bio right below icon with deliberate, elegant spacing */}
          <div className="mt-4 sm:mt-5 w-full">
            <h3 className="mb-2 text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs sm:text-[13.5px] text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-4">
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
              "w-full justify-between py-2 px-3.5 hover:text-foreground dark:hover:text-foreground hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xs group/btn"
            )}
          >
            <span className="flex items-center gap-2">
              <WhatsappIcon size={16} className="text-emerald-500 shrink-0" />
              <span className="text-foreground transition-colors group-hover/btn:text-foreground text-xs sm:text-[13px]">
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
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';

  const trackRef = React.useRef<HTMLDivElement>(null);
  const cardsContainerRef = React.useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = React.useState(0);

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
    <div
      ref={trackRef}
      className="relative w-full overflow-x-clip"
      style={{ height: trackHeight }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-start pt-[68px] sm:pt-[74px] pb-4 overflow-x-clip overflow-y-visible">
        {/* Optional Header slot (Title + Subtitle) pinned inside the sticky viewport */}
        {header && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shrink-0 mb-2 sm:mb-3">
            {header}
          </div>
        )}

        {/* Horizontal Cards Viewport (generous vertical clearance so borders and buttons never clip) */}
        <div className="w-full flex-1 flex items-center overflow-x-hidden overflow-y-visible py-3 sm:py-5">
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
                className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
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
  );
};

export default ServiceCarousel;
