const express = require('express');
const {getLogin, postLogin, postLogout} = require("../controllers/auth");

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

// router.get('/signup', (req, res, next) => {});

// router.post('/signup', (req, res, next) => {});

module.exports = router;