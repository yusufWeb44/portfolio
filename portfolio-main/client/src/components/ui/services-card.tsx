"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
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

// Shadcn UI Carousel Imports
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

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

// --- Carousel Context ---
type UseEmblaCarouselType = ReturnType<typeof useEmblaCarousel>;
export type CarouselApi = UseEmblaCarouselType[1];
export type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
export type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];
export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};
export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// --- Main Carousel Component ---
export const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

// --- Carousel Content ---
export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// --- Carousel Item ---
export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// --- Carousel Controls ---
export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "h-9 w-9 rounded-full border border-border/70 bg-card/60 hover:bg-card/90 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer transition-colors duration-200",
        className,
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "h-9 w-9 rounded-full border border-border/70 bg-card/60 hover:bg-card/90 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer transition-colors duration-200",
        className,
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

// --- Service Card & Carousel Section ---
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
  index,
  whatsappBaseUrl,
}: {
  service: Service;
  index: number;
  whatsappBaseUrl?: string | null;
}) => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.08,
      },
    },
  };

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

  // Tailored gradient for cards fitting the light mode blue and dark mode emerald identity
  const cardGradients = [
    "from-blue-500/10 via-blue-500/[0.03] to-card dark:from-emerald-500/10 dark:via-white/[0.03] dark:to-white/[0.01]",
    "from-indigo-500/10 via-indigo-500/[0.03] to-card dark:from-teal-500/10 dark:via-white/[0.03] dark:to-white/[0.01]",
    "from-sky-500/10 via-sky-500/[0.03] to-card dark:from-cyan-500/10 dark:via-white/[0.03] dark:to-white/[0.01]",
    "from-blue-600/10 via-blue-600/[0.03] to-card dark:from-indigo-500/10 dark:via-white/[0.03] dark:to-white/[0.01]",
  ];

  const activeGradient = service.gradient || cardGradients[index % cardGradients.length];

  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "group relative flex h-[460px] w-full flex-col justify-between overflow-hidden rounded-3xl p-7 sm:p-8 border border-border/70 bg-gradient-to-b backdrop-blur-xl shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 select-none",
        activeGradient
      )}
    >
      {/* Top Ambient Glow on Hover */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />

      {/* Card Top: Number & Icon */}
      <div className="z-10 flex flex-col items-start text-start w-full">
        <div className="w-full flex items-center justify-between mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-500 uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
            ( {service.number} )
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300" />
        </div>

        <div className="w-12 h-12 rounded-2xl bg-card/80 dark:bg-white/[0.06] border border-border/80 flex items-center justify-center text-foreground group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors duration-200 shadow-inner">
          <IconComp className="h-6 w-6" />
        </div>
      </div>

      {/* Card Bottom: Title, Description & WhatsApp Inquiry CTA */}
      <div className="z-10 flex flex-col gap-4 mt-auto">
        <div>
          <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground group-hover:text-emerald-400 transition-colors duration-200 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* WhatsApp Inquiry Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mt-2 h-11 px-6 rounded-full bg-card/80 dark:bg-white/[0.04] hover:bg-emerald-500 hover:text-slate-950 border border-border/70 hover:border-emerald-500/50 backdrop-blur-md text-foreground text-xs uppercase tracking-wider font-bold inline-flex items-center justify-between transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer group/btn"
        >
          <span className="flex items-center gap-2.5">
            <WhatsappIcon size={17} className="text-emerald-500 group-hover/btn:text-slate-950 transition-colors" />
            <span>{isAr ? 'استفسار واتساب' : 'WhatsApp Inquiry'}</span>
          </span>
          <ArrowRight size={14} className="rtl:rotate-180 text-muted-foreground group-hover/btn:text-slate-950 transition-colors" />
        </a>
      </div>

      {/* Subtle bottom emerald line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/60 transition-all duration-500" />
    </motion.div>
  );
};

// Main exportable component
export const ServiceCarousel = ({
  services,
  whatsappBaseUrl,
}: {
  services: Service[];
  whatsappBaseUrl?: string | null;
}) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div className="w-full">
      <Carousel
        ref={ref}
        opts={{
          align: "start",
          loop: false,
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="relative"
      >
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.08 }}
        >
          <CarouselContent className="-ms-4 sm:-ms-6">
            {services.map((service, index) => (
              <CarouselItem
                key={service.id || index}
                className="ps-4 sm:ps-6 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <ServiceCard
                    service={service}
                    index={index}
                    whatsappBaseUrl={whatsappBaseUrl}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        {/* Carousel Arrow Controls & Drag Helper */}
        <div className="flex items-center justify-between mt-8 px-1">
          <span className="text-xs font-mono text-muted-foreground/70 hidden sm:inline">
            {isRtl ? '← اسحب أفقياً لتصفح الخدمات →' : '← Drag horizontally to explore services →'}
          </span>
          <div className="flex items-center gap-2 ms-auto">
            <CarouselPrevious className="static translate-y-0 bg-card/60 dark:bg-white/[0.04] border-border/80 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200" />
            <CarouselNext className="static translate-y-0 bg-card/60 dark:bg-white/[0.04] border-border/80 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default ServiceCarousel;
