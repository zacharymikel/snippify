var passport = require('passport');

var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

var PasswordService = require('../../server/services/PasswordService');

module.exports = function(app){

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },

        function(req, username, password, done) {

            var email = req.body.email;

            if(email === undefined && username === undefined) {
                return done(null, false, req.flash('errors', 'No email or username specified!'));
            }

            else if(email === undefined) {
                email = "";
            }

            email = email.toLowerCase();
            username = username.toLowerCase();

            User.findOne(

                { $or: [{ 'email': email }, { 'username': username }] })

                .select('+password +passwordSalt')

                .exec(function(err, user) {

                    if (err) {
                        return callback(err, null);
                    }

                    // no user found just return the empty user
                    if (!user) {
                        return done(null, false, req.flash('errors', 'Sorry, that user doesn\'t exist'));
                    }

                    // verify the password with the existing hash from the user
                    PasswordService.verify(password, user.password, user.passwordSalt, function(err, result) {

                        if (err) {
                            return done(null, false, req.flash('errors', 'There was a problem with the username or password'));
                        }

                        // if password does not match don't return user
                        if (result === false) {
                            return done(null, false, req.flash('errors', 'Invalid username or password.'));
                        }

                        // remove password and salt from the result
                        user.password = undefined;
                        user.passwordSalt = undefined;

                        // return user if everything is ok
                        return done(null, user);
                    });
                });

        })
    );

};
