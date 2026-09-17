import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, upload.any(), (req, res) => {
  const file = (req.files && Array.isArray(req.files) && req.files.length > 0)
    ? req.files[0]
    : (req.file || null);

  if (file) {
    const url = `/uploads/${file.filename}`;
    res.status(200).json({ 
      success: true, 
      url, 
      filename: file.filename, 
      originalName: file.originalname,
      mimetype: file.mimetype
    });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

export default router;
