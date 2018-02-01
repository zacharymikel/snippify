'use strict';

var express = require('express');

/**
 * Assign each api path to a route
 * @param router
 */
module.exports.init = function(router) {

    const routesPath = '../server/routes';
    router.use('/', require(routesPath + '/root'));
    router.use('/user', require(routesPath + '/user'));
    router.use('/auth', require(routesPath + '/auth'));
    router.use('/song', require(routesPath + '/song'));
    router.use('/news-feed', require(routesPath + '/newsfeed'));
    router.use('/profile', require(routesPath + '/profile'));

};