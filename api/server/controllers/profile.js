'use strict';


let Response = require('../models/response');
let NewsFeedService = require('../services/newsfeed');
let UserService = require('../services/userservice');

module.exports.feed = feed;
module.exports.get = get;

async function get(req, res, next) {

    let userId = req.query.userId;

    if(!userId) {
        // We couldn't find that user's info.
        return Response.send(400, null, 'no query param', null, res);
    }

    try {
        let user = await UserService.getInfo(userId);
        return Response.send(200, null, null, user, res);
    }

    catch(e) {
        return Response.send(400, null, 'We couldn\'t find that user\'s info.', null, res);
    }

}


function feed(req, res) {

    let userId = req.query.userId || "";

    if(userId === undefined || !userId || userId.length === 0) {
        return Response.send(400, '', 'No user was specified.');
    }

    let page = req.query.page;
    let numItems = req.query.numItems;

    return NewsFeedService.get(userId, page, numItems, true, function(err, items) {
        if(err) {
            return Response.send(500, null, 'Couldn\'t get news feed right now. Please try again later.', null, res);
        }

        else {
            return Response.send(200, null, null, items, res);
        }
    });
}