const Cart = require('../model/cart');
const Product = require('../model/product');
const db = require('../util/database');

const getProducts = async (_, res) => {
  const products = await Product.fetchAll();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getProduct = async (req, res) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  res.render('shop/product-detail', {
    product,
    path: '/products',
    pageTitle: product.title,
  });
};

const getIndex = async (_, res) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
  });
};

const getCart = (_, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = products.reduce((acc, product) => {
        const cartProduct = cart.products.find(prod => prod.id === product.id);
        cartProduct && acc.push({...product, qty: cartProduct.qty});
        return acc;
      }, []);

      res.render('shop/cart', {
        products: cartProducts,
        totalPrice: cart.totalPrice,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    });
  });
};

const postAddToCart = (req, res) => {
  const {productId} = req.body;
  // fetch the product in the file (db)
  Product.findById(productId, product => {
    // add the product to cart
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

const postCartDeleteItem = (req, res) => {
  const {productId} = req.body;
  Product.findById(productId, product => {
    Cart.removeProduct(productId, product.price);
    res.redirect('/cart');
  });
};

const getOrders = (_, res) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

const getCheckout = (_, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postAddToCart,
  postCartDeleteItem,
  getOrders,
  getCheckout,
};
