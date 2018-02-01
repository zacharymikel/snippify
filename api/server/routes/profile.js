'use strict';

var express = require('express');
var router = express.Router();
var secured = require('../services/authservice').secured;
let profileCtrl = require('../controllers/profile');

router.get('/', secured, profileCtrl.get);
router.get('/news-feed', secured, profileCtrl.feed);


module.exports = router;