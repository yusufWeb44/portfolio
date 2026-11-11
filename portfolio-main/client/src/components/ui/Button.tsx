import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Unified, responsive button system with polished hover, transitions, and glow effects.
 */
const buttonVariants = cva(
  [
    "group relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold cursor-pointer select-none overflow-hidden",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98] active:translate-y-0",
    // Interactive gloss light sweep on hover
    "before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary brand button (Solid Emerald with ambient glow and lift)
        primary:
          "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_6px_18px_rgba(16,185,129,0.15)] hover:-translate-y-0.5",
        brand:
          "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_6px_18px_rgba(16,185,129,0.15)] hover:-translate-y-0.5",
        
        // Secondary glass button (Frosted card background with responsive border)
        secondary:
          "bg-card/70 dark:bg-white/[0.04] hover:bg-card/95 dark:hover:bg-white/[0.08] backdrop-blur-md border border-border/80 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 text-foreground hover:text-emerald-500 dark:hover:text-emerald-400 shadow-sm hover:shadow-[0_6px_16px_rgba(16,185,129,0.12)] dark:hover:shadow-none hover:-translate-y-0.5",
        
        // Brand outline (Tinted emerald with full emerald fill on hover)
        "brand-outline":
          "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 dark:text-emerald-400 hover:text-slate-950 dark:hover:text-slate-950 border border-emerald-500/35 hover:border-emerald-500 shadow-xs hover:shadow-[0_6px_16px_rgba(16,185,129,0.20)] dark:hover:shadow-[0_4px_14px_rgba(16,185,129,0.12)] hover:-translate-y-0.5",
        
        // Subtle outline
        outline:
          "border border-border/80 dark:border-white/15 bg-transparent hover:bg-card/60 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 text-muted-foreground hover:-translate-y-0.5",
        
        // Ghost button
        ghost:
          "bg-transparent hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 dark:hover:text-emerald-400 before:hidden",
        
        // Link style
        link:
          "bg-transparent text-emerald-500 hover:text-emerald-400 underline-offset-4 hover:underline p-0 h-auto before:hidden",
        
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:-translate-y-0.5",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:-translate-y-0.5",
      },
      size: {
        // Standard action button (Hero CTA, Contact, etc.) - responsive mobile to desktop
        default: "h-10 sm:h-11 md:h-11.5 px-5 sm:px-6 md:px-7 text-xs sm:text-sm gap-2 sm:gap-2.5",
        md: "h-10 sm:h-11 md:h-11.5 px-5 sm:px-6 md:px-7 text-xs sm:text-sm gap-2 sm:gap-2.5",
        
        // Large action button (Primary bottom CTAs, Explore all)
        lg: "h-11 sm:h-12 md:h-12.5 px-6 sm:px-7 md:px-8 text-xs sm:text-sm md:text-base gap-2.5 sm:gap-3",
        
        // Compact action button (Cards, filters, table buttons)
        sm: "h-9.5 sm:h-10 px-4.5 sm:px-5 text-xs gap-2",
        
        // Circular Icon button (Theme toggle, social icons)
        icon: "h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full shrink-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, cn };
export default Button;
