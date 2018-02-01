'use strict';
let mongoose = require('mongoose');
let paginate = require('mongoose-paginate');
let User = mongoose.model('User');
let Song = mongoose.model('Song');
module.exports.get = get;


function get(userId, page, numItems, singleUser, callback) {

    // get all the userId's that this user follows
    User.findOne({ "_id": userId })

        .exec(function(err, user) {

            if(err) return callback("Couldn't find that user.");

            else {

                // the logged in user should see their own songs and other's in their news feed
                let users = [];

                // add all of the users that this user follows if this isn't a profile feed
                if(!singleUser) {
                    user.following.forEach(u => users.push(u));
                }
                
                users.push(user._id);
                Song.paginate({ "user": users }, {page : page, limit: 20}, function(err, songs) {
                    if(err) return callback("Sorry, your news feed is unavailable at the time.");
                    
                    let results = [];
                    for(let s in songs.docs) {
                        results.push({
                             "title": songs.docs[s].title,
                             "artist": {
                                 userId: songs.docs[s].user,
                                 name: songs.docs[s].userName
                             },
                             "id": songs.docs[s]._id,
                             "duration": songs.docs[s].end - songs.docs[s].start,
                             "description": songs.docs[s].description || '',
                             "tags": songs.docs[s].tags || ''
                         });
                    }
                    console.log(results);

                    return callback(err, results);
                });
            }
        });
}