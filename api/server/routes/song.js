'use strict';

var express = require('express');
var router = express.Router();
var songCtrl = require('../controllers/song');
var secured = require('../services/authservice').secured;

router.get('/', songCtrl.getFull);
router.post('/upload', secured, songCtrl.upload);
router.get('/snippet/', songCtrl.getSnippet);
router.get('/album-art', songCtrl.getArt);
router.delete('/', secured, songCtrl.remove);

module.exports = router;