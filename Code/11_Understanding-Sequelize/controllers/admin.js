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

const getProducts = async (req, res) => {
  try {
    const products = await req.user.getProducts();
    res.render('admin/products', {
      prods: products,
      pageTitle: 'All Products',
      path: '/admin/products',
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
    // const product = await Product.findByPk(prodId);
    const [product] = await req.user.getProducts({where: {id: prodId}});
    if (!product) return res.redirect('/admin/products');
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      editing: isEditing,
    });
  } catch (err) {
    console.error(err);
  }
};

const postAddProduct = async (req, res) => {
  const {title, imageUrl, description, price} = req.body;
  try {
    await req.user.createProduct({
      title,
      imageUrl,
      description,
      price,
    });
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

const postEditProduct = async (req, res) => {
  const {prodId, title, imageUrl, description, price} = req.body;
  try {
    let product = await Product.findByPk(prodId);
    product.title = title;
    product.imageUrl = imageUrl;
    product.description = description;
    product.price = price;
    await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
  }
};

const postDeleteProduct = async (req, res) => {
  const {prodId} = req.body;
  try {
    await Product.destroy({where: {id: prodId}});
    res.redirect('/admin/products');
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