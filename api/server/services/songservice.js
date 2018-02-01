'use strict';

let path = require('path');
let fs = require('fs');
let Song = require('../models/song');
let cmd = require('node-cmd');
const tmpDir = '/tmp/';

module.exports.upload = upload;

async function upload(userId, data, fileExt) {

    String.prototype.replaceAll = function(search, replacement) {
        let target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    let fileName = path.resolve('./' + tmpDir + data.title.replaceAll(' ', '_').toLowerCase() + fileExt);
    let snippetFileName = path.resolve('./' + tmpDir + data.title.replaceAll(' ', '_').toLowerCase() + '-snippet' + fileExt);

    await (writeFile(fileName, data.song));
    await (snippet(fileName, snippetFileName, data.start, data.end));
    data.snippet = await (readFile(snippetFileName));

    Song.upload(userId, data, function(err, song) {
        if(err) throw new Error;
    });

    await Promise.all[destroyFile(fileName), destroyFile(snippetFileName)];

}


async function writeFile(fileName, data) {

    return new Promise(function(resolve, reject) {

        fs.writeFile(fileName, data, ['O_CREAT'], function(err, result) {
            if(err) {
                reject(err);
            }

            else {
                resolve(result);
            }
        });
    });

}

async function destroyFile(fileName) {

    return new Promise(function(resolve, reject) {

        fs.unlink(fileName, function(err, result) {
            if(err) {
                reject(err);
            }

            else {
                resolve(result);
            }
        });
    });

}


async function readFile(fileName) {

    return new Promise(function(resolve, reject) {

        fs.readFile(fileName, ['O_CREAT'], function(err, result) {
            if(err) {
                reject(err);
            }

            else {
                resolve(result);
            }
        });
    });

}


async function snippet(fileName, targetFileName, start, end) {

    return new Promise(function(resolve, reject) {

        let command = 'ffmpeg -ss ' + start + ' -t ' + (end - start) + ' -i ' +
            fileName + ' ' + targetFileName;

        cmd.get(command, function(err, result) {

            if(err) {
                reject(err);
            }

            else {
                resolve(result);
            }

        });

    });

}







