import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for sending HTTP-only cookies
});

// In-flight GET request deduplicator (prevents multiple components firing identical requests on page load)
const inFlightRequests = new Map<string, Promise<any>>();
const originalGet = api.get.bind(api);

api.get = function (url: string, config?: any): Promise<any> {
  const cacheKey = `${url}:${JSON.stringify(config?.params || {})}`;
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const promise = originalGet(url, config)
    .then((res) => {
      setTimeout(() => inFlightRequests.delete(cacheKey), 1500);
      return res;
    })
    .catch((err) => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
} as any;

// Attach Authorization Bearer token fallback if present in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Clear cache when user mutates data
  if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    inFlightRequests.clear();
  }
  return config;
});

// Purge stored token if unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  }
);

export default api;

