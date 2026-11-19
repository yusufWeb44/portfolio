import { useState, useEffect } from 'react';

/**
 * useIsMobile - Detects mobile phone viewport (< breakpoint, default 768px).
 * Strictly checks viewport width (matches Tailwind's `md` boundary: 768px).
 * Mobile phones (< 768px) receive mobile-optimized layouts and reduced CPU load,
 * while tablets/iPads (>= 768px) and desktop receive full rich 3D motion and layout.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(max-width: ${breakpoint - 1}px)`;
    const mql = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;

