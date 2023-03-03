const express = require('express');

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postAddToCart,
  postCartDeleteItem,
  postOrder,
  getOrders,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:prodId', getProduct);
router.get('/cart', getCart);
router.post('/cart', postAddToCart);
router.post('/cart-delete-item', postCartDeleteItem);
router.post('/create-order', postOrder);
router.get('/orders', getOrders);

module.exports = router;
