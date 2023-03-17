const get404 = (_, res, next) => {
  res
    .status(404)
    .render('not-found', {pageTitle: 'Page Not Found', path: '/404'});
};

module.exports = get404;
