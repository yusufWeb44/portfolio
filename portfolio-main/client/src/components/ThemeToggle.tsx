import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from './ui/Button';

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  iconSize?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className,
  iconSize = 16,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        "relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200",
        "bg-card/70 dark:bg-white/[0.05] border-border/70 hover:border-emerald-500/50",
        "text-muted-foreground hover:text-foreground",
        "hover:shadow-[0_0_14px_hsl(var(--emerald-500)/0.25)] cursor-pointer overflow-hidden select-none",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center text-amber-400 dark:text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          >
            <Sun size={iconSize} className="stroke-[2.2]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center text-slate-700 dark:text-slate-300 drop-shadow-[0_0_8px_rgba(100,116,139,0.35)]"
          >
            <Moon size={iconSize} className="stroke-[2.2]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
