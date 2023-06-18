import {validationResult} from 'express-validator';
import Product from '../model/product.js';
import {User} from '../model/user.js';
import {deleteFile} from '../util/file.js';
import {serverError} from './error.js';

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
  const {title, description, price} = req.body;
  const imageFile = req.file;
  const errors = validationResult(req);
  let errorMessage = '';
  if (!imageFile) {
    errorMessage = 'Attached file is not an image.';
  }
  if (!errors.isEmpty() || errorMessage) {
    const [err] = errors.array();
    errorMessage = err?.msg || errorMessage;
    return res.status(422).render('admin/edit-product', {
      product: {title, description, price},
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      activeAddProduct: true,
      formsCSS: true,
      productCSS: true,
      editing: false,
      errorMessage,
      validationErrors: errors.array(),
    });
  }
  const imageUrl = imageFile.path;
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
  const {prodId, title, description, price} = req.body;
  const imageFile = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [err] = errors.array();
    return res.status(422).render('admin/edit-product', {
      product: {prodId, title, description, price},
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
    if (imageFile) {
      deleteFile(product.imageUrl);
      product.imageUrl = imageFile.path;
    }
    Object.assign(product, {title, description, price: +price});
    const result = await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    return serverError(err, next);
  }
};

const deleteProduct = async (req, res, next) => {
  const {prodId} = req.params;
  try {
    const allUsers = await User.find();
    for (const user of allUsers) {
      await user.removeFromCart(prodId);
    }
    const removedDoc = await Product.findOneAndRemove({_id: prodId, userId: req.user._id});
    if (!removedDoc) return next(new Error('Product not found'));
    deleteFile(removedDoc.imageUrl);
    res.status(204).json({message: 'deleted'});
  } catch (err) {
    return serverError(err, next);
  }
};

export {
  getAddProduct,
  getProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  deleteProduct,
};
