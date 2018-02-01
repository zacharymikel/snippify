'use strict';

var ENV = process.env.NODE_ENV || 'development';
const config = require('./environments/app.' + ENV.toLowerCase() + '.json');

module.exports = config;