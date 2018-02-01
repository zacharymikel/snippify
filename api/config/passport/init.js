'use strict';

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.init = function(app) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, done);
    });

    require('./login')(app);
    require('./signup')(app);
    require('./jwt')(app);

};
