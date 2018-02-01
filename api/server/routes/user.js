'use strict';

var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user');
var secured = require('../services/authservice').secured;

router.get('/', secured, userCtrl.info);
router.post('/signup', userCtrl.signup);
router.delete('/', secured, userCtrl.delete);
router.get('/follow', secured, userCtrl.follow);
router.get('/unfollow', secured, userCtrl.unfollow)
router.put('/', secured, userCtrl.update);
router.get('/profile-banner', secured, userCtrl.banner);
router.get('/profile-picture', secured, userCtrl.profile);
router.get('/search', secured, userCtrl.search);

module.exports = router;