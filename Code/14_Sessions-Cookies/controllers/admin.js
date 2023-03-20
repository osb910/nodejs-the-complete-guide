const Product = require('../model/product');
const {User} = require("../model/user");

const getAddProduct = (req, res) => {
  console.log(req.isLoggedIn);
  res.render('admin/edit-product', {
    product: null,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'name');
    res.render('admin/products', {
      prods: products,
      pageTitle: 'All Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

const getEditProduct = async (req, res) => {
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
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

const postAddProduct = async (req, res) => {
  const {title, imageUrl, description, price} = req.body;
  const user = req.user;
  console.log({user});
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
    console.log(err);
  }
};

const postEditProduct = async (req, res) => {
  const {prodId, title, imageUrl, description, price} = req.body;
  try {
    let product = await Product.findById(prodId);
    Object.assign(product, {title, imageUrl, description, price: +price});
    const result = await product.save();
    console.log(result);
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
  }
};

const postDeleteProduct = async (req, res) => {
  const {prodId} = req.body;
  try {
    const allUsers = await User.find();
    for (const user of allUsers) {
      const removalResult = await user.removeFromCart(prodId);
    }
    const removedDoc = await Product.findByIdAndDelete(prodId);
    removedDoc && res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
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
