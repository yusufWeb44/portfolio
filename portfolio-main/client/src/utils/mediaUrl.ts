export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const base = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};
