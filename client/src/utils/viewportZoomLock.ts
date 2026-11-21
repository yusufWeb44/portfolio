/**
 * Adaptive 1:1 Desktop Viewport-Lock Scaling (90%, 80%, 75%, 70%, 67% Browser Zoom)
 *
 * Pure CSS `@media (min-width: 1536px)` only anchors 1536px-wide desktop viewports.
 * On common laptop viewports below 1536px (1280px at 150% Windows scale, 1366px native,
 * 1440px, 1512px MacBook), zooming out to 90% stays below 1536px (1422px / 1518px) and
 * zooming out to 80%/70% under-scales relative to 1536px while accidentally triggering
 * Tailwind's `2xl:` breakpoint.
 *
 * In Chromium/Brave/Edge/Safari, `window.outerWidth` and `window.screen.availWidth`
 * remain in OS DIPs (100% zoom) while `window.innerWidth` scales by `1 / browserZoom`.
 * Comparing `innerWidth` against the 100%-zoom window width locks `1rem` 1:1 across
 * every desktop laptop resolution without affecting 100% zoom, zoom-in (>100%),
 * mobile, tablets, or DevTools device emulation.
 */

const BASE_FONT_PX = 16;
const CSS_SCALE_START_PX = 1536;
const CSS_SCALE_MAX_PX = 22.86;
// Locks 90% (1.111x), 80% (1.25x), 75% (1.333x), 70% (1.429x), and Chromium/Brave's 67% step (1.493x), capping cleanly thereafter.
const MAX_ZOOM_LOCK_SCALE = 1 / 0.67;
const ZOOM_OUT_THRESHOLD = 1.02;
const SUB_2XL_CLASS = 'zoom-lock-sub-2xl';

let initialized = false;
let rafId: number | null = null;

function clearZoomLock(root: HTMLElement): void {
  if (root.style.fontSize) {
    root.style.removeProperty('font-size');
  }
  root.classList.remove(SUB_2XL_CLASS);
}

export function syncViewportZoomLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const innerW = window.innerWidth;

  if (!isFinePointer || innerW < 1280) {
    clearZoomLock(root);
    return;
  }

  const outerW = window.outerWidth || 0;
  const availW = window.screen?.availWidth || 0;
  // On Windows 11 maximized windows, outerWidth includes an invisible 16px DWM frame,
  // so Math.min(outerW, availW) recovers the exact 100%-zoom viewport width.
  const baseWidth = outerW > 0 && availW > 0 ? Math.min(outerW, availW) : outerW || availW;

  if (baseWidth < 1024) {
    clearZoomLock(root);
    return;
  }

  const scale = innerW / baseWidth;

  // At 100% zoom or zoomed in (>100%), let CSS handle defaults untouched.
  if (scale <= ZOOM_OUT_THRESHOLD) {
    clearZoomLock(root);
    return;
  }

  const clampedScale = Math.min(scale, MAX_ZOOM_LOCK_SCALE);
  const baselineRemPx =
    baseWidth >= CSS_SCALE_START_PX
      ? Math.min(Math.max(BASE_FONT_PX, baseWidth * (BASE_FONT_PX / CSS_SCALE_START_PX)), CSS_SCALE_MAX_PX)
      : BASE_FONT_PX;

  const lockedFontPx = +(baselineRemPx * clampedScale).toFixed(3);
  root.style.fontSize = `${lockedFontPx}px`;

  // Prevent Tailwind `2xl:` layout jumps when a sub-1536px laptop crosses 1536px purely due to zooming out.
  if (baseWidth < CSS_SCALE_START_PX) {
    root.classList.add(SUB_2XL_CLASS);
  } else {
    root.classList.remove(SUB_2XL_CLASS);
  }
}

function scheduleSync(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
  }
  rafId = window.requestAnimationFrame(() => {
    rafId = null;
    syncViewportZoomLock();
  });
}

export function initViewportZoomLock(): void {
  if (typeof window === 'undefined' || initialized) {
    return;
  }

  initialized = true;
  syncViewportZoomLock();

  window.addEventListener('resize', scheduleSync, { passive: true });
  window.addEventListener('orientationchange', scheduleSync, { passive: true });
  window.addEventListener('pageshow', scheduleSync, { passive: true });
  window.visualViewport?.addEventListener('resize', scheduleSync, { passive: true });
}
