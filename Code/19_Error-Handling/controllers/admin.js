const {validationResult} = require('express-validator');
const {Types} = require('mongoose');
const Product = require('../model/product');
const {User} = require("../model/user");
const {serverError} = require("./error");

const getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    product: null,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
    editing: false,
    errorMessage: '',
    validationErrors: [],
  });
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({userId: req.user._id}).populate('userId', 'name');
    res.render('admin/products', {
      prods: products,
      pageTitle: 'All Products',
      path: '/admin/products',

    });
  } catch (err) {
    return serverError(err, next);
  }
};

const getEditProduct = async (req, res, next) => {
  const {prodId} = req.params;
  const isEditing = req.query.edit;
  if (!isEditing) return res.redirect('/');
  try {
    const product = await Product.findById(prodId);
    if (!product) return res.redirect('/admin/products');
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      editing: isEditing,
      errorMessage: '',
      validationErrors: [],
    });
  } catch (err) {
    return serverError(err, next);
  }
};

const postAddProduct = async (req, res, next) => {
  const {title, imageUrl, description, price} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [err] = errors.array();
    return res.status(422).render('admin/edit-product', {
      product: {title, imageUrl, description, price},
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      activeAddProduct: true,
      formsCSS: true,
      productCSS: true,
      editing: false,
      errorMessage: err.msg,
      validationErrors: errors.array(),
    });
  }
  const user = req.user;
  try {
    const newProduct = new Product({
      title,
      imageUrl,
      description,
      price: +price,
      userId: user._id,
    });
    const result = await newProduct.save();
    console.log(result);
    res.redirect('/admin/products');
  } catch (err) {
    return serverError(err, next);
  }
};

const postEditProduct = async (req, res, next) => {
  const {prodId, title, imageUrl, description, price} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [err] = errors.array();
    return res.status(422).render('admin/edit-product', {
      product: {prodId, title, imageUrl, description, price},
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      activeAddProduct: true,
      formsCSS: true,
      productCSS: true,
      editing: true,
      errorMessage: err.msg,
      validationErrors: errors.array(),
    });
  }
  try {
    let product = await Product.findById(prodId);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    Object.assign(product, {title, imageUrl, description, price: +price});
    const result = await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    return serverError(err, next);
  }
};

const postDeleteProduct = async (req, res, next) => {
  const {prodId} = req.body;
  try {
    const allUsers = await User.find();
    for (const user of allUsers) {
      const removalResult = await user.removeFromCart(prodId);
    }
    const removedDoc = await Product.deleteOne({_id: prodId, userId: req.user._id});
    removedDoc && res.redirect('/admin/products');
  } catch (err) {
    return serverError(err, next);
  }
};

module.exports = {
  getAddProduct,
  getProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  postDeleteProduct,
};
