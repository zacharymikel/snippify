'use strict';

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport');

module.exports = function(app) {

    var env = app.get('env');
    var config = require('../environments/app.' + env + '.json');

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.jwtOptions.secretOrKey;
    opts.passReqToCallback = true;

    passport.use(

        new JwtStrategy(opts, function(req, jwt_payload, done) {

                User.findOne({ _id: jwt_payload.id }, function(err, user) {

                    if (err) {
                        return done(err, false);
                    }

                    if (user) {

                        // TODO: verify role here
                        if(!req.user) {
                            req.login(user, function(err) {

                                if(err) return done(null, false);

                                return done(null, user);
                            });
                        }

                        else {
                            return done(null, user);
                        }



                    } else {
                        done(null, false);
                    }

                });
    }));

};



