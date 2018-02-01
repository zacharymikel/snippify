'use strict';

module.exports.upload = upload;
module.exports.getSnippet = getSnippet;
module.exports.getFull = getFull;
module.exports.remove = remove;
module.exports.getArt = getArt;

let Song = require('../models/song');
let User = require('../models/user');
let Response = require('../models/response');
let SongService = require('../services/songservice');


const fileExt = '.mp3';


function remove(req, res) {

    let userId = req.user._id;
    let songId = req.query.songId;

    if(songId === undefined || !songId) {
        return Response.send(400, null, 'Sorry, we couldn\'t find that song', null, res);
    }

    else {

        Song.get(songId, function(err, song) {

            if(err) {
                console.log(err);

                Response.send(500, null, 'A problem occured when we tried to remove your song.', null, res);
            }

            else if((song.user + '') !== (userId + '')) {
                Response.send(400, null, 'Trying to delete someone else\'s song, asshole? Wow.', null, res);
            }

            else {

                Song.remove(songId, function(err, song) {

                    if(err) {
                        Response.send(500, null, 'A problem occured when we tried to remove your song.', null, res);
                    }

                    else {
                        User.removeSong(userId, songId, function(err) {
                            if(err){
                                Response.send(500, null, 'A problem occured when we tried to remove your song.', null, res);
                            }
                        })
                        
                        Response.send(200, 'Song removed successfully.', null, null, res);
                    }

                });
            }

        });

    }

}

function getArt(req, res, next){
    if(!req.query.songId){
        return Response.send(400, null, 'Sorry the song Id specified is not available', null, res);
    } else{
        Song.getArt(req.query.songId, function(err, art){
            if(err){
                return Response.send(400, null, 'Sorry album art not available', null, res);
            } else{
                if(art !== 'error'){
                    var pic = new Buffer(art, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image',
                        'Content-Length': pic.length
                    });
                    res.end(pic);
                }else {
                    return Response.send(400, null, 'Sorry album art not available', null, res);                    
                }
            }
        })
    }
}


function getSnippet(req, res) {

    // we have to do this gross thing here because controller functions don't take extra params
    req.query.snippet = true;
    return getFull(req, res, null, true);
}

function getFull(req, res, next) {

    let songId = req.query.songId;
    let snippet = req.query.snippet;

    if(!songId || songId === undefined) {
        return Response.send(400, null, 'You didn\'t specify the song!');
    }

    else {

        Song.get(songId, function(err, s) {


            if(err)
                return Response.send(400, null, 'Sorry, we couldn\'t find that song', null, res);

            else {

                let songData = [];

                if(snippet === true) {
                    songData = s.snippet;
                }
                else {
                    songData = s.song;
                }

                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': 'attachment; filename=' + s.title + '.mp3',
                    'Content-Length': songData.length
                });

                res.end(songData);

            }
        });

    }

}



// Needs to song name needs to be in field name=songName
// File needs to be on a file input with field name=songFile
async function upload(req, res) {

    let userId = req.user._id;
    let userName = req.user.name;

    // Make sure file got sent
    if (!req.files)
        return Response.send(400, null, 'No files were uploaded', null, res);

    let albumArt = "";

    if(req.files.imageFile) {
        albumArt = req.files.imageFile.data.toString('base64');
    }

    console.log(req.body);
    // Set the data we want
    let data = {
        title : req.body.songName,
        song : req.files.songFile.data,
        albumArt: albumArt,
        encoding: req.files.songFile.encoding,
        mimetype: req.files.songFile.mimetype,
        userName: userName,
        start : req.body.start,
        end : req.body.end,
        description: req.body.description,
        tags: req.body.tags
    };

    // Attempt to upload
    let errors = [];
    for(let prop in data) {
        if((!data[prop] || data[prop] === undefined || data[prop] === "undefined") && prop !== "albumArt")
            errors.push('Nothing provided for ' + prop + '. Please try again.');
    }

    if(data.mimetype !== 'audio/mp3'){
        errors.push('Your file is in not in mp3 format.');
    }

    let existing = await Song.findByUserAndTitle(userId, data.title);

    if(existing) {
        errors.push("It looks like you've uploaded this song before. Try a different one?");
    }

    if(errors.length > 0){
        return Response.send(400, null, errors, null, res);
    }


    try {
        await SongService.upload(userId, data, fileExt);
        return Response.send(200, "Your song was uploaded successfully!", null, null, res);

    }

    catch(e) {
        return Response.send(500, null, "We had a problem uploading your song. Please try again.", null, res);
    }

}





