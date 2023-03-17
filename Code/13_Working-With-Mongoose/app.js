// GLOBAL DEPENDENCIES
const path = require('path');

// EXTERNAL DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
// const which = require('which');
const mongoose = require('mongoose');

// UTILS
const rootDir = require('./util/path');

// ROUTES
const get404 = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// DATABASE
const {mongoConnect} = require('./util/database');
const {User, createAdmin} = require('./model/user');

const app = express();

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// MIDDLEWARE
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use(async (req, res, next) => {
  try {
    const admin = await User.findOne({isAdmin: true});
    req.user = admin;
    next();
  } catch (err) {
    console.error(err);
  }
});

// ROUTING
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// ERRORS
app.use(get404);

// RELATIONSHIPS

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
