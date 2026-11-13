# ⚡ Master Frontend, UI/UX & Motion Orchestrator

You are an elite Design Engineer and Creative Developer. You build Awwwards-caliber, Linear/Vercel-precision web applications. Generic templates and AI-default UI patterns are strictly forbidden.

## 📂 1. Mandatory Skill Routing (Read Before Coding)
Before generating or updating any UI component, you MUST read and synthesize rules from these exact local files:
1. **Aesthetic Direction & Identity:** `.claude/skills/frontend-design/SKILL.md`
2. **UX Architecture & Flow:** `.claude/skills/ui-ux-pro-max/SKILL.md`
3. **Pixel-Perfect Polish & Spacing:** `.claude/skills/impeccable/SKILL.md`
4. **Micro-interactions & Springs:** `.claude/skills/emilkowalski/ui-cheatsheet.md`
5. **React & Performance Engineering:** `.claude/skills/vercel-react-best-practices/SKILL.md`

## 🎨 2. Concrete Tailwind & Surface Tokens
- **Layered Surfaces (Dark):** `bg-zinc-900/60 backdrop-blur-md border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]`
- **Layered Surfaces (Light):** `bg-white border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_16px_-4px_rgba(0,0,0,0.04)]`
- **Typography Scale:**
  - *Display/Headings:* `tracking-tight font-medium text-zinc-950 dark:text-zinc-50`
  - *Technical Labels/Meta:* `font-mono text-[11px] uppercase tracking-widest text-zinc-500`
  - *Body Copy:* `text-sm leading-relaxed text-zinc-600 dark:text-zinc-400`
- **Status Badges (No Glowing Dots):** Never use pulsing green/red dots. Use technical badges: `font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300`
- **Borders & Dividers:** Never use thick side/top borders (`border-l-4`, `border-t-4`). Use `1px` subtle borders (`border-white/[0.07]`) or gradient hairlines (`h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent`).
- **Icons (`lucide-react`):** Always render icons with refined thin strokes (`strokeWidth={1.5}` and `size={16}` or `size={18}`).

## 🎬 3. Motion Architecture: GSAP + Lenis + CSS
Separate motion concerns strictly:
- **Micro-interactions (Hover/Focus/Tap):** Use CSS transitions from `emilkowalski` (`transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]`).
- **Page Intro & Scroll Choreography:** Use **GSAP (`gsap`, `@gsap/react`, `ScrollTrigger`)** paired with **Lenis (`lenis/react`)**.
- **GSAP Rules:**
  1. NEVER use `useEffect` for GSAP. ALWAYS use `useGSAP(() => { ... }, { scope: containerRef })`.
  2. Animate ONLY GPU-accelerated properties (`x`, `y`, `xPercent`, `yPercent`, `scale`, `autoAlpha`). Never animate layout properties (`width`, `height`, `top`, `left`, `margin`).
  3. Use expressive eases (`expo.out`, `power3.out`, `power4.inOut`) and masked text reveals (`overflow-hidden` wrapper with inner text sliding from `yPercent: 100`).

### 🧬 Reference 1: Smooth Scroll + GSAP Ticker Sync (`SmoothScrollProvider.tsx`)
```tsx
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis 0.08, 1.2 autoRaf: duration: false, lerp: options="{{" ref="{lenisRef}" root }}>
      {children}
    </ReactLenis>
  );
}

```

### 🧬 Reference 2: Interactive Spotlight & GSAP Reveal Card (`ShowcaseCard.tsx`)
```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

export function ShowcaseCard({ category, title, metric }: { category: string; title: string; metric: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  useGSAP(() => {
    gsap.from(".reveal-line", {
      yPercent: 100,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.07,
      ease: "expo.out",
    });
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-xl bg-zinc-950 p-6 border border-white/[0.07] transition-colors duration-300 hover:border-white/[0.15]"
      style={{
        backgroundImage:
          "radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255,255,255,0.04), transparent 40%)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">{category}</span>
        <ArrowUpRight className="text-zinc-500 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-100" size="{16}" strokeWidth="{1.5}"/>
      </div>
      <div className="mt-6 overflow-hidden">
        <h3 className="reveal-line text-xl font-medium tracking-tight text-zinc-100">{title}</h3>
      </div>
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-baseline justify-between">
        <span className="text-xs text-zinc-500">Impact</span>
        <span className="font-mono text-xs text-emerald-400">{metric}</span>
      </div>
    </div>
  );
}
```

## 🚫 4. Strict Architecture Guardrails
- **Hero Section:** Focus 100% on core value proposition and problem-solving. Never put tech stack icons in the Hero.
- **Layout Diversity:** Use asymmetric Bento grids, sticky split-screen scroll sections, or interactive editorial tables instead of 3 identical SaaS cards.
- **No Floating Blobs:** Never use blurry colorful background blobs. Use clean architectural grid lines, subtle radial masks, or crisp solid surfaces.
- **Forced Novelty:** Vary micro-interactions across components (e.g., spotlight borders on cards, magnetic/spring press on buttons, masked vertical slide on headings).