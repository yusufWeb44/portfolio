import React from 'react';

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({
  children,
  className = '',
  dotClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/40 dark:bg-white/[0.04] backdrop-blur-md mb-4 select-none ${className}`}>
      <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ${dotClassName}`} />
      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </span>
    </div>
  );
};

export default SectionBadge;
