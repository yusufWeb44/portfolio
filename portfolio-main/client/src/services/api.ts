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

// Clear cache when user mutates data
api.interceptors.request.use((config) => {
  if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    inFlightRequests.clear();
  }
  return config;
});

export default api;

