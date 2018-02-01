'use strict';

// Database
const mongoose = require('mongoose');
const config = require('./main');

module.exports.init = function(app) {
    mongoose.connect(config.dbUrl, { useMongoClient: true });
};

