'use strict';

var passport = require('passport');
let Response = require('../models/response');

module.exports.root = root;

function root(req, res, next) {
    const username = req.user.username || "friend";
    return Response.send(200, "Welcome to Audibit, " + username, null, null, res);
}