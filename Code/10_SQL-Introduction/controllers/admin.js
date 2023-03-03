const Product = require('../model/product');
const {generateUniqueID} = require('../util/numbers');

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

const getProducts = async (_, res) => {
  const products = await Product.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'All Products',
    path: '/admin/products',
  });
};

const getEditProduct = async (req, res) => {
  const {prodId} = req.params;
  const isEditing = req.query.edit;
  if (!isEditing) return res.redirect('/');
  const product = await Product.findById(prodId);
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

const postAddProduct = async (req, res) => {
  const {title, imageUrl, description, price} = req.body;
  const newProduct = new Product({title, imageUrl, description, price});
  await newProduct.save();
  res.redirect('/');
};

const postEditProduct = async (req, res) => {
  const {prodId, title, imageUrl, description, price} = req.body;
  const updatedProduct = new Product({
    id: prodId,
    title,
    imageUrl,
    description,
    price,
  });
  await updatedProduct.save();
  res.redirect('/admin/products');
};

const postDeleteProduct = async (req, res) => {
  const {prodId} = req.body;
  await Product.deleteById(prodId);
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
