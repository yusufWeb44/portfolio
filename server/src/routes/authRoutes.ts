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

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);

// High-security 2FA & Credentials endpoints
router.get('/security-status', protect, getSecurityStatus);
router.post('/setup-2fa', protect, setup2FA);
router.post('/enable-2fa', protect, enable2FA);
router.post('/disable-2fa', protect, disable2FA);
router.post('/change-password', protect, changePassword);
router.post('/update-email', protect, updateAdminEmail);

export default router;
