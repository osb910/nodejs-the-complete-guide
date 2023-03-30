const express = require('express');

const {
  getAddProduct,
  getProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin');
const {
  validateProductTitle,
  validateProductImageUrl,
  validateProductPrice,
  validateProductDescription
} = require("../middleware/validation");
const Product = require("../model/product");

const router = express.Router();

// /admin/add-product > GET
router.get('/add-product', getAddProduct);

// /admin/products > GET
router.get('/products', getProducts);

// /admin/edit-product > GET
router.get('/edit-product/:prodId', getEditProduct);

// /admin/add-product > POST
router.post(
    '/add-product',
    [
        validateProductTitle,
            // .custom(async (value, {req}) => {
            //   const porduct = await Product.findOne({title: req.body.title});
            //   if (porduct) return Promise.reject('Product title exists');
            //   return true;
            // }),
      validateProductPrice, validateProductDescription],
    postAddProduct
);

// /admin/edit-product > POST
router.post(
    '/edit-product',
    [validateProductTitle, validateProductPrice, validateProductDescription],
    postEditProduct
);

// /admin/delete-product > POST
router.post('/delete-product', postDeleteProduct);

module.exports = router;
