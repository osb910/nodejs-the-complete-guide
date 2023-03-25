const get404 = (req, res, next) => {
  res
    .status(404)
    .render('not-found', {
      pageTitle: 'Page Not Found',
      path: '/404',
      isAuthenticated: req.session.isLoggedIn
    });
};

module.exports = get404;
