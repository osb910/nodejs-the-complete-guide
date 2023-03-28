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
    [validateProductTitle, validateProductImageUrl, validateProductPrice, validateProductDescription],
    postAddProduct
);

// /admin/edit-product > POST
router.post(
    '/edit-product',
    [validateProductTitle, validateProductImageUrl, validateProductPrice, validateProductDescription],
    postEditProduct
);

// /admin/delete-product > POST
router.post('/delete-product', postDeleteProduct);

module.exports = router;
