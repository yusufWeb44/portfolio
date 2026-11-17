import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production.');
    }
  }

  const tokenSecret = secret || 'dev-fallback-secret-for-local-development-only-replace-in-production';
  const isProduction = process.env.NODE_ENV === 'production';

  const token = jwt.sign({ userId }, tokenSecret, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS-only in production
    sameSite: isProduction ? 'strict' : 'lax', // Strict CSRF protection in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export default generateToken;
