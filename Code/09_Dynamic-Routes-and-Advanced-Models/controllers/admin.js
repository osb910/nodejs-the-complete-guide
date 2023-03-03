const Cart = require('../model/cart');
const Product = require('../model/product');

const getAddProduct = (_, res) => {
  res.render('admin/edit-product', {
    product: null,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
    editing: false,
  });
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

const getEditProduct = (req, res) => {
  const {prodId} = req.params;
  const isEditing = req.query.edit;
  if (!isEditing) return res.redirect('/');
  const renderEditProduct = product => {
    if (!product) return res.redirect('/admin/products');
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      editing: isEditing,
    });
  };
  Product.findById(prodId, renderEditProduct);
};

const postAddProduct = (req, res) => {
  const {title, imageUrl, description, price} = req.body;
  const newProduct = new Product({title, imageUrl, description, price});
  newProduct.save();
  res.redirect('/');
};

const postEditProduct = (req, res) => {
  const {prodId, title, imageUrl, description, price} = req.body;
  const updatedProduct = new Product({
    id: prodId,
    title,
    imageUrl,
    description,
    price,
  });
  console.log({updatedProduct});
  updatedProduct.save();
  res.redirect('/admin/products');
};

const postDeleteProduct = (req, res) => {
  const {prodId} = req.body;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};

module.exports = {
  getAddProduct,
  getProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  postDeleteProduct,
};
