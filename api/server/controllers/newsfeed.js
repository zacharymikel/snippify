'use strict';

let Response = require('../models/response');
let NewsFeedService = require('../services/newsfeed');

module.exports.get = get;


function get(req, res) {

    if(!req.user._id) {
        return Response.send(400, null, "We couldn't find that user. Are you logged in?", null, res);
    }

    let userId = req.user._id;
    let page = req.query.page;
    let numItems = req.query.numItems || 0;

    // get the news feed for this user with page & number of items
    NewsFeedService.get(userId, page, numItems, false, function(err, items) {

        if(err) {
            return Response.send(500, null, 'Couldn\'t get your news feed right now. Please try again later', null, res);
        }

        else {
            return Response.send(200, null, null, items, res);
        }

    });



}