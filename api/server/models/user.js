var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PasswordService = require('../services/PasswordService');
var _ = require('lodash');
let mongoosePaginate = require('mongoose-paginate')

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:  {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordSalt: {
        type: String,
        required: true,
        select: false
    },
    bio: String,
    picture: {
        type: Buffer,
        select: false
    },
    banner: {
        type: Buffer,
        select: false
    },
    websiteUrl: String,
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    fans: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
});

userSchema.plugin(mongoosePaginate);


userSchema.statics.signup = function(userProps, callback) {

    var self = this;
    var data = _.cloneDeep(userProps);

    // hash the password
    PasswordService.hash(data.password, function(err, hashedPassword, salt) {

        if (err) {
            return callback(err);
        }

        data.password = hashedPassword;
        data.passwordSalt = salt;

        // create the user
        self.model('User').create(data, function(err, user) {

            if (err) {
                return callback(err, null);
            }

            // remove password and salt from the result
            user.password = undefined;
            user.passwordSalt = undefined;

            // return user if everything is ok
            callback(err, user);
        });
    });

};


userSchema.statics.authenticate = function(email, password, callback) {

    var self = this;

    self.model('User').findOne({ email: email }).select('+password +passwordSalt').exec(function(err, user) {

        if (err) {
            return callback(err, null);
        }

        // no user found just return the empty user
        if (!user) {
            return callback(err, user);
        }

        // verify the password with the existing hash from the user
        PasswordService.verify(password, user.password, user.passwordSalt, function(err, result) {

            if (err) {
                return callback(err, null);
            }

            // if password does not match don't return user
            if (result === false) {
                return callback(err, null);
            }

            // remove password and salt from the result
            user.password = undefined;
            user.passwordSalt = undefined;

            // return user if everything is ok
            return callback(err, user);
        });
    });
};


/**
 * Follow another user. Updates your user's following list and another user's fans list
 * @param userId
 * @param followUserId
 */
userSchema.statics.follow = function(userId, followUserId, next) {

    let self = this;

    self.model('User').findOneAndUpdate(
        {"_id": userId },
        {"$push": { "following": followUserId }},
        function(err) {

            if(err) return next(err);

            self.model('User').findOneAndUpdate(
                {"_id": followUserId },
                {"$push": { "fans": userId }},
                function(err) {
                    return next(err);
                }
            );
        }
    );

   
    
};

/**
 * Follow another user. Updates your user's following list and another user's fans list
 * @param userId
 * @param followUserId
 */
userSchema.statics.unfollow = function(userId, unfollowUserId, next) {
    
        let self = this;
    
        self.model('User').findOneAndUpdate(
            {"_id": userId },
            {"$pull": { "following": unfollowUserId }},
            function(err) {
                
                if(err) return next(err);

                self.model('User').findOneAndUpdate(
                    {"_id": unfollowUserId },
                    {"$pull": { "fans": userId }},
                    function(err) {
                        return next(err);
                    }
                );
            }
        );        
    };

userSchema.statics.update = function(userId, props, callback){

    let self = this;

    var update = {};

    if (props.username){
        update["username"] = props.username;
    }
    if (props.name) {
        update["name"] = props.name;
    }
    if(props.picture){
        update["picture"] = props.picture;
    }
    if(props.banner){
        update["banner"] = props.banner;
    }
    if(props.websiteUrl){
        update["websiteUrl"] = props.websiteUrl;
    }
    if(props.bio){
        update["bio"] = props.bio;
    }

    self.model('User').findOneAndUpdate(
        {"_id": userId },
        {"$set": update },
        {new: true},
        function(err, user) {
            if(err) return next;

            else
                callback(err, user);
        }
    );

};


userSchema.statics.get = function(userId, callback) {

    let self = this;

    self.model('User').findOne({ "_id": userId })
        .exec(function(err, user) {

            if(err) {
                return callback(err);
            }

            else {
                return callback(err, user);
            }

        });

};

userSchema.statics.getBanner = function(userId, callback){
    let self = this;

    self.model('User').findOne({"_id": userId}).select('+banner').exec(function(err, user) {
        if(user.banner){
            return callback(err, user.banner.buffer);
        } else {
            return callback(err, 'error')
        }
    })

};
userSchema.statics.getProfile = function(userId, callback){
    let self = this;

    self.model('User').findOne({"_id": userId}).select('+picture').exec(function(err, user) {
        if(user.picture){
            return callback(err, user.picture.buffer);
        }else{
            return callback(err, 'error')
        }
    });
}

userSchema.statics.search = async function(username) {

    let self = this;

    return new Promise(function(resolve, reject) {

        // searching for a real user
        if(username) {
            self.model('User')
                .find({"username": { $regex : new RegExp(username, "ig") }})
                .exec(function(err, users){

                    if(err) reject(err);

                    else {
                        resolve(users);
                    }

                });
        }

        // empty string is falsy so we will come here if username isn't specified
        else {

            self.model('User').paginate({}, { page: 1, limit: 20 }, function(err, users) {

                if(err) reject(err);

                let results = [];
                for(let u in users.docs) {
                    results.push(users.docs[u]);
                }

                resolve(results);

            });

        }

    });




    
}

userSchema.statics.removeSong = function(userId, songId, callback){
    let self = this;

    self.model('User').findOneAndUpdate(
        {"_id": userId },
        {"$pull": { "songs": songId }},
        function(err) {
            return callback(err);
        }
    );
}

let User = mongoose.model('User', userSchema);
module.exports = User;