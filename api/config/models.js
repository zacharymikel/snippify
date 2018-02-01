'use strict';

module.exports.init = function(app) {

    var models = [
        'user'
    ];

    models.forEach(function(model) {
        require(app.get('root') + '/server/models/' + model);
    });

};