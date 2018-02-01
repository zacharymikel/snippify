'use strict';

var jwt = require('jsonwebtoken');
const config = require('../../config/main');


module.exports.getJwt = getJwt;

function getJwt(user) {

    var options = {
        'expiresIn': config.jwtOptions.expiresIn
    };

    var payload = {id: user.id};

    return jwt.sign(payload, config.jwtOptions.secretOrKey, options);
}