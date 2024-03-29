import express from 'express';

import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postAddToCart,
  postRemoveFromCart,
  postOrder,
  getOrders,
  getInvoice,
} from '../controllers/shop.js';
import {isAuth} from '../middleware/is-auth.js';

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

export default router;