const {User} = require('../model/user');
const getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        formsCSS: true,
        isAuthenticated: req.session.isLoggedIn,
    });
};

const postLogin = async (req, res, next) => {
    try {
        const admin = await User.findOne({isAdmin: true});
        req.session.user = admin;
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
}

module.exports = {getLogin, postLogin, postLogout};