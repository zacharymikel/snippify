// App
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// lowercase this because we pull config settings from json files named after
// their environments
var ENV = process.env.NODE_ENV || 'development';
app.set('root', __dirname);
app.set('env', ENV.toLowerCase());


// Setup dependencies
var router = express.Router();

require('./config/main');
require('./config/models').init(app);
require('./config/mongoose').init(app);
require('./config/passport/init').init(app);
require('./config/express').init(app);
require('./config/routes').init(router);

app.use(fileUpload());
app.use('/api', router);

// Serve 404 page on not found
app.use(function(req, res, next) {
    res.status(404).json("404 - not found");
});


// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);


// Create HTTP server
const http = require('http');
const server = http.createServer(app);

server.listen(port, function() {
    console.log('API running on localhost:' + port);
});