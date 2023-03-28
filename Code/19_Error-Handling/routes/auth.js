const express = require('express');

const {
    getLogin,
    getSignup,
    getReset,
    getNewPassword,
    postLogin,
    postLogout,
    postSignup,
    postReset,
    postNewPassword
} = require('../controllers/auth');

const {
    validateLoginEmail,
    validateSignupEmail,
    validateLoginPassword,
    validateSignupPassword,
    validateSignupConfirmPassword
} = require('../middleware/validation');

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

module.exports = router;