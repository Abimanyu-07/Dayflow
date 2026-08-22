import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ENV } from '../config/env';

// Ensure upload directories exist
const uploadDir = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
const profilePicsDir = path.join(uploadDir, 'profiles');
const docsDir = path.join(uploadDir, 'documents');

[uploadDir, profilePicsDir, docsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      cb(null, profilePicsDir);
    } else {
      cb(null, docsDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedDocTypes = /pdf|docx|doc|jpeg|jpg|png/;

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (file.fieldname === 'profilePicture') {
    if (allowedImageTypes.test(ext) && allowedImageTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed for profile picture!'));
    }
  } else {
    if (allowedDocTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, DOC and Image files are allowed for documents!'));
    }
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter,
});
