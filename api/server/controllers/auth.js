'use strict';

var passport = require('passport');
var jwtService = require('../services/jwtservice');
let Response = require('../models/response');

const config = require('../../config/main');

module.exports.login = login;
module.exports.logout = logout;


/* Handle Login POST */
function login(req, res, next) {

    passport.authenticate('login', function(err, user) {

        if(err || !user) {
            return Response.send(401, null, req.flash('errors'), null, res);
        }

        else {

            req.login(user, function(err) {

                if(err) {
                    return Response.send(401, null, req.flash('errors'), null, res);
                }

                delete(req.session.historyData);

                let token = jwtService.getJwt(user);
                return Response.send(200, "Success!", null, { "token": token }, res);

            });

        }

    })(req, res, next);

}

function logout(req, res) {
    req.logout();
    Response.send(200, "You are logged out", null, null, res);
}