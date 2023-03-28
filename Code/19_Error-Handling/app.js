// GLOBAL DEPENDENCIES
const path = require('path');
// EXTERNAL DEPENDENCIES
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();
// const which = require('which');
// UTILS
const rootDir = require('./util/path');
// DATABASE
const {mongoUri, mongoConnect} = require('./util/database');
const {User, createAdmin} = require('./model/user');
// MIDDLEWARE
const {isAuth} = require('./middleware/is-auth');
// ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const {get404, get500} = require('./controllers/error');

// APP
const app = express();
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'sessions'
});

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// MIDDLEWARE
app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));
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
    app.listen(process.env.PORT, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  } catch(err) {
    console.error(err);
    throw err;
  }
})();
