/**
 * Utility to dynamically inject and apply custom fonts (English & Arabic)
 * Supports custom font URLs (CDN, Google Fonts, Adobe) and automatic Google Fonts resolution with error fallback.
 */

function injectFontStylesheet(id: string, primaryHref: string, fallbackHref?: string) {
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.href !== primaryHref) {
    if (fallbackHref) {
      link.onerror = () => {
        if (link && link.href !== fallbackHref) {
          link.href = fallbackHref;
        }
      };
    }
    link.href = primaryHref;
  }
}

export function applyCustomFonts(settings?: {
  fontFamilyEn?: string | null;
  fontUrlEn?: string | null;
  fontFamilyAr?: string | null;
  fontUrlAr?: string | null;
}) {
  if (!settings || typeof document === 'undefined') return;

  const systemFonts = ['sans-serif', 'serif', 'monospace', 'system-ui', 'arial', 'helvetica', 'tahoma', 'times new roman', 'georgia'];

  let cleanEn = settings.fontFamilyEn ? settings.fontFamilyEn.trim().replace(/['"]/g, '') : '';
  let cleanAr = settings.fontFamilyAr ? settings.fontFamilyAr.trim().replace(/['"]/g, '') : '';

  // 1. English Font
  if (cleanEn) {
    document.documentElement.style.setProperty('--font-en', `'${cleanEn}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`);

    let href = settings.fontUrlEn?.trim();
    if (!href && !systemFonts.includes(cleanEn.toLowerCase())) {
      const encoded = encodeURIComponent(cleanEn).replace(/%20/g, '+');
      const primary = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800;900&display=swap`;
      const fallback = `https://fonts.googleapis.com/css2?family=${encoded}&display=swap`;
      injectFontStylesheet('custom-font-en', primary, fallback);
    } else if (href) {
      injectFontStylesheet('custom-font-en', href);
    }
  }

  // 2. Arabic Font
  if (cleanAr) {
    document.documentElement.style.setProperty('--font-ar', `'${cleanAr}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`);

    let href = settings.fontUrlAr?.trim();
    if (!href && !systemFonts.includes(cleanAr.toLowerCase())) {
      const encoded = encodeURIComponent(cleanAr).replace(/%20/g, '+');
      const primary = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800;900&display=swap`;
      const fallback = `https://fonts.googleapis.com/css2?family=${encoded}&display=swap`;
      injectFontStylesheet('custom-font-ar', primary, fallback);
    } else if (href) {
      injectFontStylesheet('custom-font-ar', href);
    }
  }

  // 3. Determine active font family by document direction
  const isRtl = document.documentElement.getAttribute('dir') === 'rtl' || 
                document.documentElement.classList.contains('rtl');

  const activeFont = isRtl
    ? (cleanAr ? `'${cleanAr}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` : "var(--font-ar)")
    : (cleanEn ? `'${cleanEn}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` : "var(--font-en)");

  document.documentElement.style.setProperty('--font-family', activeFont);
  document.documentElement.style.setProperty('--font-current', activeFont);
  if (document.body) {
    document.body.style.fontFamily = activeFont;
  }
}

