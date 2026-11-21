import express, { Request, Response } from 'express';
import { Readable } from 'stream';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import upload from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';
import cloudinary from '../utils/cloudinary';
import { sendSafeError } from '../utils/sanitize';

const router = express.Router();

router.post('/', protect, upload.any(), async (req: Request, res: Response) => {
  try {
    const file = (req.files && Array.isArray(req.files) && req.files.length > 0)
      ? req.files[0]
      : (req.file || null);

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'auto',
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload returned empty response'));
          resolve(result);
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      originalName: file.originalname,
      mimetype: file.mimetype,
      public_id: result.public_id,
    });
  } catch (error: unknown) {
    return sendSafeError(res, 500, 'Image upload failed', error);
  }
});

export default router;
