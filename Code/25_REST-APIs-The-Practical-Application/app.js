// DEPS
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import dotenv from 'dotenv/config';
import multer from 'multer';

import rootDir from './utils/path.js';
import {corsMiddleware, helmetMiddleware} from './middleware/security.middleware.js';
import {mongoUri, mongoConnect} from './utils/database.js';
import feedRoutes from './entities/feed/feed.routes.js';


const app = express();

// MIDDLEWARE
app.use(helmetMiddleware);
app.use(corsMiddleware);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/images', express.static(path.join(rootDir(), 'images')));

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'data/images'),
//     filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}_${file.originalname}`)
// });
// const fileFilter = (req, file, cb) => {
//     cb(null, /image\/(pn|jpe?|sv)g/.test(file.mimetype));
// };
// app.use(multer({storage: fileStorage, fileFilter}).single('imageFile'));
//

//
// app.use(async (req, res, next) => {
//   if (!req.session.user) return next();
//   try {
//     const user = await User.findById(req.session.user._id);
//     if (!user) return next();
//     req.user = user;
//     next();
//   } catch (err) {
//     next(new Error(err));
//   }
// });

// ROUTES
app.use('/feed', feedRoutes);

// ERROR HANDLING
app.use((error, req, res, next) => {
  console.error(error);
  const {statusCode = 500, message = 'An error occurred!'} = error;
  res.status(statusCode).json({message});
  next();
});

// INITIATE SERVER
try {
  await mongoConnect();
  app.listen(process.env.PORT, async () => {
    console.log(`Running on port ${process.env.PORT}`);
  });
} catch(err) {
  console.error(err);
  throw err;
}