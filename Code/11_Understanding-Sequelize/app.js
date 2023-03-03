// GLOBAL DEPENDENCIES
const path = require('path');

// EXTERNAL DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// UTILS
const rootDir = require('./util/path');

// ROUTES
const get404 = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// DATABASE
const sequelize = require('./util/database');
const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-item');
const Order = require('./model/order');
const OrderItem = require('./model/order-item');

const app = express();

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// MIDDLEWARE
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
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
User.hasMany(Product);
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize
  // .sync({force: true})
  .sync()
  .then(async result => {
    // console.log(result);
    const user =
      (await User.findByPk(1)) ??
      (await User.create({
        name: 'Omar',
        email: 'omar@test.com',
        isAdmin: true,
      }));
    await user.createCart();
    app.listen(3000, () => {
      console.log('firstUser', user.dataValues);
      console.log('Running on port 3000');
    });
  })
  .catch(err => console.error(err));
