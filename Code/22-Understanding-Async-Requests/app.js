// GLOBAL DEPENDENCIES
import path from 'path';
import crypto from 'crypto';
import {fileURLToPath} from 'url';
// EXTERNAL DEPENDENCIES
import express from 'express';
import dotenv from 'dotenv/config';
import helmet from 'helmet';
import session from 'express-session';
import mongodbSession from 'connect-mongodb-session';
import flash from 'connect-flash';
import multer from 'multer';
// UTILS
import rootDir from './util/path.js';
// DATABASE
import {mongoUri, mongoConnect} from './util/database.js';
import {User, createAdmin} from './model/user.js';
// MIDDLEWARE
import {isAuth} from './middleware/is-auth.js';
// ROUTES
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import {get404, get500} from './controllers/error.js';
// APP
const app = express();
const MongoDBStore = mongodbSession(session);
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'data/images'),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}_${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
    cb(null, /image\/(pn|jpe?|sv)g/.test(file.mimetype));
};

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// MIDDLEWARE
app.use(helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://esm.sh'],
  },
}));
app.use(express.urlencoded({extended: true}));
app.use(multer({storage: fileStorage, fileFilter}).single('imageFile'));

app.use(express.static(path.join(rootDir(), 'public')));
app.use('/data/images', express.static(path.join(rootDir(), 'data', 'images')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err) {
    next(new Error(err));
  }
});


// ROUTING
app.use('/admin', isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// ERRORS
app.get('/500', get500);
app.use(get404);

app.use((error, req, res, next) => {
    res
        .status(500)
        .render('500', {
            pageTitle: 'Server Error',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        });
});


(async () => {
  try {
    await mongoConnect();
    const admin = (await User.findOne({isAdmin: true})) ?? (await createAdmin());
    app.listen(process.env.PORT, async () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  } catch(err) {
    console.error(err);
    throw err;
  }
})();
