const express = require('express');

const adminRouter = express.Router();

const users = [];

adminRouter.get('/add-user', (req, res) => {
  res.render('add-user', {
    pageTitle: 'Add User',
  });
});

adminRouter.post('/add-user', (req, res) => {
  const {name} = req.body;
  users.push({name});
  res.redirect('/');
});

module.exports = {adminRouter, users};
