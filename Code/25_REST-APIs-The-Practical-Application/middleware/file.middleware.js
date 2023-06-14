import multer from 'multer';
import {randomUUID} from 'crypto';
import compression from 'compression';
import rootDir from '../utils/path.js';
import path from 'path';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) => cb(null, `${randomUUID()}_${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  cb(null, /image\/((pn|jpe?|sv)g|webp)/.test(file.mimetype));
};

const imgUploadMiddleware = multer({storage: fileStorage, fileFilter}).single(
  'image'
);

const filePathMiddleware = (req, res, next) => {
  if (!req.file) return next();
  req.file.path = req.file.path.replace(/\\/g, '/');
  next();
};

const compressionMiddleware = compression();

export {imgUploadMiddleware, filePathMiddleware, compressionMiddleware};
