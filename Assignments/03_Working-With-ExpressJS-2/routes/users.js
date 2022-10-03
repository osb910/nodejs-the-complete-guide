const path = require('path');
const fs = require('fs');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (_, res) => {
  // const users = fs
  //   .readFileSync('../users.txt', {encoding: 'utf-8'})
  //   .split('\n');
  // users.shift();
  // console.log({users});
  res.sendFile(path.join(rootDir, 'views', 'users.html'));
  // const usersList = document.querySelector('.main-header__item-list');
  // console.log(usersList);
});

module.exports = router;
