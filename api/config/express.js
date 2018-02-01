'use strict';

var passport = require('passport');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var logger = require('morgan');
var expressSession = require('express-session');
const cors = require('cors');
var flash = require('connect-flash');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');



module.exports.init = function(app) {

    var env = app.get('env');
    var config = require('./environments/app.' + env + '.json');

    // write the tmp directory if doesn't exist
    const tempDir = '/tmp/';
    fs.writeFile(path.resolve('./') + tempDir, null, {flag: 'wx'}, function(err) {
        if(err && err.code !== "EEXIST") {
            console.error("Problem writing file: temp directory");
        }

        mkdirp(path.resolve('./') + tempDir, function(err) {
            if(err && err.code !== "EEXIST") console.error("Problem writing file: temp directory");
        });
    });

    // express stuffs
    app.use(expressValidator());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.disable('x-powered-by');

    // session
    app.use(expressSession({ resave: true, secret: config.jwtOptions.secretOrKey, saveUninitialized: true }));

    // logging
    app.use(logger('dev'));

    // coors light
    app.use(cors());

    // passeporte
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

};
