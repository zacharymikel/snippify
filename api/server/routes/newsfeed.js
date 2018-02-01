'use strict';

var express = require('express');
var router = express.Router();
var NewsFeedCtrl = require('../controllers/newsfeed');
var secured = require('../services/authservice').secured;

router.get('/', secured, NewsFeedCtrl.get);

module.exports = router;