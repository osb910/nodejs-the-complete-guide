const Product = require('../model/product');

const getProducts = async (_, res) => {
  try {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (err) {
    console.error(err);
  }
};

const getProduct = async (req, res) => {
  const {prodId} = req.params;
  console.log({prodId});
  try {
    const product = await Product.findById(prodId);
    console.log({product});
    res.render('shop/product-detail', {
      product,
      path: '/products',
      pageTitle: product.title,
    });
  } catch (err) {
    console.error(err);
  }
};

const getIndex = async (_, res) => {
  try {
    const products = await Product.fetchAll();
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
  const {products, totalPrice} = await req.user.getCart();
  res.render('shop/cart', {
    products,
    totalPrice,
    pageTitle: 'Your Cart',
    path: '/cart',
  });
};

const getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders();
    console.log({orders});
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
    const result = await req.user.addToCart(product);
    console.log({result});
    result.acknowledged && res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postRemoveFromCart = async (req, res) => {
  const {productId} = req.body;
  try {
    const result = await req.user.removeFromCart(productId);
    result.acknowledged && res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postOrder = async (req, res) => {
  try {
    // create an order
    const result = await req.user.createOrder();
    console.log({result});
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
