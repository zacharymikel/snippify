var LocalStrategy   = require('passport-local').Strategy;

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },

        function(req, username, password, done) {


            // TODO: this is lame to have all this validation code right here
            // we should have a validation middleware
            var email = req.body.email;

            if(email === undefined && username === undefined) {
                return done(null, false, req.flash('errors', 'No email or username specified!'));
            }

            else if(email === undefined) {
                return done(null, false, req.flash('errors', 'No email specified!'));
            }

            email = email.toLowerCase();
            username = username.toLowerCase();

            email = email.replace(/\s/g,'');
            username = username.replace(/\s/g,'');


            var env = app.get('env');
            var config = require('../environments/app.' + env + '.json');


            var findOrCreateUser = function() {

                // find a user in Mongo with provided email or username
                User.findOne({

                    $and: [{ $or: [{ 'email': email }, { username: 'username' }] }]

                }, function(err, user) {

                    // In case of any error, return using the done method
                    if (err){
                        return done(err);
                    }

                    // already exists
                    else if (user) {
                        return done(null, false, req.flash('errors', 'User Already Exists'));
                    }

                    else {

                        var userProps = {
                            username: username,
                            email: email,
                            password: password,
                            name: req.body.name
                        };

                        User.signup(userProps, function(err, user) {

                            var error = "";

                            if(err) {

                                if(err.errmsg.includes("username")) {
                                    error = "That username is already taken!";
                                }

                                else if(err.errmsg.includes("email")) {
                                    error = "An account already exists with that email!";
                                }

                                return done(null, false, req.flash('errors', error));
                            }

                            else if(user === undefined) {
                                return done(null, false, req.flash('errors', 'Invalid signup info' ));
                            }

                            else {
                                return done(null, user, req.flash('message', 'Signup successful!' ));
                            }
                        });

                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

};
