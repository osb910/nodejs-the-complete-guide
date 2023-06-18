const get404 = (req, res, next) => {
  res
    .status(404)
    .render('not-found', {
      pageTitle: 'Page Not Found',
      path: '/404',
      isAuthenticated: req.session.isLoggedIn
    });
};

const get500 = (req, res, next) => {
    res
        .status(500)
        .render('500', {
            pageTitle: 'Server Error',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        });
};

const serverError = (err, next) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
}

export {get404, get500, serverError};
