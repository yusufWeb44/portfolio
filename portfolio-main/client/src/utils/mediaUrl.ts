export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  // If it's a backend upload, route to API server
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const base = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  // Otherwise, it's a static public asset on the frontend client (e.g. /biruni_sertafika.webp)
  return url.startsWith('/') ? url : `/${url}`;
};
