const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const {hash, compare, genSalt} = require('bcrypt');
const {validationResult} = require('express-validator');

const {User} = require('../model/user');

sgMail.setApiKey(process.env.SG_API_KEY);
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        formsCSS: true,
        errorMessage: req.flash('error')[0],
        oldInput: null,
        validationErrors: [],
    });
};

const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        formsCSS: true,
        errorMessage: req.flash('error')[0],
        oldInput: null,
        validationErrors: [],
    });
};

const getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        formsCSS: true,
        errorMessage: req.flash('error')[0],
    });
};

const getNewPassword = async (req, res, next) => {
    const {token} = req.params;
    try {
        const user = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}});
        if (!user) {
            await req.flash('error', 'Invalid token');
            return res.redirect('/reset');
        }
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            formsCSS: true,
            errorMessage: req.flash('error')[0],
            userId: user._id.toString(),
            passwordToken: token,
        });
    } catch(err) {
        console.error(err)
    }
};

const postLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        const [err] = errors.array();
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            formsCSS: true,
            errorMessage: `${err.msg}`,
            oldInput: {email, password},
            validationErrors: errors.array(),
        });
    }
    req.session.isLoggedIn = true;
    try {
        const err = await req.session.save();
        if (err) throw err;
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
};

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.error(err);
        res.redirect('/');
    });
};

const postSignup = async (req, res, next) => {
    const {email, password, confirmPassword} = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        const [err] = errors.array();
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            formsCSS: true,
            errorMessage: `${err.msg}`,
            oldInput: {email, password, confirmPassword},
            validationErrors: errors.array(),
        });
    }
    try {
        const newUser = new User({email, password});
        await newUser.save();
        sgMail.send({
            to: email,
            from: process.env.SG_EMAIL,
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>',
        });
        res.redirect('/login');
    } catch(err) {
        console.error(err);
    }
};

const postReset = async (req, res, next) => {
    const {email} = req.body;
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.error(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const user = await User.findOne({email});
        if (!user) {
            await req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3_600_000; // after 1 hour
        await user.save();
        const resetUrl = `${process.env.SITE_URL}/reset/${token}`;
        res.redirect('/');
        await sgMail.send({
            to: email,
            from: process.env.SG_EMAIL,
            subject: 'Reset Your Password',
            html: `
                <p>You requested a password reset.</p>
                <p>Click this <a href="${resetUrl}">link</a> to set a new password.</p>
            `,
        });
    });
};

const postNewPassword = async (req, res, next) => {
    const {newPassword, userId, passwordToken} = req.body;
    console.log({userId})
    try {
        const user = await User.findOne({
            _id: userId,
            resetToken: passwordToken,
            resetTokenExpiration: {$gt: Date.now()},
        });
        if (!user) {
            await req.flash('error', 'Invalid token');
            return res.redirect('/reset');
        }
        const salt = await genSalt(12);
        const passHash = await hash(newPassword, salt);
        user.password = passHash;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.redirect('/login');
    } catch(err) {
        console.error(err);
    }
};

module.exports = {getLogin, getSignup, getReset, getNewPassword, postLogin, postLogout, postSignup, postReset, postNewPassword};