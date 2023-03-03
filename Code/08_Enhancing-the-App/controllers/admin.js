const Product = require('../model/product');

const getAddProduct = (_, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
};

const postAddProduct = (req, res) => {
  const {title, imageUrl, description, price} = req.body;
  const newProduct = new Product(title, imageUrl, description, price);
  newProduct.save();
  res.redirect('/');
};

const getProducts = (_, res) => {
  const renderShop = products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'All Products',
      path: '/admin/products',
    });
  };
  Product.fetchAll(renderShop);
};

module.exports = {getAddProduct, postAddProduct, getProducts};
