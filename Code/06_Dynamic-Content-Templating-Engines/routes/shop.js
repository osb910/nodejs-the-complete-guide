const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const {products} = require('./admin');

const router = express.Router();

router.get('/', (_, res, next) => {
  console.log({products});
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    formsCSS: true,
  });
});

module.exports = router;
