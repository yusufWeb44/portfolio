import React from 'react';
import { getTechBrandIcon } from './TechBrandIcons';

/* ─── Name Formatter for Display ─────────────────────────────────── */
export function formatSkillName(name: string): string {
  const map: Record<string, string> = {
    javascript: 'Javascript',
    typescript: 'Typescript',
    'next.js': 'NextJS',
    nextjs: 'NextJS',
    react: 'React',
    css: 'CSS',
    html: 'HTML',
    'drizzle orm': 'Drizzle ORM',
    drizzle: 'Drizzle ORM',
    graphql: 'GraphQL',
    postgresql: 'PostgreSQL',
    postgres: 'PostgreSQL',
    'tailwind css': 'Tailwind CSS',
    tailwind: 'Tailwind CSS',
    'node.js': 'Node.js',
    nodejs: 'Node.js',
    express: 'Express',
    mongodb: 'MongoDB',
    mysql: 'MySQL',
    docker: 'Docker',
    'git & github': 'Git & GitHub',
    git: 'Git',
    'prisma orm': 'Prisma ORM',
    prisma: 'Prisma ORM',
    flutter: 'Flutter',
    dart: 'Dart',
    figma: 'Figma',
    'asp.net': 'ASP.NET',
    java: 'Java',
    'rest apis': 'REST APIs',
    'database design': 'Database Design',
    oop: 'OOP',
    'data structure & algorithm': 'Data Structures',
    'prompt engineering': 'Prompt Engineering',
    seo: 'SEO',
  };
  const key = (name || '').trim().toLowerCase();
  return map[key] || name;
}

/* ─── Authentic Brand Badges / SVG Icons (Official Vectors) ─────────── */
export const SkillBrandIcon: React.FC<{
  name: string;
  size?: number;
  className?: string;
}> = ({ name, size = 22, className = '' }) => {
  return (
    <div className={`shrink-0 flex items-center justify-center ${className}`}>
      {getTechBrandIcon(name, size)}
    </div>
  );
};

/* ─── Individual Capsule / Pill Component ("البويضة") ─────────────── */
export interface SkillPillProps {
  skill?: {
    label: string;
    originalName?: string;
    description?: string;
  };
  label?: string;
  originalName?: string;
  description?: string;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SkillPill: React.FC<SkillPillProps> = ({
  skill,
  label,
  originalName,
  description,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const itemLabel = skill?.label || label || '';
  const itemOriginalName = skill?.originalName || originalName || itemLabel;
  const itemDescription = skill?.description || description;
  const displayName = formatSkillName(itemLabel);

  return (
    <div
      title={itemDescription}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`group/pill inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full border-2 border-neutral-900/90 dark:border-white/80 bg-white dark:bg-[#0c0d0e] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.05)] hover:border-emerald-500 dark:hover:border-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer select-none shrink-0 ${className}`}
    >
      <span
        style={{ fontFamily: "'Lora', Georgia, serif" }}
        className="italic font-normal text-base sm:text-lg md:text-xl text-neutral-900 dark:text-neutral-100 whitespace-nowrap leading-none"
      >
        {displayName}
      </span>
      <SkillBrandIcon name={itemOriginalName} size={22} />
    </div>
  );
};
