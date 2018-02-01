'use strict';

var express = require('express');
var router = express.Router();
var rootCtrl = require('../controllers/root');
var secured = require('../services/authservice').secured;

router.get('/', secured, rootCtrl.root);

module.exports = router;