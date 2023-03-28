const {body} = require('express-validator');
const {User} = require('../model/user');
const Product = require('../model/product');

const validateLoginEmail = body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (value, {req}) => {
        const user = await User.findOne({email: req.body.email});
        if (!user) return Promise.reject('Email does not exist');
        req.session.user = user;
        return true;
    });

const validateSignupEmail = body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (value, {req}) => {
        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser) return Promise.reject('Email already exists');
        return true;
    });

const validateLoginPassword = body('password')
    .trim()
    .isLength({min: 5})
    .custom(async (value, {req}) => {
        const isValid = await req.session.user.comparePassword(req.body.password);
        if (!isValid) {
            req.session.user = null;
            return Promise.reject('Invalid password');
        }
        return true;
    });

const validateSignupPassword = body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters.')
    .trim()
    .isLength({min: 5});

const validateSignupConfirmPassword = body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!')
        }
        return true;
    });

const validateProductTitle = body('title')
    .trim()
    .isLength({min: 3}).withMessage('Title must be at least 4 characters long')
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage('Title must be alphanumeric')
    .escape()
    .custom(async (value, {req}) => {
        const porduct = await Product.findOne({title: req.body.title});
        if (porduct) return Promise.reject('Product title exists');
        return true;
    });

const validateProductImageUrl = body('imageUrl')
    .trim()
    .isURL().withMessage('Invalid image url')
    .custom((value, {req}) => {
        const ext = value.split('.').pop();
        if (!/(jpe?|pn|sv)g|[gt]iff?|bmp|eps/.test(ext)) throw new Error('Invalid image extension');
        return true;
    });

const validateProductPrice = body('price')
    .trim()
    .isNumeric({no_symbols: true}).withMessage('Invalid price')
    .isFloat();


const validateProductDescription = body('description')
    .trim()
    .isLength({min: 5, max: 400}).withMessage('Description must be between 5 and 400 characters long');

module.exports = {
    validateLoginEmail,
    validateSignupEmail,
    validateLoginPassword,
    validateSignupPassword,
    validateSignupConfirmPassword,
    validateProductTitle,
    validateProductImageUrl,
    validateProductPrice,
    validateProductDescription,
}