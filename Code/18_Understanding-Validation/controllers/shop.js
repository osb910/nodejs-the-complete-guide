const Product = require('../model/product');
const Order = require('../model/order');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

const getProduct = async (req, res) => {
  const {prodId} = req.params;
  try {
    const product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      product,
      path: '/products',
      pageTitle: product.title,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

const getIndex = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (err) {
    console.error(err);
  }
};

const getCart = async (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect('/login');
  const {items, totalPrice} = await req.user.getCart();
  res.render('shop/cart', {
    items,
    totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

const getOrders = async (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect('/login');
  try {
    const orders = await Order.find({'user.userId': req.user._id});
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
    });
  } catch (err) {
    console.error(err);
  }
};

const postAddToCart = async (req, res) => {
  const {productId} = req.body;
  try {
    const product = await Product.findById(productId);
    const {acknowledged, modifiedCount} = await req.user.addToCart(product);
    acknowledged && modifiedCount && res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postRemoveFromCart = async (req, res) => {
  const {productId} = req.body;
  try {
    const {acknowledged, modifiedCount} = await req.user.removeFromCart(productId);
    acknowledged && modifiedCount && res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postOrder = async (req, res) => {
  try {
    // create an order
    const {items, totalPrice} = await req.user.getCart();
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user._id
      },
      items,
      totalPrice,
    });
    // save the order
    const result = await order.save();
    // clear the cart
    result && await req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  getOrders,
  postAddToCart,
  postRemoveFromCart,
  postOrder,
};
