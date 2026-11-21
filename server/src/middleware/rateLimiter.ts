import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  keyPrefix?: string;
  message?: string;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

// Clean up expired entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}, 10 * 60 * 1000).unref();

/**
 * Creates an isolated in-memory sliding-window rate limiter keyed by endpoint prefix + IP.
 * Emits standard rate limit headers and protects against brute-force, spam, and DoS.
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, max, keyPrefix = 'global', message } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      'unknown-client-ip';

    const storeKey = `${keyPrefix}:${clientIp}`;
    const now = Date.now();
    const record = rateLimitStore[storeKey];

    if (!record || record.resetTime < now) {
      rateLimitStore[storeKey] = {
        count: 1,
        resetTime: now + windowMs,
      };
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - 1)));
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      const waitMinutes = Math.max(1, Math.ceil(retryAfterSec / 60));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        success: false,
        message:
          message ||
          `Too many requests from this network. Please wait ${waitMinutes} minute(s) before trying again.`,
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - record.count)));
    next();
  };
};

/**
 * Protects public contact form submissions against spam and abuse.
 */
export const contactRateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 5 }) =>
  createRateLimiter({
    ...options,
    keyPrefix: 'contact',
    message: 'Too many submissions from this network. Please wait before trying again.',
  });

/**
 * Protects authentication, 2FA, and credential management endpoints against brute-force attacks.
 */
export const authRateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 10 }) =>
  createRateLimiter({
    ...options,
    keyPrefix: 'auth',
    message: 'Too many authentication attempts. Please try again later.',
  });
