'use strict';

let passport = require('passport');
let jwtService = require('../services/jwtservice');
let Response = require('../models/response');
const mongoose = require('mongoose');
let User = mongoose.model('User');

module.exports.signup = signup;
module.exports.delete = deleteAccount;
module.exports.info = getSelfUserInfo;
module.exports.follow = follow;
module.exports.unfollow = unfollow;
module.exports.update = update;
module.exports.profile = profile;
module.exports.banner = banner;
module.exports.search = search;

function signup(req, res, next) {

    return Response.send(401, null, 'Sorry, we aren\'t accepting new user registrations at this time.', null, res);

    /*passport.authenticate('signup', function(err, user) {


        if(err || !user) {
            return Response.send(401, null, req.flash('errors'), null, res);
        }

        else {

            req.login(user, function(err) {

                if(err) {
                    return next(err);
                }

                delete(req.session.historyData);

                var token = jwtService.getJwt(user);
                return Response.send(200, "Success!", null, token, res);

            });

        }

    })(req, res, next);*/

}

function deleteAccount(req, res, next) {
    return Response.send(200, "Success!", token, res);
}

function getSelfUserInfo(req, res, next) {

    let userId = req.user._id;
    User.get(userId, function(err, user) {

        if(err) {
            return Response.send(400, null, "Couldn't get your user info right now.", null, res);
        }

        else {
            return Response.send(200, null, null, user, res);
        }

    });
}

function follow(req, res, next) {

    let followUserId = req.query.followUserId;
    User.follow(req.user._id, followUserId, function(err) {

        if(err) {
            return Response.send(400, null, 'Couldn\'t follow user at this time.', null, res);

        }

        else {
            return Response.send(200, "Success!", null, null, res);
        }

    });
}

function unfollow(req, res, next) {
    let unfollowUserId = req.query.userId;
    User.unfollow(req.user._id, unfollowUserId, function(err) {
        if(err) {
            return Response.send(400, null, 'Couldn\'t follow user at this time.', null, res);
        }
        else {
            return Response.send(200, "Success!", null, null, res);
        }
    })
}

function update(req, res, next){

    var profile;
    var banner;

    if(req.files && req.files.profile){
        profile = req.files.profile.data.toString('base64')
    }
    else {
        profile = null;
    }

    if(req.files && req.files.banner){
        banner = req.files.banner.data.toString('base64')
    }
    else {
        profile = null;
    }

    let userProps = {
        username: req.body.username,
        name: req.body.name,
        bio: req.body.bio,
        websiteUrl: req.body.websiteUrl,
        picture: profile,
        banner: banner
    };

    User.update(req.user._id, userProps, function(err, user){

        if(err) {
            return Response.send(400, null, err, null, res);
        }
        else {
            return Response.send(200, "Success!", null, user, res);
        }
    });
}

function profile(req, res, next){
    if(!req.query.userId){
        return Response.send(400, null, 'Sorry the user specified is not available', null, res);
    } else {
        User.getProfile(req.query.userId, function(err, profile){ 
            if(err){
                return Response.send(400, null, 'Sorry profile picture not available', null, res);
            } else{
                if(profile !== 'error'){
                    var pic = new Buffer(profile, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image',
                        'Content-Length': pic.length
                    });
                    res.end(pic);
                }else{
                    return Response.send(204, null, 'Sorry profile picture not available', null, res);
                }
            }
        });
    }
}
function banner(req, res, next){
    if(!req.query.userId){
        return Response.send(400, null, 'Sorry the user specified is not available', null, res);
    } else {
        User.getBanner(req.query.userId, function(err, banner){
            if(err){
                return Response.send(400, null, 'Sorry profile picture not available', null, res);
            } else{
                if(banner !== 'error'){
                    var pic = new Buffer(banner, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image',
                        'Content-Length': pic.length
                    });
                    res.end(pic);
                } else { 
                    return Response.send(204, null, 'Sorry banner picture not available', null, res);
                    
                }
            }
        });
    }
}

async function search(req, res, next) {

    if(!req.query.username || req.query.username === undefined) {
        req.query.username = "";
    }

    try {
        let result = await User.search(req.query.username);
        return Response.send(200, null, null, result, res);
    }

    catch(err) {
        console.log(err);
        return Response.send(400, null, "Could not execute search.", null, res);
    }
}