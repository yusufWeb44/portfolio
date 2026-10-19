import React, { useState } from 'react';
import { getTechBrandIcon } from './TechBrandIcons';

export const DEFAULT_CORE_STACK = [
  'HTML',
  'Tailwind CSS',
  'Javascript',
  'Typescript',
  'React.js',
  'Next.js',
  'Node.js',
  'Express.js',
  'React Native',
  'Flutter',
  'Dart',
  'C#',
  'asp.net',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Prisma ORM',
  'REST APIs',
];

interface TechStackMarqueeProps {
  technologies?: string[];
  title?: string;
  speedSeconds?: number;
  className?: string;
}

export const TechStackMarquee: React.FC<TechStackMarqueeProps> = ({
  technologies,
  title,
  speedSeconds = 44,
  className = '',
}) => {
  const stack = technologies && technologies.length > 0 ? technologies : DEFAULT_CORE_STACK;
  const [isItemHovered, setIsItemHovered] = useState(false);

  return (
    <div className={`w-full relative select-none ${className}`}>
      <style>{`
        @keyframes infinite-tech-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-tech-marquee {
          display: flex;
          width: max-content;
          animation: infinite-tech-marquee ${speedSeconds}s linear infinite;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        .marquee-paused,
        .animate-tech-marquee:has(.tech-item:hover) {
          animation-play-state: paused !important;
        }
        .tech-item {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Title Label (CORE STACK) - Website font family, prominent & crisp */}
      {title && (
        <div className="mb-6 sm:mb-8">
          <h3 
            className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-foreground dark:text-zinc-100"
            style={{ fontFamily: 'var(--font-family)' }}
          >
            {title}
          </h3>
        </div>
      )}

      {/* Marquee Wrapper with soft edge gradients */}
      <div 
        className="relative w-full overflow-hidden py-3 sm:py-4"
        onMouseLeave={() => setIsItemHovered(false)}
      >
        {/* Left Fade Gradient Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background via-background/90 to-transparent z-20"
        />

        {/* Right Fade Gradient Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background via-background/90 to-transparent z-20"
        />

        {/* Scrolling Track (No maskImage to avoid disabling font smoothing / blurriness) */}
        <div dir="ltr" className="relative w-full overflow-hidden">
          <div
            className={`animate-tech-marquee flex items-center ${isItemHovered ? 'marquee-paused' : ''}`}
            style={{
              animationPlayState: isItemHovered ? 'paused' : 'running',
            }}
          >
            {[0, 1, 2].map((copyIdx) => (
              <div
                key={copyIdx}
                className="flex items-center gap-10 sm:gap-14 md:gap-16 pr-10 sm:pr-14 md:pr-16 shrink-0"
              >
                {stack.map((tech, techIdx) => (
                  <div
                    key={`${copyIdx}-${techIdx}-${tech}`}
                    onMouseEnter={() => setIsItemHovered(true)}
                    onMouseLeave={() => setIsItemHovered(false)}
                    className="tech-item group/item flex items-center gap-3 sm:gap-3.5 py-2 px-3 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover/item:scale-110 drop-shadow-sm">
                      {getTechBrandIcon(tech, 28)}
                    </span>
                    <span 
                      className="font-sans text-base sm:text-[17px] md:text-lg font-semibold tracking-tight text-foreground dark:text-white whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-family)' }}
                    >
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackMarquee;
