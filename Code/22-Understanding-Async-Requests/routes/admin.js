import express from 'express';

import {
  getAddProduct,
  getProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  deleteProduct,
} from '../controllers/admin.js';
import {
  validateProductTitle,
  validateProductImageUrl,
  validateProductPrice,
  validateProductDescription
} from '../middleware/validation.js';
import Product from '../model/product.js';

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
    [validateProductTitle, validateProductPrice, validateProductDescription],
    postAddProduct
);

// /admin/edit-product > POST
router.post(
    '/edit-product',
    [validateProductTitle, validateProductPrice, validateProductDescription],
    postEditProduct
);

// /admin/delete-product > DELETE
router.delete('/delete-product/:prodId', deleteProduct);

export default router;