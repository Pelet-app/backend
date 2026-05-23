// src/services/resumes/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import InvariantError from '../../exceptions/invariant-error.js';

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const ext = path.extname(file.originalname);

    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new InvariantError(
        'Hanya file PDF atau Word (.doc/.docx) yang diizinkan',
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      parseInt(process.env.MAX_FILE_SIZE, 10)
      || 5 * 1024 * 1024, // 5MB
  },
});

export default upload;