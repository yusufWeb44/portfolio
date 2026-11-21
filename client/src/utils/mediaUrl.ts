/**
 * Resolves an image or media URL across the client application.
 * - Empty/null URLs return ''
 * - Fixes accidental prefix concatenation (e.g. "http://localhost:5000https://res.cloudinary.com/...")
 * - Absolute URLs (http://, https://, blob:, data:) are returned untouched (e.g., Cloudinary CDN)
 * - Local uploads (/uploads/... or uploads/...) resolve with VITE_UPLOADS_URL (fallback: http://localhost:5000)
 * - Public static assets (/logo.webp) return normalized relative path
 */
export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return '';

  let clean = url.trim();
  if (!clean) return '';

  // Fix accidental prefix concatenation (e.g. "http://localhost:5000https://res.cloudinary.com/...")
  const embeddedHttpIndex = clean.lastIndexOf('http://');
  const embeddedHttpsIndex = clean.lastIndexOf('https://');
  const lastProtocolIndex = Math.max(embeddedHttpIndex, embeddedHttpsIndex);

  if (lastProtocolIndex > 0) {
    clean = clean.slice(lastProtocolIndex);
  }

  // Already a full or special URL (Cloudinary, external, data/blob)
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Local backend uploads (e.g. /uploads/image-123.png)
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const rawBase =
      import.meta.env.VITE_UPLOADS_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
    const base = rawBase.replace(/\/$/, '');
    const cleanPath = clean.startsWith('/') ? clean : `/${clean}`;
    return `${base}${cleanPath}`;
  }

  // Public static asset on frontend client (e.g. /portfolio_photo.webp, /logo.webp)
  return clean.startsWith('/') ? clean : `/${clean}`;
};

export const getMediaUrl = resolveImageUrl;
export default resolveImageUrl;
