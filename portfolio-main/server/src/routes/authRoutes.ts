import express from 'express';
import { loginAdmin, logoutAdmin, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);

export default router;
