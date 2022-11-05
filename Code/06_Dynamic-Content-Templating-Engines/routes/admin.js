const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminRouter = express.Router();

const products = [];

adminRouter.get('/add-product', (_, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
});

adminRouter.post('/add-product', (req, res, next) => {
  products.push({title: req.body.title});
  console.log(req.body);
  res.redirect('/');
});

module.exports = {adminRouter, products};
