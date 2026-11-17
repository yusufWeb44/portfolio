import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

// Clean up expired IP entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimitStore) {
    if (rateLimitStore[ip].resetTime < now) {
      delete rateLimitStore[ip];
    }
  }
}, 10 * 60 * 1000).unref();

/**
 * In-memory sliding-window rate limiter for sensitive public endpoints (e.g. contact messages).
 * Prevents automated bot spamming and Denial of Service (DoS) attacks.
 */
export const contactRateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 5 }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip during automated tests
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-client-ip';

    const now = Date.now();
    const record = rateLimitStore[clientIp];

    if (!record || record.resetTime < now) {
      rateLimitStore[clientIp] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      return next();
    }

    if (record.count >= options.max) {
      const waitMinutes = Math.max(1, Math.ceil((record.resetTime - now) / 60000));
      return res.status(429).json({
        success: false,
        message: `Too many submissions from this network. Please wait ${waitMinutes} minute(s) before trying again.`,
      });
    }

    record.count += 1;
    next();
  };
};
