'use strict';

let User = require('../models/user');

module.exports.getInfo = getInfo;


async function getInfo(userId) {

    if(!userId) {
        return new Promise(function(resolve, reject) {
            reject('No user found!');
        });
    }

    return new Promise(function(resolve, reject) {

        User.get(userId, function(err, user) {

            if(err) {
                reject(err);
            }

            else {
                resolve(user);
            }

        });


    });

}