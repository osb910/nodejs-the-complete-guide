// GLOBAL DEPENDENCIES
const path = require('path');

// EXTERNAL DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
// const which = require('which');

// UTILS
const rootDir = require('./util/path');

// ROUTES
const get404 = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// DATABASE
const {mongoConnect, getDb, findOne} = require('./util/database');
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
    const admin = await findOne('users', {isAdmin: true});
    req.user = new User({id: admin._id, ...admin});
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
    const admin =
      (await findOne('users', {isAdmin: true})) ?? (await createAdmin());
    // const productsCollection = db.collection('products');
    // const ordersCollection = db.collection('orders');
    // app.locals.productsCollection = productsCollection;
    // app.locals.usersCollection = usersCollection;
    // app.locals.ordersCollection = ordersCollection;
    app.listen(3141, () => {
      console.log('Running on port 3141');
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
