/**
 * Comprehensive Dynamic Theme Engine
 * Controls visual identity, color palettes, ambient glowing auras, CSS variables, and dark/light modes.
 */

export interface ThemePalette {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
  bgClass: string;
  primary: string; // HSL (without hsl(...) wrapper)
  accent: string;
  ring: string;
  shades: Record<number, string>;
  lightPrimary: string;
  lightAccent: string;
  lightRing: string;
  lightShades: Record<number, string>;
  auras: {
    orb1: string;
    orb2: string;
    orb3: string;
    orb4: string;
  };
}

export const THEME_PALETTES: Record<string, ThemePalette> = {
  red: {
    id: 'red',
    name: 'Ruby Crimson (أحمر قرمزي)',
    nameAr: 'أحمر قرمزي',
    hex: '#ef4444',
    bgClass: 'bg-red-500',
    primary: '0 84% 60%',
    accent: '0 84% 60%',
    ring: '0 84% 60%',
    shades: {
      50: '0 86% 97%',
      100: '0 93% 94%',
      200: '0 96% 89%',
      300: '0 94% 82%',
      400: '0 91% 71%',
      500: '0 84% 60%',
      600: '0 72% 51%',
      700: '0 74% 42%',
      800: '0 70% 35%',
      900: '0 63% 31%',
      950: '0 75% 15%',
    },
    lightPrimary: '0 84% 50%',
    lightAccent: '0 84% 50%',
    lightRing: '0 84% 50%',
    lightShades: {
      50: '0 86% 97%',
      100: '0 93% 94%',
      200: '0 96% 89%',
      300: '0 94% 80%',
      400: '0 80% 46%',
      500: '0 84% 52%',
      600: '0 75% 44%',
      700: '0 75% 36%',
      800: '0 70% 28%',
      900: '0 63% 20%',
      950: '0 75% 12%',
    },
    auras: {
      orb1: 'from-red-500/15 via-rose-500/5 to-transparent dark:from-red-500/12 dark:via-red-500/[0.03]',
      orb2: 'from-rose-500/12 via-orange-500/5 to-transparent dark:from-rose-500/10 dark:via-orange-500/[0.02]',
      orb3: 'from-red-600/15 via-red-500/5 to-transparent dark:from-red-600/12 dark:via-red-500/[0.03]',
      orb4: 'bg-red-500/12 dark:bg-red-500/[0.06]',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Terminal Emerald (أخضر زمردي)',
    nameAr: 'أخضر زمردي',
    hex: '#10b981',
    bgClass: 'bg-emerald-500',
    primary: '160 84% 39%',
    accent: '160 84% 39%',
    ring: '160 84% 39%',
    shades: {
      50: '152 76% 96%',
      100: '149 80% 90%',
      200: '152 76% 80%',
      300: '156 72% 67%',
      400: '158 64% 52%',
      500: '160 84% 39%',
      600: '161 94% 30%',
      700: '163 88% 23%',
      800: '163 79% 19%',
      900: '164 74% 16%',
      950: '166 87% 8%',
    },
    lightPrimary: '160 84% 36%',
    lightAccent: '160 84% 36%',
    lightRing: '160 84% 36%',
    lightShades: {
      50: '152 76% 96%',
      100: '149 80% 90%',
      200: '152 76% 80%',
      300: '156 72% 67%',
      400: '161 84% 34%',
      500: '160 84% 39%',
      600: '161 94% 30%',
      700: '163 88% 23%',
      800: '163 79% 18%',
      900: '164 74% 14%',
      950: '166 87% 8%',
    },
    auras: {
      orb1: 'from-emerald-500/15 via-teal-500/5 to-transparent dark:from-emerald-500/10 dark:via-emerald-500/[0.03]',
      orb2: 'from-teal-500/12 via-cyan-500/5 to-transparent dark:from-teal-500/8 dark:via-cyan-500/[0.02]',
      orb3: 'from-emerald-600/15 via-emerald-500/5 to-transparent dark:from-emerald-600/10 dark:via-emerald-500/[0.03]',
      orb4: 'bg-emerald-500/10 dark:bg-emerald-500/[0.05]',
    },
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Cobalt (أزرق ملكي)',
    nameAr: 'أزرق ملكي',
    hex: '#3b82f6',
    bgClass: 'bg-blue-500',
    primary: '221 83% 53%',
    accent: '221 83% 53%',
    ring: '221 83% 53%',
    shades: {
      50: '214 100% 97%',
      100: '214 95% 93%',
      200: '213 97% 87%',
      300: '212 96% 78%',
      400: '217 91% 60%',
      500: '221 83% 53%',
      600: '224 76% 48%',
      700: '226 71% 40%',
      800: '224 64% 33%',
      900: '226 55% 23%',
      950: '224 71% 14%',
    },
    lightPrimary: '221 83% 50%',
    lightAccent: '221 83% 50%',
    lightRing: '221 83% 50%',
    lightShades: {
      50: '214 100% 97%',
      100: '214 95% 93%',
      200: '213 97% 87%',
      300: '212 96% 78%',
      400: '221 83% 45%',
      500: '221 83% 52%',
      600: '224 76% 45%',
      700: '226 71% 38%',
      800: '224 64% 30%',
      900: '226 55% 22%',
      950: '224 71% 12%',
    },
    auras: {
      orb1: 'from-blue-500/15 via-indigo-500/5 to-transparent dark:from-blue-500/12 dark:via-blue-500/[0.03]',
      orb2: 'from-indigo-500/12 via-sky-500/5 to-transparent dark:from-indigo-500/8 dark:via-sky-500/[0.02]',
      orb3: 'from-blue-600/15 via-blue-500/5 to-transparent dark:from-blue-600/12 dark:via-blue-500/[0.03]',
      orb4: 'bg-blue-500/10 dark:bg-blue-500/[0.05]',
    },
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet (بنفسجي ملكي)',
    nameAr: 'بنفسجي ملكي',
    hex: '#8b5cf6',
    bgClass: 'bg-violet-500',
    primary: '258 90% 66%',
    accent: '258 90% 66%',
    ring: '258 90% 66%',
    shades: {
      50: '250 100% 98%',
      100: '251 91% 95%',
      200: '251 95% 92%',
      300: '253 95% 85%',
      400: '255 92% 76%',
      500: '258 90% 66%',
      600: '262 83% 58%',
      700: '263 70% 50%',
      800: '263 69% 42%',
      900: '264 67% 35%',
      950: '267 83% 16%',
    },
    lightPrimary: '258 85% 52%',
    lightAccent: '258 85% 52%',
    lightRing: '258 85% 52%',
    lightShades: {
      50: '250 100% 98%',
      100: '251 91% 95%',
      200: '251 95% 92%',
      300: '253 95% 85%',
      400: '262 83% 48%',
      500: '258 90% 56%',
      600: '262 83% 46%',
      700: '263 70% 38%',
      800: '263 69% 30%',
      900: '264 67% 24%',
      950: '267 83% 14%',
    },
    auras: {
      orb1: 'from-violet-500/15 via-violet-500/5 to-transparent dark:from-violet-500/12 dark:via-violet-500/[0.03]',
      orb2: 'from-purple-500/12 via-fuchsia-500/5 to-transparent dark:from-purple-500/8 dark:via-fuchsia-500/[0.02]',
      orb3: 'from-violet-600/15 via-violet-500/5 to-transparent dark:from-violet-600/12 dark:via-violet-500/[0.03]',
      orb4: 'bg-violet-500/10 dark:bg-violet-500/[0.05]',
    },
  },
  amber: {
    id: 'amber',
    name: 'Amber Gold (ذهبي كهرماني)',
    nameAr: 'ذهبي كهرماني',
    hex: '#f59e0b',
    bgClass: 'bg-amber-500',
    primary: '38 92% 50%',
    accent: '38 92% 50%',
    ring: '38 92% 50%',
    shades: {
      50: '48 100% 96%',
      100: '48 96% 89%',
      200: '48 97% 77%',
      300: '46 97% 65%',
      400: '43 96% 56%',
      500: '38 92% 50%',
      600: '32 95% 44%',
      700: '26 90% 37%',
      800: '23 83% 31%',
      900: '22 78% 26%',
      950: '22 80% 14%',
    },
    lightPrimary: '38 92% 42%',
    lightAccent: '38 92% 42%',
    lightRing: '38 92% 42%',
    lightShades: {
      50: '48 100% 96%',
      100: '48 96% 89%',
      200: '48 97% 77%',
      300: '46 97% 65%',
      400: '38 92% 38%',
      500: '38 92% 46%',
      600: '32 95% 40%',
      700: '26 90% 32%',
      800: '23 83% 26%',
      900: '22 78% 20%',
      950: '22 80% 12%',
    },
    auras: {
      orb1: 'from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-500/12 dark:via-amber-500/[0.03]',
      orb2: 'from-orange-500/12 via-yellow-500/5 to-transparent dark:from-orange-500/8 dark:via-yellow-500/[0.02]',
      orb3: 'from-amber-600/15 via-amber-500/5 to-transparent dark:from-amber-600/12 dark:via-amber-500/[0.03]',
      orb4: 'bg-amber-500/10 dark:bg-amber-500/[0.05]',
    },
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan (سماوي سيبراني)',
    nameAr: 'سماوي سيبراني',
    hex: '#06b6d4',
    bgClass: 'bg-cyan-500',
    primary: '189 94% 43%',
    accent: '189 94% 43%',
    ring: '189 94% 43%',
    shades: {
      50: '180 100% 97%',
      100: '183 100% 93%',
      200: '186 100% 86%',
      300: '187 92% 70%',
      400: '188 86% 53%',
      500: '189 94% 43%',
      600: '192 91% 36%',
      700: '194 82% 31%',
      800: '196 72% 26%',
      900: '198 64% 22%',
      950: '201 79% 15%',
    },
    lightPrimary: '189 94% 38%',
    lightAccent: '189 94% 38%',
    lightRing: '189 94% 38%',
    lightShades: {
      50: '180 100% 97%',
      100: '183 100% 93%',
      200: '186 100% 86%',
      300: '187 92% 70%',
      400: '189 94% 34%',
      500: '189 94% 40%',
      600: '192 91% 33%',
      700: '194 82% 27%',
      800: '196 72% 23%',
      900: '198 64% 20%',
      950: '201 79% 13%',
    },
    auras: {
      orb1: 'from-cyan-500/15 via-cyan-500/5 to-transparent dark:from-cyan-500/12 dark:via-cyan-500/[0.03]',
      orb2: 'from-blue-500/12 via-sky-500/5 to-transparent dark:from-blue-500/8 dark:via-sky-500/[0.02]',
      orb3: 'from-cyan-600/15 via-cyan-500/5 to-transparent dark:from-cyan-600/12 dark:via-cyan-500/[0.03]',
      orb4: 'bg-cyan-500/10 dark:bg-cyan-500/[0.05]',
    },
  },
  rose: {
    id: 'rose',
    name: 'Neon Rose (وردي نيون)',
    nameAr: 'وردي نيون',
    hex: '#f43f5e',
    bgClass: 'bg-rose-500',
    primary: '350 89% 60%',
    accent: '350 89% 60%',
    ring: '350 89% 60%',
    shades: {
      50: '356 100% 97%',
      100: '356 100% 94%',
      200: '353 96% 90%',
      300: '353 96% 82%',
      400: '351 95% 71%',
      500: '350 89% 60%',
      600: '347 77% 50%',
      700: '345 75% 41%',
      800: '343 72% 34%',
      900: '341 68% 30%',
      950: '343 85% 16%',
    },
    lightPrimary: '350 89% 48%',
    lightAccent: '350 89% 48%',
    lightRing: '350 89% 48%',
    lightShades: {
      50: '356 100% 97%',
      100: '356 100% 94%',
      200: '353 96% 90%',
      300: '353 96% 82%',
      400: '350 89% 46%',
      500: '350 89% 54%',
      600: '347 77% 45%',
      700: '345 75% 36%',
      800: '343 72% 30%',
      900: '341 68% 26%',
      950: '343 85% 13%',
    },
    auras: {
      orb1: 'from-rose-500/15 via-rose-500/5 to-transparent dark:from-rose-500/12 dark:via-rose-500/[0.03]',
      orb2: 'from-pink-500/12 via-red-500/5 to-transparent dark:from-pink-500/8 dark:via-red-500/[0.02]',
      orb3: 'from-rose-600/15 via-rose-500/5 to-transparent dark:from-rose-600/12 dark:via-rose-500/[0.03]',
      orb4: 'bg-rose-500/10 dark:bg-rose-500/[0.05]',
    },
  },
  orange: {
    id: 'orange',
    name: 'Vibrant Orange (برتقالي حيوي)',
    nameAr: 'برتقالي حيوي',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    primary: '21 90% 53%',
    accent: '21 90% 53%',
    ring: '21 90% 53%',
    shades: {
      50: '33 100% 96%',
      100: '34 100% 92%',
      200: '32 98% 83%',
      300: '27 96% 72%',
      400: '23 93% 62%',
      500: '21 90% 53%',
      600: '16 93% 46%',
      700: '13 88% 38%',
      800: '11 78% 32%',
      900: '10 70% 27%',
      950: '10 82% 15%',
    },
    lightPrimary: '21 90% 46%',
    lightAccent: '21 90% 46%',
    lightRing: '21 90% 46%',
    lightShades: {
      50: '33 100% 96%',
      100: '34 100% 92%',
      200: '32 98% 83%',
      300: '27 96% 72%',
      400: '21 90% 44%',
      500: '21 90% 50%',
      600: '16 93% 44%',
      700: '13 88% 36%',
      800: '11 78% 30%',
      900: '10 70% 25%',
      950: '10 82% 13%',
    },
    auras: {
      orb1: 'from-orange-500/15 via-amber-500/5 to-transparent dark:from-orange-500/12 dark:via-orange-500/[0.03]',
      orb2: 'from-amber-500/12 via-red-500/5 to-transparent dark:from-amber-500/8 dark:via-red-500/[0.02]',
      orb3: 'from-orange-600/15 via-orange-500/5 to-transparent dark:from-orange-600/12 dark:via-orange-500/[0.03]',
      orb4: 'bg-orange-500/10 dark:bg-orange-500/[0.05]',
    },
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo (نيلي عميق)',
    nameAr: 'نيلي عميق',
    hex: '#6366f1',
    bgClass: 'bg-indigo-500',
    primary: '245 92% 64%',
    accent: '245 92% 64%',
    ring: '245 92% 64%',
    shades: {
      50: '240 100% 98%',
      100: '240 100% 96%',
      200: '239 100% 92%',
      300: '239 96% 80%',
      400: '243 95% 72%',
      500: '245 92% 64%',
      600: '245 82% 54%',
      700: '245 72% 47%',
      800: '245 66% 39%',
      900: '244 58% 33%',
      950: '244 76% 20%',
    },
    lightPrimary: '245 75% 50%',
    lightAccent: '245 75% 50%',
    lightRing: '245 75% 50%',
    lightShades: {
      50: '240 100% 98%',
      100: '240 100% 96%',
      200: '239 100% 92%',
      300: '239 96% 80%',
      400: '243 75% 48%',
      500: '245 80% 54%',
      600: '245 75% 46%',
      700: '245 68% 38%',
      800: '245 62% 31%',
      900: '244 55% 24%',
      950: '244 76% 14%',
    },
    auras: {
      orb1: 'from-indigo-500/15 via-indigo-500/5 to-transparent dark:from-indigo-500/12 dark:via-indigo-500/[0.03]',
      orb2: 'from-violet-500/12 via-blue-500/5 to-transparent dark:from-violet-500/8 dark:via-blue-500/[0.02]',
      orb3: 'from-indigo-600/15 via-indigo-500/5 to-transparent dark:from-indigo-600/12 dark:via-indigo-500/[0.03]',
      orb4: 'bg-indigo-500/10 dark:bg-indigo-500/[0.05]',
    },
  },
};

export const THEME_COLOR_OPTIONS = Object.values(THEME_PALETTES).map(p => ({
  id: p.id,
  name: p.name,
  nameAr: p.nameAr,
  hex: p.hex,
  class: p.bgClass,
}));

/**
 * Applies the entire visual identity palette to the DOM root documentElement.
 * Automatically adapts shades and tokens for both dark and light modes.
 */
export function applyThemePalette(themeId?: string | null, isDark?: boolean) {
  if (typeof document === 'undefined') return;

  const cleanId = (themeId || 'emerald').toLowerCase();
  const palette = THEME_PALETTES[cleanId] || THEME_PALETTES.emerald;
  const root = document.documentElement;

  const inDarkMode = isDark !== undefined ? isDark : root.classList.contains('dark');
  const targetShades = inDarkMode ? palette.shades : (palette.lightShades || palette.shades);
  const primaryVal = inDarkMode ? palette.primary : (palette.lightPrimary || palette.primary);
  const accentVal = inDarkMode ? palette.accent : (palette.lightAccent || palette.accent);
  const ringVal = inDarkMode ? palette.ring : (palette.lightRing || palette.ring);

  // Set primary, accent, ring tokens
  root.style.setProperty('--primary', primaryVal);
  root.style.setProperty('--accent', accentVal);
  root.style.setProperty('--ring', ringVal);
  root.style.setProperty('--theme-primary-hex', palette.hex);

  // Set all emerald color shade variables to the target palette
  const varsToCache: Record<string, string> = {
    '--primary': primaryVal,
    '--accent': accentVal,
    '--ring': ringVal,
    '--theme-primary-hex': palette.hex,
  };

  Object.entries(targetShades).forEach(([shade, hslValue]) => {
    const varName = `--emerald-${shade}`;
    root.style.setProperty(varName, hslValue);
    varsToCache[varName] = hslValue;
  });

  try {
    localStorage.setItem('portfolio_primary_theme', palette.id);
    localStorage.setItem('portfolio_theme_vars', JSON.stringify(varsToCache));
  } catch { }
}

export function getThemeAuras(themeId?: string | null) {
  const cleanId = (themeId || 'emerald').toLowerCase();
  const palette = THEME_PALETTES[cleanId] || THEME_PALETTES.emerald;
  return palette.auras;
}
