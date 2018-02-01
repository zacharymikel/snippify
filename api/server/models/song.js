let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate')

let Schema = mongoose.Schema;

let songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    song: {
        type: Buffer,
        required: true,
        select: false
    },
    encoding: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userName : {
        type: String,
        required: true
    },
    tags: {
        type: String,
    },
    snippet: {
        type: Buffer,
        required: true,
        select: false
    },
    albumArt: Buffer
});

songSchema.plugin(mongoosePaginate);

songSchema.statics.upload = function (userId, songProps, callback) {

    let self = this;
    songProps.user = userId;

    self.model('Song').create(songProps, function (err, song) {

        if (err) {
            return callback(err);
        }

        else {
            self.model('User').findOneAndUpdate(
                {"_id": userId },
                {"$push": { "songs": song._id }},
                function(err, user) {
                    callback(err, song);
                }
            );
        }

    });
};

/**
 *
 * @param songId
 * @param callback
 */
songSchema.statics.get = function(songId, callback) {

    var self = this;
    self.model('Song')

        .findOne({ "_id": songId })
        .select('+song +snippet')
        .exec(function(err, song) {

        if(err) {
            return callback(err);
        }

        else {
            return callback(err, song);
        }

    });

};


songSchema.statics.remove = function(songId, callback) {

    var self = this;

    self.model('Song')
       .findOne({ "_id": songId })
       .remove(function(err) {
           return callback(err);
    });

};



songSchema.statics.findByUserAndTitle = function(userId, title, fileName) {

    let self = this;

    return new Promise(function(resolve, reject) {

        self.model('Song')

            .findOne({$and: [{"user": userId}, {"title": title }]})

            .exec(function (err, song) {

                if (err) {
                    reject(err);
                }

                else {
                    resolve(song);
                }
            });
    });
};

songSchema.statics.getArt = function(songId, callback){
    let self = this;
    self.model('Song').findOne({"_id" : songId}, function(err, song){
        if(song && song.albumArt){
            return callback(err, song.albumArt.buffer);
        }else{
            return callback(err, 'error');
        }
    });
}


let Song = mongoose.model('Song', songSchema);
module.exports = Song;
