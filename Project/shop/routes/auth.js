import express from 'express';

import {
    getLogin,
    getSignup,
    getReset,
    getNewPassword,
    postLogin,
    postLogout,
    postSignup,
    postReset,
    postNewPassword
} from '../controllers/auth.js';

import {
    validateLoginEmail,
    validateSignupEmail,
    validateLoginPassword,
    validateSignupPassword,
    validateSignupConfirmPassword
} from '../middleware/validation.js';

const router = express.Router();

router.get('/login', getLogin);

router.post(
    '/login',
    [validateLoginEmail, validateLoginPassword],
    postLogin
);

router.post('/logout', postLogout);

router.get('/signup', getSignup);

router.post(
    '/signup',
    [validateSignupEmail, validateSignupPassword, validateSignupConfirmPassword],
    postSignup
);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword);

export default router;