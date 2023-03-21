const {User} = require('../model/user');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SG_API_KEY,
    }
}));
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        formsCSS: true,
        errorMessage: req.flash('error')[0],
        // isAuthenticated: req.session.isLoggedIn,
    });
};

const getSignup = (req, res, next) => {
    console.log(req.flash('error')[0]);
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        formsCSS: true,
        errorMessage: req.flash('error')[0],
        // isAuthenticated: req.session.isLoggedIn,
    });
};

const postLogin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            await req.flash('error', 'Invalid email');
            return res.redirect('/login');
        }
        const match = await user.comparePassword(password);
        if (!match) {
            await req.flash('error', 'Invalid password');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
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
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            await req.flash('error', 'Email already exists');
            return res.redirect('/signup');
        }
        if (password !== confirmPassword) {
            await req.flash('error', 'Passwords do not match');
            return res.redirect('/signup');
        }
        const newUser = new User({email, password});
        await newUser.save();
        transporter.sendMail({
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

module.exports = {getLogin, getSignup, postLogin, postLogout, postSignup};