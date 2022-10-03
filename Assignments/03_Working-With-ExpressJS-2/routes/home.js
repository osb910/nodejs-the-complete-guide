const path = require('path');
const fs = require('fs');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (_, res) => {
  res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

router.post('/create-user', (req, res) => {
  const newUser = req.body.username;
  fs.appendFile('users.txt', `\n${newUser}`, err => {
    console.log(err);
    res.statusCode = 302;
    res.redirect('/users');
  });
});

module.exports = router;
