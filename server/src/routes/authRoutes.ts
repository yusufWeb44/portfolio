import express from 'express';
import { 
  loginAdmin, 
  logoutAdmin, 
  getMe, 
  getSecurityStatus, 
  setup2FA,
  enable2FA,
  disable2FA,
  changePassword,
  updateAdminEmail
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();
const loginLimiter = authRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
const sensitiveAuthLimiter = authRateLimiter({ windowMs: 15 * 60 * 1000, max: 12 });

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);

// High-security 2FA & Credentials endpoints
router.get('/security-status', protect, getSecurityStatus);
router.post('/setup-2fa', protect, sensitiveAuthLimiter, setup2FA);
router.post('/enable-2fa', protect, sensitiveAuthLimiter, enable2FA);
router.post('/disable-2fa', protect, sensitiveAuthLimiter, disable2FA);
router.post('/change-password', protect, sensitiveAuthLimiter, changePassword);
router.post('/update-email', protect, sensitiveAuthLimiter, updateAdminEmail);

export default router;
