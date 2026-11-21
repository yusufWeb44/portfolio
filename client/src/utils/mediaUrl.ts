/**
 * Optimizes Cloudinary URLs to eliminate Lighthouse "Improve image delivery" warnings.
 * Injects `f_auto,q_auto,c_limit,w_1000/` right after `/image/upload/` if transformations
 * are not already present, automatically converting heavy transparent PNGs to WebP/AVIF.
 */
export const optimizeCloudinaryUrl = (
  url: string,
  transform = 'f_auto,q_auto,c_limit,w_1000'
): string => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadSegment = '/image/upload/';
  const uploadIndex = url.indexOf(uploadSegment);
  if (uploadIndex === -1) {
    return url;
  }

  const afterUpload = url.slice(uploadIndex + uploadSegment.length);

  // If already contains f_auto or q_auto anywhere in the URL, avoid duplicate transformations
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }

  // Check if transformation parameters are already present immediately after /image/upload/
  // In Cloudinary URL architecture, transformations appear before the version (v\d+) or public_id.
  const firstSlashIndex = afterUpload.indexOf('/');
  const firstSegment = firstSlashIndex === -1 ? afterUpload : afterUpload.slice(0, firstSlashIndex);

  // A version tag is strictly "v" followed by digits (e.g., v1700000000)
  const isVersionTag = /^v\d+$/.test(firstSegment);

  // If first segment is NOT a version tag and contains transformation keys (e.g. w_..., c_..., q_..., f_...) or commas
  const hasExistingTransforms =
    !isVersionTag &&
    (/([a-z]_[a-z0-9_-]+)/i.test(firstSegment) || firstSegment.includes(','));

  if (hasExistingTransforms) {
    return url;
  }

  const cleanTransform = transform.endsWith('/') ? transform : `${transform}/`;
  return `${url.slice(0, uploadIndex + uploadSegment.length)}${cleanTransform}${afterUpload}`;
};

/**
 * Resolves an image or media URL across the client application.
 * - Empty/null URLs return ''
 * - Fixes accidental prefix concatenation (e.g. "http://localhost:5000https://res.cloudinary.com/...")
 * - Cloudinary CDN URLs automatically receive f_auto,q_auto,c_limit,w_1000 delivery optimizations
 * - Absolute URLs (http://, https://, blob:, data:) are returned cleanly
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
    if (clean.includes('res.cloudinary.com')) {
      return optimizeCloudinaryUrl(clean);
    }
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
