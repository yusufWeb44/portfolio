import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';
import { 
  generateTotpSecret, 
  generateTotpUri, 
  generateQrDataUrl, 
  verifyTotp, 
  formatSecretForDisplay 
} from '../utils/totpService';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  totpCode: z.string().optional(),
});

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, totpCode } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // If 2FA is active, verify Google Authenticator TOTP token
    if (admin.twoFactorEnabled) {
      if (!totpCode || totpCode.trim().length !== 6) {
        return res.status(200).json({
          success: true,
          require2FA: true,
          message: 'Google Authenticator 2FA verification required',
        });
      }

      const isValid = verifyTotp(totpCode, admin.twoFactorSecret || '');
      if (!isValid) {
        return res.status(401).json({
          success: false,
          require2FA: true,
          message: 'Invalid 6-digit Google Authenticator code',
        });
      }
    }

    const token = generateToken(res, admin.id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin.id,
        email: admin.email,
        isTwoFactorEnabled: !!admin.twoFactorEnabled,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: (error as any).errors || error.issues,
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
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

export const getSecurityStatus = async (req: AuthRequest, res: Response) => {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        updatedAt: true,
        twoFactorEnabled: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        email: admin.email,
        isTwoFactorEnabled: !!admin.twoFactorEnabled,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (err: any) {
    console.error('Error in getSecurityStatus:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve security status' });
  }
};

/**
 * Step 1: Generates a new Base32 TOTP secret, standard otpauth:// URI, and QR Code Data URL
 */
export const setup2FA = async (req: AuthRequest, res: Response) => {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const secret = generateTotpSecret();
    const uri = generateTotpUri(admin.email, secret, 'Yusuf CMS');
    const qrCode = await generateQrDataUrl(uri);

    // Save pending secret (not enabled until verified with a token)
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { twoFactorSecret: secret },
    });

    res.status(200).json({
      success: true,
      secret,
      formattedSecret: formatSecretForDisplay(secret),
      qrCode,
      otpauth: uri,
    });
  } catch (err: any) {
    console.error('Error in setup2FA:', err);
    res.status(500).json({ success: false, message: 'Failed to initiate 2FA setup' });
  }
};

/**
 * Step 2: Confirms the 6-digit rolling code displayed in Google Authenticator and activates 2FA
 */
export const enable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = z.object({ token: z.string().length(6) }).parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!admin || !admin.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please initiate 2FA setup first before enabling.',
      });
    }

    const isValid = verifyTotp(token, admin.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 6-digit code. Please verify the code displayed in Google Authenticator and try again.',
      });
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { twoFactorEnabled: true },
    });

    console.log(`🛡️ [2FA Enabled] Administrator ${admin.email} successfully activated Google Authenticator 2FA.`);

    res.status(200).json({
      success: true,
      message: 'Google Authenticator 2FA is now active! Your account is fully protected.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Verification code must be 6 digits' });
    }
    console.error('Error in enable2FA:', err);
    res.status(500).json({ success: false, message: 'Failed to activate 2FA' });
  }
};

/**
 * Step 3: Deactivates Google Authenticator 2FA (requires current password and TOTP token)
 */
export const disable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, token } = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      token: z.string().length(6, 'Verification code must be 6 digits'),
    }).parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const isValid = verifyTotp(token, admin.twoFactorSecret || '');
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit Authenticator code' });
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    console.log(`⚠️ [2FA Disabled] Administrator ${admin.email} deactivated Google Authenticator.`);

    res.status(200).json({
      success: true,
      message: 'Google Authenticator 2FA has been disabled.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.issues?.[0]?.message || 'Invalid input' });
    }
    console.error('Error in disable2FA:', err);
    res.status(500).json({ success: false, message: 'Failed to disable 2FA' });
  }
};

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  totpCode: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, totpCode } = changePasswordSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator record not found' });
    }

    // 1. Verify Current Password
    const passwordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // 2. Prevent Reusing Same Password
    const samePassword = await bcrypt.compare(newPassword, admin.passwordHash);
    if (samePassword) {
      return res.status(400).json({ success: false, message: 'New password cannot be the same as current password' });
    }

    // 3. Verify TOTP Code
    const secret = admin.twoFactorSecret;
    if (admin.twoFactorEnabled && secret) {
      const isValid = verifyTotp(totpCode, secret);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 6-digit Google Authenticator code. Check your phone app.',
        });
      }
    } else if (secret) {
      // If setup is in progress, also verify
      const isValid = verifyTotp(totpCode, secret);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 6-digit verification code.',
        });
      }
    }

    // 4. Hash new password with 12 bcrypt salt rounds
    const newHash = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    // 5. Issue fresh JWT token
    const token = generateToken(res, admin.id);

    console.log(`🔒 [Security Audit] Administrator ${admin.email} successfully updated password via Google Authenticator 2FA.`);

    res.status(200).json({
      success: true,
      token,
      message: 'Password successfully changed and secured!',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const firstIssue = err.issues?.[0]?.message || 'Invalid input requirements';
      return res.status(400).json({ success: false, message: firstIssue });
    }
    console.error('Error in changePassword:', err);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

const updateEmailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().min(1, 'Current password is required'),
  totpCode: z.string().optional(),
});

export const updateAdminEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { newEmail, currentPassword, totpCode } = updateEmailSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // 1. Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // 2. Prevent setting exact same email
    if (newEmail.trim().toLowerCase() === admin.email.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'New email cannot be the same as current email' });
    }

    // 3. Ensure email is not already taken by another account
    const existing = await prisma.adminUser.findUnique({
      where: { email: newEmail.trim().toLowerCase() },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address is already in use' });
    }

    // 4. Verify 2FA if enabled
    if (admin.twoFactorEnabled) {
      if (!totpCode || totpCode.trim().length !== 6) {
        return res.status(400).json({
          success: false,
          message: 'Google Authenticator 6-digit code is required to change email',
        });
      }
      const isValid = verifyTotp(totpCode, admin.twoFactorSecret || '');
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 6-digit Google Authenticator code',
        });
      }
    }

    // 5. Update email
    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { email: newEmail.trim().toLowerCase() },
      select: { id: true, email: true, updatedAt: true, twoFactorEnabled: true }
    });

    console.log(`📧 [Admin Email Updated] Email updated from ${admin.email} to ${updated.email}`);

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Admin email updated successfully!',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.issues?.[0]?.message || 'Invalid input' });
    }
    console.error('Error in updateAdminEmail:', err);
    res.status(500).json({ success: false, message: 'Failed to update email' });
  }
};
