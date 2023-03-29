const express = require('express');

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postAddToCart,
  postRemoveFromCart,
  postOrder,
  getOrders,
  getInvoice,
} = require('../controllers/shop');
const {isAuth} = require('../middleware/is-auth');

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:prodId', getProduct);
router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postAddToCart);
router.post('/cart-delete-item', isAuth, postRemoveFromCart);
router.post('/create-order', isAuth, postOrder);
router.get('/orders', isAuth, getOrders);
router.get('/orders/:orderId', isAuth, getInvoice);

module.exports = router;
