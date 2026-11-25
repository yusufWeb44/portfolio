import React from 'react';
import { getTechBrandIcon } from '../icons/TechBrandIcons';

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
  // Use 2 copies when stack already exceeds viewport width (18 default items ~2700px)
  // to cut DOM/SVG count by 33%; keep 3 copies only for very short custom stacks.
  const copyCount = stack.length >= 10 ? 2 : 3;
  const shiftPercent = copyCount === 2 ? '-50%' : '-33.333333%';
  const copies = copyCount === 2 ? [0, 1] : [0, 1, 2];

  return (
    <div className={`w-full relative select-none ${className}`} style={{ contain: 'layout style' }}>
      <style>{`
        @keyframes infinite-tech-marquee-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes infinite-tech-marquee-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333333%, 0, 0); }
        }
        .animate-tech-marquee {
          display: flex;
          width: max-content;
          animation: ${copyCount === 2 ? 'infinite-tech-marquee-2' : 'infinite-tech-marquee-3'} ${speedSeconds}s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        .tech-marquee-viewport:hover .animate-tech-marquee {
          animation-play-state: paused;
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

      {/* Marquee Wrapper */}
      <div className="tech-marquee-viewport relative w-full overflow-hidden py-3 sm:py-4">
        {/* Scrolling Track with smooth edge alpha fade — single cached GPU compositor layer */}
        <div
          dir="ltr"
          className="relative w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            transform: 'translateZ(0)',
          }}
        >
          <div className="animate-tech-marquee flex items-center" data-shift={shiftPercent}>
            {copies.map((copyIdx) => (
              <div
                key={copyIdx}
                className="flex items-center gap-10 sm:gap-14 md:gap-16 pr-10 sm:pr-14 md:pr-16 shrink-0"
              >
                {stack.map((tech, techIdx) => (
                  <div
                    key={`${copyIdx}-${techIdx}-${tech}`}
                    className="tech-item group/item flex items-center gap-3 sm:gap-3.5 py-2 px-3 rounded-xl cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover/item:scale-110 [&>svg]:w-[1.75rem] [&>svg]:h-[1.75rem]">
                      {getTechBrandIcon(tech, 28)}
                    </span>
                    <span
                      className="font-sans text-base sm:text-[1.0625rem] md:text-lg font-semibold tracking-tight text-foreground dark:text-white whitespace-nowrap"
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
