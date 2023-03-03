const express = require('express');

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postAddToCart,
  postCartDeleteItem,
  getCheckout,
  getOrders,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);
router.get('/cart', getCart);
router.post('/cart', postAddToCart);
router.post('/cart-delete-item', postCartDeleteItem);
router.get('/orders', getOrders);
router.get('/checkout', getCheckout);

module.exports = router;
