const Product = require('../model/product');

const getAddProduct = (_, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
};

const postAddProduct = (req, res, next) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();
  res.redirect('/');
};

const getProducts = (_, res, next) => {
  const renderShop = products => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      formsCSS: true,
    });
  };
  Product.fetchAll(renderShop);
};

module.exports = {getAddProduct, postAddProduct, getProducts};
