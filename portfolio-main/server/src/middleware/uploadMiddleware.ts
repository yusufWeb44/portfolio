import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpg|jpeg|png|webp|avif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const isPdf = file.mimetype === 'application/pdf';
  const isImage = file.mimetype.startsWith('image/');

  if (extname && (isPdf || isImage)) {
    return cb(null, true);
  } else {
    cb(new Error('Images and PDF files only!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
