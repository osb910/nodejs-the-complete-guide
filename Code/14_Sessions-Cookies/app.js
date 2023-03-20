// GLOBAL DEPENDENCIES
const path = require('path');
// EXTERNAL DEPENDENCIES
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
dotenv.config();
// const which = require('which');
// UTILS
const rootDir = require('./util/path');
// DATABASE
const {mongoUri, mongoConnect} = require('./util/database');
const {User, createAdmin} = require('./model/user');
// ROUTES
const get404 = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

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
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
});

// ROUTING
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// ERRORS
app.use(get404);


(async () => {
  try {
    await mongoConnect();
    const admin = (await User.findOne({isAdmin: true})) ?? (await createAdmin());
    app.listen(process.env.PORT, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
