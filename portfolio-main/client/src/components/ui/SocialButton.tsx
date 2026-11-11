import React from 'react';
import { cn } from '@/lib/utils';

export interface SocialButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Premium, harmonious social button component.
 * - Perfectly balanced in both Light and Dark modes.
 * - Sophisticated micro-lift, emerald ambient glow, and micro-scale icon hover.
 * - Solid proportional sizing for comfortable touch and desktop interaction.
 */
export const SocialButton: React.FC<SocialButtonProps> = ({
  href,
  label,
  icon,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-9 h-9 [&>span>svg]:w-4 [&>span>svg]:h-4'
      : size === 'lg'
      ? 'w-11 h-11 sm:w-12 sm:h-12 [&>span>svg]:w-5 [&>span>svg]:h-5'
      : 'w-10 h-10 sm:w-[42px] sm:h-[42px] [&>span>svg]:w-[18px] [&>span>svg]:h-[18px]';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        // Base shape, flex layout and transition
        "group relative rounded-full flex items-center justify-center shrink-0 cursor-pointer",
        "transition-all duration-200 ease-out select-none",

        // Light Mode styling: crisp white porcelain card with refined slate border & soft shadow
        "bg-white border border-slate-200/90 text-slate-700 shadow-sm",

        // Dark Mode styling: deep obsidian glass card with soft translucent border
        "dark:bg-zinc-900/90 dark:border-white/10 dark:text-zinc-200 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]",
        "backdrop-blur-sm",

        // Light Mode Hover: smooth micro-lift, soft emerald tint, vivid border & diffused glow
        "hover:-translate-y-1 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600",
        "hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)]",

        // Dark Mode Hover: smooth micro-lift, subtle emerald tint & delicate glow
        "dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400",
        "dark:hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)]",

        // Active state
        "active:translate-y-0 active:scale-95",

        sizeClasses,
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 pointer-events-none">
        {icon}
      </span>
    </a>
  );
};

export default SocialButton;

