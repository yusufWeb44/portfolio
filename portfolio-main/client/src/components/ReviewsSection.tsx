import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SplitText, BlurText } from './react-bits';
import { FadeContent as FadeIn } from './react-bits';
import { cn } from '../lib/utils';
import { getMediaUrl } from '../utils/mediaUrl';
import { LinkedinIcon, GithubIcon } from './ui/BrandIcons';
import { SocialButton } from './ui/SocialButton';

export interface ReviewItem {
  id: string;
  name: string;
  nameAr?: string | null;
  role: string;
  roleAr?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  content: string;
  contentAr?: string | null;
  order?: number;
  isEnabled?: boolean;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  title,
  subtitle,
}) => {
  const { currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar' || currentDirection === 'rtl';

  const defaultTitle = isAr ? 'ماذا يقول العملاء والشركاء.' : 'What Clients & Partners Say.';
  const defaultSubtitle = isAr
    ? 'شهادات وتجارب حقيقية من مؤسسين وقادة تقنيين تشرفت بالتعاون معهم في بناء وإطلاق مشاريعهم الرقمية.'
    : 'Authentic feedback and endorsements from founders, engineering leads, and product teams I have collaborated with.';

  const displayTitle = title || defaultTitle;
  const displaySubtitle = subtitle || defaultSubtitle;

  // Filter only enabled reviews
  const activeReviews = useMemo(() => {
    return reviews.filter(r => r.isEnabled !== false);
  }, [reviews]);

  // Responsive visible cards count calculation
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setVisibleCount(1);
      } else if (w < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base list guarantees sufficient length for seamless infinite sliding
  const baseList = useMemo(() => {
    if (activeReviews.length === 0) return [];
    let list = [...activeReviews];
    while (list.length < visibleCount + 2) {
      list = [...list, ...activeReviews];
    }
    return list;
  }, [activeReviews, visibleCount]);

  const batchSize = baseList.length;

  // 3 sequential cloned batches: Set 0 (buffer), Set 1 (main active view), Set 2 (forward buffer)
  const displayList = useMemo(() => {
    if (baseList.length === 0) return [];
    return [...baseList, ...baseList, ...baseList];
  }, [baseList]);

  // Initialize in the middle batch
  const [currentIndex, setCurrentIndex] = useState(batchSize || 0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (batchSize > 0) {
      setCurrentIndex(batchSize);
    }
  }, [batchSize]);

  // Auto-play interval timer: continuous one-directional progression according to language
  useEffect(() => {
    if (isPaused || batchSize === 0) return;

    const interval = setInterval(() => {
      setIsTransitionEnabled(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, batchSize]);

  const handleNext = () => {
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Seamless snap reset: when leaving Set 1 into Set 2 or Set 0, silently shift back by batchSize
  const handleAnimationComplete = () => {
    if (currentIndex >= 2 * batchSize) {
      setIsTransitionEnabled(false);
      setCurrentIndex((prev) => prev - batchSize);
    } else if (currentIndex < batchSize) {
      setIsTransitionEnabled(false);
      setCurrentIndex((prev) => prev + batchSize);
    }
  };

  // Re-enable smooth transition after silent teleport
  useEffect(() => {
    if (!isTransitionEnabled) {
      const timer = setTimeout(() => {
        setIsTransitionEnabled(true);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isTransitionEnabled]);

  if (!activeReviews || activeReviews.length === 0) {
    return null;
  }

  // Calculate slide offset percentage
  // In RTL, sliding cards forward means positive horizontal shift
  // In LTR, sliding cards forward means negative horizontal shift
  const cardWidthPercent = 100 / visibleCount;
  const offset = isAr
    ? currentIndex * cardWidthPercent
    : -(currentIndex * cardWidthPercent);

  return (
    <section id="reviews" className="scroll-mt-24 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header (Title & Subtitle) ── */}
        <div className="mb-8 sm:mb-12">
          <FadeIn distance={14}>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-[1.15]">
                <SplitText
                  key={`reviews-title-${isAr ? 'ar' : 'en'}`}
                  text={displayTitle}
                  delay={35}
                  duration={0.45}
                />
              </h2>
              <div className="max-w-2xl mt-1.5">
                <BlurText
                  key={`reviews-sub-${isAr ? 'ar' : 'en'}`}
                  text={displaySubtitle}
                  animateBy="block"
                  delay={20}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed"
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── Continuous Carousel Slider Area with Side Navigation Arrows ── */}
        <div className="relative w-full">
          {/* Side Navigation Arrow: Left (Balanced positioning: neither touching cards nor page edges) */}
          {activeReviews.length > 1 && (
            <button
              type="button"
              onClick={isAr ? handleNext : handlePrev}
              aria-label={isAr ? "التالي" : "Previous review"}
              className="absolute -left-2 sm:-left-5 md:-left-6 lg:-left-7 xl:-left-8 top-[calc(50%+14px)] -translate-y-1/2 z-30 w-7 h-7 rounded-full border border-zinc-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 text-foreground flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <ChevronLeft size={14} strokeWidth={2.2} />
            </button>
          )}

          {/* Side Navigation Arrow: Right (Balanced positioning: neither touching cards nor page edges) */}
          {activeReviews.length > 1 && (
            <button
              type="button"
              onClick={isAr ? handlePrev : handleNext}
              aria-label={isAr ? "السابق" : "Next review"}
              className="absolute -right-2 sm:-right-5 md:-right-6 lg:-right-7 xl:-right-8 top-[calc(50%+14px)] -translate-y-1/2 z-30 w-7 h-7 rounded-full border border-zinc-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 text-foreground flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          )}

          {/* ── Continuous Carousel Slider Viewport ── */}
          <div
            className="relative w-full pt-12 pb-4 overflow-hidden touch-pan-y"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => {
              setIsPaused(true);
              if (e.touches.length === 1) {
                touchStartXRef.current = e.touches[0].clientX;
              }
            }}
            onTouchEnd={(e) => {
              setIsPaused(false);
              if (touchStartXRef.current === null || activeReviews.length <= 1) return;
              const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
              touchStartXRef.current = null;
              if (Math.abs(deltaX) > 40) {
                if (deltaX < 0) {
                  // Swiped left
                  isAr ? handlePrev() : handleNext();
                } else {
                  // Swiped right
                  isAr ? handleNext() : handlePrev();
                }
              }
            }}
          >
          <motion.div
            className="flex items-stretch"
            animate={{
              x: `${offset}%`,
            }}
            transition={
              isTransitionEnabled
                ? { duration: 0.65, ease: [0.25, 1, 0.5, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={handleAnimationComplete}
          >
            {displayList.map((review, index) => {
              const nameText = isAr ? (review.nameAr || review.name) : review.name;
              const roleText = isAr ? (review.roleAr || review.role) : review.role;
              const reviewText = isAr ? (review.contentAr || review.content) : review.content;
              const initialLetter = nameText?.trim()?.[0]?.toUpperCase() || 'U';

              return (
                <div
                  key={`${review.id || 'rev'}-${index}`}
                  className="px-2.5 sm:px-3 flex-shrink-0 flex flex-col"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  {/* Card Container */}
                  <div
                    className={cn(
                      "group relative h-full flex flex-col justify-between rounded-2xl p-6 sm:p-7 pt-12 sm:pt-14",
                      "bg-white/95 dark:bg-zinc-900/60 backdrop-blur-xl",
                      "border border-zinc-200/90 dark:border-white/[0.08]",
                      "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]",
                      "hover:border-zinc-300 dark:hover:border-white/[0.18] transition-all duration-300",
                      "hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_20px_40px_-12px_rgba(0,0,0,0.5)]"
                    )}
                  >
                    {/* Top Floating Circular Avatar (Centered with flex inset-x-0, zero transform conflicts) */}
                    <div className="absolute -top-10 sm:-top-11 inset-x-0 flex justify-center z-20 pointer-events-none">
                      <div className="relative w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full p-1 bg-background shadow-md transition-transform duration-300 ease-out group-hover:scale-105">
                        {review.avatarUrl ? (
                          <img
                            src={getMediaUrl(review.avatarUrl)}
                            alt={nameText}
                            className="w-full h-full rounded-full object-cover bg-muted pointer-events-none select-none"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback on image load error
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.avatar-fallback');
                                if (fallback) (fallback as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={cn(
                            "avatar-fallback w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl flex items-center justify-center select-none pointer-events-none",
                            review.avatarUrl ? 'hidden' : 'flex'
                          )}
                        >
                          {initialLetter}
                        </div>
                      </div>
                    </div>

                    {/* Quotation Watermark Top Corner */}
                    <div className="absolute top-4 end-4 text-zinc-300/40 dark:text-white/[0.06] pointer-events-none">
                      <Quote size={28} className="rotate-180" />
                    </div>

                    {/* Person Identity Header (Role with neutral dot, no company, no green) */}
                    <div className="text-center mt-2 w-full select-text">
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug select-text">
                        {nameText}
                      </h3>
                      <p className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1 select-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0 inline-block" />
                        <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase select-text">
                          {roleText}
                        </span>
                      </p>
                    </div>

                    {/* Review Body Text (Clear, readable, comfortable line height, fully selectable & copyable) */}
                    <div className="mt-4 flex-1 flex items-center justify-center select-text">
                      <p className="text-xs sm:text-[13.5px] text-slate-600 dark:text-zinc-300 leading-relaxed text-center italic line-clamp-6 select-text cursor-text">
                        "{reviewText}"
                      </p>
                    </div>

                    {/* Circular Social Buttons (LinkedIn & GitHub) matching Contact & Footer */}
                    {(review.linkedinUrl || review.githubUrl) && (
                      <div className="mt-5 pt-3.5 border-t border-border/40 flex items-center justify-center gap-2.5 min-h-[46px]">
                        {review.linkedinUrl && (
                          <SocialButton
                            href={review.linkedinUrl}
                            label={`${nameText} LinkedIn`}
                            icon={<LinkedinIcon size={16} />}
                            size="sm"
                          />
                        )}
                        {review.githubUrl && (
                          <SocialButton
                            href={review.githubUrl}
                            label={`${nameText} GitHub`}
                            icon={<GithubIcon size={16} />}
                            size="sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

        {/* ── Dynamic Pagination Dots Indicator ── */}
        {activeReviews.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {activeReviews.map((_, idx) => {
              const activeDotIndex = ((currentIndex % activeReviews.length) + activeReviews.length) % activeReviews.length;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsTransitionEnabled(true);
                    const currentBatchBase = Math.floor(currentIndex / activeReviews.length) * activeReviews.length;
                    setCurrentIndex(currentBatchBase + idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus:outline-none",
                    activeDotIndex === idx
                      ? "w-6 bg-emerald-500"
                      : "w-2 bg-border hover:bg-muted-foreground/50"
                  )}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;
