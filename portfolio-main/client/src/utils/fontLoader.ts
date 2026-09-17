/**
 * Utility to dynamically inject and apply custom fonts (English & Arabic)
 * Supports both custom font URLs (CDN, Google Fonts, Adobe) and automatic Google Fonts resolution by family name.
 */
export function applyCustomFonts(settings?: {
  fontFamilyEn?: string | null;
  fontUrlEn?: string | null;
  fontFamilyAr?: string | null;
  fontUrlAr?: string | null;
}) {
  if (!settings || typeof document === 'undefined') return;

  // 1. English Font
  if (settings.fontFamilyEn && settings.fontFamilyEn.trim()) {
    const fontName = settings.fontFamilyEn.trim();
    document.documentElement.style.setProperty('--font-en', `'${fontName}', system-ui, -apple-system, sans-serif`);

    let href = settings.fontUrlEn?.trim();
    if (!href && !['sans-serif', 'serif', 'monospace', 'system-ui', 'arial', 'helvetica'].includes(fontName.toLowerCase())) {
      href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    }

    if (href) {
      let link = document.getElementById('custom-font-en') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.id = 'custom-font-en';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      if (link.href !== href) {
        link.href = href;
      }
    }
  }

  // 2. Arabic Font
  if (settings.fontFamilyAr && settings.fontFamilyAr.trim()) {
    const fontName = settings.fontFamilyAr.trim();
    document.documentElement.style.setProperty('--font-ar', `'${fontName}', system-ui, -apple-system, sans-serif`);

    let href = settings.fontUrlAr?.trim();
    if (!href && !['sans-serif', 'serif', 'monospace', 'system-ui', 'arial', 'tahoma'].includes(fontName.toLowerCase())) {
      href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    }

    if (href) {
      let link = document.getElementById('custom-font-ar') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.id = 'custom-font-ar';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      if (link.href !== href) {
        link.href = href;
      }
    }
  }
}
