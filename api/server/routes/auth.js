'use strict';

var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/auth');

router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

module.exports = router;