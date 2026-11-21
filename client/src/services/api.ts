import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending HTTP-only cookies
  timeout: 35000, // Accommodates Render free-tier cold starts gracefully
});

// In-flight GET request deduplicator (prevents multiple components firing identical requests on page load)
const inFlightRequests = new Map<string, Promise<AxiosResponse>>();
const originalGet = api.get.bind(api);

const isTransientColdStartError = (err: unknown): boolean => {
  const axiosErr = err as AxiosError;
  if (!axiosErr) return false;
  if (axiosErr.code === 'ECONNABORTED' || axiosErr.code === 'ERR_NETWORK' || !axiosErr.response) {
    return true;
  }
  const status = axiosErr.response.status;
  return status === 502 || status === 503 || status === 504;
};

api.get = (function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const cacheKey = `${url}:${JSON.stringify(config?.params || {})}`;
  const existing = inFlightRequests.get(cacheKey);
  if (existing) {
    return existing as Promise<R>;
  }

  const executeWithColdStartRetry = async (): Promise<AxiosResponse> => {
    try {
      return await originalGet(url, config);
    } catch (firstErr) {
      if (isTransientColdStartError(firstErr)) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return await originalGet(url, config);
      }
      throw firstErr;
    }
  };

  const promise = executeWithColdStartRetry()
    .then((res) => {
      setTimeout(() => inFlightRequests.delete(cacheKey), 1500);
      return res;
    })
    .catch((err) => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

  inFlightRequests.set(cacheKey, promise);
  return promise as Promise<R>;
}) as typeof api.get;

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

