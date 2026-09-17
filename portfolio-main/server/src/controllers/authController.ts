import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      generateToken(res, admin.id);

      res.status(200).json({
        success: true,
        data: {
          id: admin.id,
          email: admin.email,
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid input', errors: (error as any).errors || error.issues });
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};
