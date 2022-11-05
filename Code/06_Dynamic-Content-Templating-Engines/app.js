const path = require('path');

const express = require('express');

const rootDir = require('./util/path');
const {adminRouter, products} = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRouter);
app.use(shopRoutes);

app.use((_, res, next) => {
  res
    .status(404)
    .render('not-found', {pageTitle: 'Page Not Found', path: false});
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
