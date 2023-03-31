// DEPS
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import dotenv from 'dotenv/config';
import helmet from 'helmet';
import multer from 'multer';

import rootDir from './util/path.js';
import {mongoUri, mongoConnect} from './util/database.js';
import feedRoutes from './feed/feed.routes.js';
import {get404, get500} from './controllers/error.js';

const app = express();

// MIDDLEWARE
app.use(helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://esm.sh', 'https://js.stripe.com'],
    'frame-src': ["'self'", 'https://js.stripe.com'],
  },
}));

app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// ROUTING
app.use('/feed', feedRoutes);

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