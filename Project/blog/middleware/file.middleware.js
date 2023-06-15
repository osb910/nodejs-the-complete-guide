import multer from 'multer';
import {randomUUID} from 'crypto';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import rootDir from '../utils/path.js';

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

const accessLogStream = fs.createWriteStream(
  path.join(rootDir(), 'access.log'),
  {flags: 'a'}
);

const morganMiddleware = morgan('combined', {stream: accessLogStream});

export {
  imgUploadMiddleware,
  filePathMiddleware,
  compressionMiddleware,
  morganMiddleware,
};
