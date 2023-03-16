const express = require('express');

const {users} = require('./admin');

const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
  res.render('users', {
    pageTitle: 'Users',
    users,
  });
});

module.exports = {usersRouter};
