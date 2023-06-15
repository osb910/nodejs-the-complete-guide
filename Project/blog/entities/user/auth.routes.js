import express from 'express';

import {
  signup,
  login,
  getUserStatus,
  updateUserStatus,
} from './auth.controller.js';
import {signupValidator, loginValidator} from './user.validator.js';
import {isAuth} from '../../middleware/auth.middleware.js';
import {body} from 'express-validator';

const router = express.Router();

router.put('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/status', isAuth, getUserStatus);
router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  updateUserStatus
);

export default router;
