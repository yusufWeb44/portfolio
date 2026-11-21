import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser | null;
}

interface JwtTokenPayload {
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Dual-mode authentication: Priority to httpOnly cookie, fallback to Authorization Bearer header
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    console.error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production.');
    return res.status(500).json({ success: false, message: 'Server authentication misconfigured' });
  }

  try {
    const tokenSecret = secret || 'dev-fallback-secret-for-local-development-only-replace-in-production';
    const decoded = jwt.verify(token, tokenSecret) as JwtTokenPayload;

    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token payload' });
    }

    req.user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
