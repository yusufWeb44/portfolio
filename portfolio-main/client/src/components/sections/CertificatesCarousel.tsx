import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getMediaUrl } from '../../utils/mediaUrl';
import { useIsMobile } from '../../hooks/useIsMobile';
import { cn } from '../../lib/utils';

export interface CertificateItem {
  id: string;
  title: string;
  titleAr?: string | null;
  issuer: string;
  issuerAr?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  skills?: string | null;
  skillsAr?: string | null;
  order?: number;
}

interface CertificatesCarouselProps {
  certificates: CertificateItem[];
  title?: string | null;
  subtitle?: string | null;
}

export const CertificatesCarousel: React.FC<CertificatesCarouselProps> = ({
  certificates,
  title,
  subtitle,
}) => {
  const { currentLang, currentDirection } = useLanguage();
  const isRtl = currentDirection === 'rtl' || currentLang === 'ar';

  const defaultTitle = isRtl ? 'الشهادات والمؤهلات' : 'CERTIFICATES';
  const defaultSubtitle = isRtl
    ? 'مؤهلات وشهادات معتمدة توثق الكفاءة التقنية والإنجازات الأكاديمية.'
    : 'Recognized industry credentials, academic achievements, and verified technical licenses.';

  const displayTitle = title || defaultTitle;
  const displaySubtitle = subtitle || defaultSubtitle;

  // Lightbox Modal state
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const isMobile = useIsMobile();

  // Mobile-only auto-flipping carousel state & touch tracking
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Auto-flip timer for mobile: flips to the next certificate periodically ("كل فترة يقلب على وحدة")
  useEffect(() => {
    if (!isMobile || certificates.length <= 1 || isMobilePaused || selectedCert !== null) return;

    const interval = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % certificates.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isMobile, certificates.length, isMobilePaused, selectedCert]);

  const handleMobileTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      setIsMobilePaused(true);
    }
  };

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    setIsMobilePaused(false);
    if (touchStartXRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartYRef.current || 0);
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left
        if (isRtl) {
          setActiveMobileIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
        } else {
          setActiveMobileIndex((prev) => (prev + 1) % certificates.length);
        }
      } else {
        // Swiped right
        if (isRtl) {
          setActiveMobileIndex((prev) => (prev + 1) % certificates.length);
        } else {
          setActiveMobileIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
        }
      }
    }
  };

  const handlePrevMobile = () => {
    setActiveMobileIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const handleNextMobile = () => {
    setActiveMobileIndex((prev) => (prev + 1) % certificates.length);
  };

  // Wheel rotation angle in degrees
  const [rotationAngle, setRotationAngle] = useState(0);

  // Track window width for responsive layout
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive 3D Curved Cylinder configuration (calibrated for optimal desktop and mobile proportions)
  const layout = useMemo(() => {
    const isLg = windowWidth >= 1400;
    const isMd = windowWidth >= 1024 && windowWidth < 1400;
    const isSm = windowWidth >= 640 && windowWidth < 1024;
    const isXs = windowWidth >= 480 && windowWidth < 640;

    // Mobile-optimized card dimensions:
    // On mobile (< 480px), scaled to ~185-200px so the carousel looks balanced,
    // neighboring certificates curve gracefully into view, and it doesn't overpower the viewport.
    const cardWidth = isLg
      ? 410
      : (isMd ? 360 : (isSm ? 285 : (isXs ? 230 : (windowWidth < 380 ? 185 : 200))));
    const cardHeight = cardWidth / 1.414;
    const angleStep = isLg ? 22.0 : (isMd ? 22.5 : (isSm ? 23.0 : (isXs ? 24.0 : 25.0)));
    const gap = isLg ? 26 : (isMd ? 22 : (isSm ? 18 : (isXs ? 14 : 11)));

    // Calibrated horizontal curve radius so adjacent cards maintain a crisp uniform gap without stretching
    const stepRad = (angleStep * 0.6 * Math.PI) / 180;
    const arcRadius = Math.round((cardWidth * 0.95 + gap) / Math.sin(stepRad));

    // Local 3D perspective per card: creates the 3D concave curve without wide-angle horizontal stretching
    const perspective = Math.round(cardWidth * 2.4);

    // Vertical bleed buffer so 3D-tilted outer card corners and shadows never clip at top or bottom,
    // paired with equal negative margins so section spacing remains 100% unchanged
    const bleed = isLg ? 75 : (isMd ? 65 : (isSm ? 48 : 32));
    const topBaseline = (isLg ? 16 : (isMd ? 14 : (isSm ? 10 : 8))) + bleed;
    const bottomClearance = (isLg ? 36 : (isMd ? 30 : (isSm ? 22 : 16))) + bleed;
    const containerHeight = Math.round(topBaseline + cardHeight + bottomClearance);

    const sharpThreshold = isLg ? 46 : (isMd ? 44 : (isSm ? 40 : 36));
    const fadeEnd = isLg ? 58 : (isMd ? 56 : (isSm ? 50 : 48));

    return {
      cardWidth,
      arcRadius,
      perspective,
      angleStep,
      bleed,
      topBaseline,
      containerHeight,
      sharpThreshold,
      fadeEnd,
    };
  }, [windowWidth]);

  // Drag and click tracking refs
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; angle: number; time: number; moved: boolean }>({
    x: 0,
    y: 0,
    angle: 0,
    time: 0,
    moved: false,
  });
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Keep a repeating list of certificates so the wheel has enough slots for full coverage
  const wheelItems = useMemo(() => {
    if (!certificates || certificates.length === 0) return [];

    let list: CertificateItem[] = [...certificates];
    while (list.length < 12) {
      list = [...list, ...certificates];
    }
    return list;
  }, [certificates]);

  // totalPeriod based on exact angleStep so spacing between adjacent cards never gets compressed
  const totalPeriod = wheelItems.length * layout.angleStep;

  // Track visibility with IntersectionObserver so continuous loop only runs when in viewport
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!carouselContainerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px' }
    );
    observer.observe(carouselContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Continuous auto-rotation loop for desktop 3D cylinder (disabled on mobile)
  useEffect(() => {
    if (isMobile || wheelItems.length === 0 || !isInView) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Handle drag inertia and continuous smooth auto-rotation
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.005) {
          velocityRef.current *= 0.94;
          setRotationAngle((prev) => (prev + velocityRef.current) % totalPeriod);
        } else {
          velocityRef.current = 0;
          // Smooth continuous rotation speed (~0.03 deg/frame for gentle waterwheel gliding)
          const autoSpeed = 0.03 * (delta / 16.6);
          setRotationAngle((prev) => (prev + autoSpeed) % totalPeriod);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isMobile, wheelItems.length, totalPeriod, isInView]);

  // Global drag cancellation and modal synchronization
  useEffect(() => {
    const cancelDrag = () => {
      isDraggingRef.current = false;
      dragStartRef.current.moved = false;
    };

    window.addEventListener('pointerup', cancelDrag);
    window.addEventListener('pointercancel', cancelDrag);
    window.addEventListener('blur', cancelDrag);

    return () => {
      window.removeEventListener('pointerup', cancelDrag);
      window.removeEventListener('pointercancel', cancelDrag);
      window.removeEventListener('blur', cancelDrag);
    };
  }, []);

  // Ensure drag state is completely cleared whenever modal opens or closes
  useEffect(() => {
    isDraggingRef.current = false;
    velocityRef.current = 0;
    dragStartRef.current.moved = false;
  }, [selectedCert]);

  // Pointer event handlers for container drag
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on primary mouse button (allow all touch/pen pointers)
    if (e.pointerType === 'mouse' && e.button !== 0 && e.buttons !== 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      angle: rotationAngle,
      time: performance.now(),
      moved: false,
    };
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // If mouse pointer has no button held down, immediately cancel any active drag state
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      isDraggingRef.current = false;
      dragStartRef.current.moved = false;
      return;
    }
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.hypot(dx, dy) > 8) {
      dragStartRef.current.moved = true;
    }

    if (dragStartRef.current.moved) {
      const angleDelta = (dx / (windowWidth || 1400)) * 85;
      setRotationAngle((dragStartRef.current.angle + angleDelta) % totalPeriod);

      const now = performance.now();
      const dt = Math.max(1, now - dragStartRef.current.time);
      velocityRef.current = (angleDelta / dt) * 10;
      dragStartRef.current.time = now;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragStartRef.current.moved = false;
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-4 pb-2 relative select-none overflow-x-clip">

      {/* ── Section Header (Title & Subtitle placed at top of certificates, centered) ── */}
      <div className="relative z-20 max-w-3xl mx-auto px-4 text-center mb-4 sm:mb-8 md:mb-10 pointer-events-none">
        <h2
          className={
            isRtl
              ? "text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground select-none"
              : "text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-extrabold uppercase tracking-widest text-foreground select-none"
          }
        >
          {displayTitle}
        </h2>
        {displaySubtitle && (
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto select-none">
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* ── MOBILE VIEW (< md): Large Pure Certificate Image Showcase with periodic auto-transition ── */}
      <div className="block md:hidden w-full px-3 sm:px-4 pt-1 pb-6">
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="relative w-full overflow-hidden"
          onTouchStart={handleMobileTouchStart}
          onTouchEnd={handleMobileTouchEnd}
          onMouseEnter={() => setIsMobilePaused(true)}
          onMouseLeave={() => setIsMobilePaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              transform: isRtl
                ? `translateX(${activeMobileIndex * 100}%)`
                : `translateX(-${activeMobileIndex * 100}%)`,
            }}
          >
            {certificates.map((cert, index) => {
              const certTitle = isRtl ? (cert.titleAr || cert.title) : cert.title;
              const certIssuer = isRtl ? (cert.issuerAr || cert.issuer) : cert.issuer;
              const imgSrc = getMediaUrl(cert.imageUrl || cert.credentialUrl);

              return (
                <div
                  key={`${cert.id || index}-mob`}
                  className="w-full shrink-0 px-1 py-1"
                >
                  <div className="w-full max-w-[94vw] sm:max-w-[480px] mx-auto">
                    {/* Pure Large Certificate Image (Sharp Edges, No Border Radius, Focus 100% on Certificate) */}
                    <div
                      onClick={() => setSelectedCert(cert)}
                      className="group relative w-full aspect-[1.414/1] rounded-none overflow-hidden border border-zinc-200/90 dark:border-white/15 bg-white dark:bg-zinc-950 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-pointer active:scale-[0.99] transition-transform duration-200"
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={certTitle}
                          className="w-full h-full object-contain bg-zinc-950 select-none pointer-events-none"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white text-center">
                          <Award className="w-16 h-16 text-amber-400 mb-3" />
                          <h4 className="font-bold text-lg">{certTitle}</h4>
                          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest mt-1">{certIssuer}</span>
                        </div>
                      )}

                      {/* Floating Full-Screen Zoom Button Overlay */}
                      <div className="absolute bottom-3 end-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 shadow-lg border border-white/20 pointer-events-none select-none">
                        <Maximize2 size={13} className="text-emerald-400" />
                        <span>{isRtl ? 'تكبير' : 'Zoom'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Controls: Prev/Next & Dots (Zero Numbers) */}
        {certificates.length > 1 && (
          <div className="flex items-center justify-between max-w-[94vw] sm:max-w-[480px] mx-auto mt-4 px-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={isRtl ? handleNextMobile : handlePrevMobile}
              className="w-9 h-9 rounded-full border border-border/80 dark:border-white/15 bg-card/80 dark:bg-zinc-900/80 text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs hover:border-emerald-500/50"
              aria-label={isRtl ? 'السابق' : 'Previous'}
            >
              {isRtl ? <ChevronRight size={18} strokeWidth={1.5} /> : <ChevronLeft size={18} strokeWidth={1.5} />}
            </button>

            {/* Pagination Line Dots (Zero numbers displayed) */}
            <div className="flex items-center gap-1.5">
              {certificates.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMobileIndex(idx)}
                  aria-label={isRtl ? 'شهادة' : 'Certificate'}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      activeMobileIndex === idx
                        ? "w-6 bg-emerald-500 shadow-xs"
                        : "w-1.5 bg-border dark:bg-white/20 hover:bg-muted-foreground/50"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={isRtl ? handlePrevMobile : handleNextMobile}
              className="w-9 h-9 rounded-full border border-border/80 dark:border-white/15 bg-card/80 dark:bg-zinc-900/80 text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs hover:border-emerald-500/50"
              aria-label={isRtl ? 'التالي' : 'Next'}
            >
              {isRtl ? <ChevronLeft size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
            </button>
          </div>
        )}
      </div>

      {/* ── DESKTOP & TABLET VIEW (>= md): 3D Curved Panoramic Stage ── */}
      <div
        ref={carouselContainerRef}
        style={{
          height: `${layout.containerHeight}px`,
          marginTop: `-${layout.bleed}px`,
          marginBottom: `-${layout.bleed}px`,
        }}
        className="hidden md:flex relative w-full overflow-visible items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* ── 3D Curved Cylinder Cards ── */}
        <div className="relative w-full h-full pointer-events-none">
          {wheelItems.map((cert, index) => {
            // Calculate card angular position along the periodic cylinder
            const rawAngle = (rotationAngle + index * layout.angleStep) % totalPeriod;
            const angle = rawAngle > totalPeriod / 2
              ? rawAngle - totalPeriod
              : (rawAngle < -totalPeriod / 2 ? rawAngle + totalPeriod : rawAngle);
            const absAngle = Math.abs(angle);

            // Only render cards up to layout.fadeEnd
            if (absAngle > layout.fadeEnd) {
              return null;
            }

            // 3D Concave Cylinder Math (distortion-free):
            // Horizontal position is applied before local perspective so side cards never stretch horizontally
            const rad = (angle * Math.PI) / 180;
            const xOffset = Math.sin(rad * 0.6) * layout.arcRadius;
            const zOffset = (1 - Math.cos(rad)) * layout.perspective * 0.68;

            // Visual parameters:
            // Sharp across the cylinder, smoothly fading out with opacity at the viewport edges
            let opacity = 1.0;
            let scale = 1.0;

            if (absAngle <= layout.sharpThreshold) {
              opacity = 1.0;
              scale = 1.0;
            } else {
              const t = Math.min(1, Math.max(0, (absAngle - layout.sharpThreshold) / (layout.fadeEnd - layout.sharpThreshold)));
              opacity = Math.cos((t * Math.PI) / 2);
              scale = 1.0 - t * 0.03;
            }

            // Depth stacking: scoped between 1 and 30 so in-cylinder cards stack correctly without exceeding the fixed header (z-50)
            const zIndex = Math.round(30 - absAngle * 0.4);
            const imgSrc = getMediaUrl(cert.imageUrl || cert.credentialUrl);

            return (
              <div
                key={`${cert.id}-${index}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${layout.topBaseline}px`,
                  marginLeft: `${-layout.cardWidth / 2}px`,
                  transform: `translate3d(${xOffset}px, 0px, 0px) perspective(${layout.perspective}px) translateZ(${zOffset}px) rotateY(${-angle}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                  opacity,
                  zIndex,
                  width: `${layout.cardWidth}px`,
                  transition: isDraggingRef.current ? 'none' : 'opacity 0.15s ease',
                }}
                className="aspect-[1.41/1] pointer-events-auto"
              >
                <div
                  onPointerUp={(e) => {
                    isDraggingRef.current = false;
                    if (!dragStartRef.current.moved) {
                      e.stopPropagation();
                      dragStartRef.current.moved = false;
                      velocityRef.current = 0;
                      setSelectedCert(cert);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isDraggingRef.current = false;
                    if (!dragStartRef.current.moved) {
                      dragStartRef.current.moved = false;
                      velocityRef.current = 0;
                      setSelectedCert(cert);
                    }
                  }}
                  className="w-full h-full rounded-none bg-white dark:bg-zinc-900 border-[1.5px] sm:border-[2px] border-neutral-200/80 dark:border-white/20 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.1),0_2px_8px_-2px_rgba(15,23,42,0.05)] sm:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.85)] sm:dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-neutral-400/60 dark:hover:border-white/40 hover:shadow-[0_14px_32px_-4px_rgba(15,23,42,0.16),0_6px_16px_-2px_rgba(15,23,42,0.08)] dark:hover:shadow-none"
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={cert.title}
                      width={380}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-zinc-950 text-white">
                      <div className="flex items-center justify-between">
                        <Award className="w-8 h-8 text-amber-400" />
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                          {cert.issueDate || 'VERIFIED'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
                          {isRtl ? (cert.issuerAr || cert.issuer) : cert.issuer}
                        </p>
                        <h4 className="font-bold text-base sm:text-lg leading-tight line-clamp-2">
                          {isRtl ? (cert.titleAr || cert.title) : cert.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{cert.credentialId || 'ID: Official'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PURE LARGE CERTIFICATE VIEW (No container, no extra headers, X on top-right)
      ═══════════════════════════════════════════════════════════════ */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999999] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
              onClick={() => setSelectedCert(null)}
            >
              {/* Prominent Close Button at top-right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCert(null);
                }}
                className="fixed top-5 right-5 sm:top-8 sm:right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-xl"
                aria-label="Close certificate preview"
              >
                <X size={26} />
              </button>

              {/* Pure Large Certificate Image (No modal box/container) */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-[94vw] max-h-[90vh] flex items-center justify-center cursor-default select-none"
              >
                {selectedCert.imageUrl || selectedCert.credentialUrl ? (
                  <img
                    src={getMediaUrl(selectedCert.imageUrl || selectedCert.credentialUrl)}
                    alt={selectedCert.title}
                    className="max-w-[94vw] max-h-[88vh] object-contain rounded-none shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/20"
                  />
                ) : (
                  <div className="w-[600px] max-w-[90vw] aspect-[1.41/1] rounded-none bg-zinc-900 border border-white/20 flex flex-col items-center justify-center p-8 text-center text-white shadow-2xl">
                    <Award className="w-20 h-20 text-amber-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      {isRtl ? (selectedCert.titleAr || selectedCert.title) : selectedCert.title}
                    </h3>
                    <p className="text-sm text-emerald-400 font-mono">
                      {isRtl ? (selectedCert.issuerAr || selectedCert.issuer) : selectedCert.issuer}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default CertificatesCarousel;
