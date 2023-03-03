const Product = require('../model/product');

const getProducts = (_, res) => {
  const renderShop = products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  };
  Product.fetchAll(renderShop);
};

const getIndex = (_, res) => {
  const renderShop = products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  };
  Product.fetchAll(renderShop);
};

const getCart = (_, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
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

module.exports = {getProducts, getIndex, getCart, getOrders, getCheckout};
