/*Source:
 https://raw.githubusercontent.com/mekentosj/oauth2-example/master/models/user.js

 */

var bcrypt = require('bcrypt');
//var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var timestamps = require('mongoose-timestamp');
var Utils=require('./../utils');
//var ValidationError = require('./../errors').ValidationError;


config = require('./../config'); // get our config file
// =======================
// configuration =========
// =======================
var secret = config.secret;

var OAuthUsersSchema = new Schema({
    email: {type: String, unique: true, required: true},
    hashed_password: {type: String, required: true},
    //password_reset_token: { type: String, unique: true },
    //reset_token_expires: Date,
    firstname: String,
    lastname: String
});

function hashPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

OAuthUsersSchema.static('register', function (fields, cb) {
    var user;

    fields.hashed_password = hashPassword(fields.password);
    delete fields.password;
    user = new OAuthUsersModel(fields);
    user.save(function (err, user) {
        if (err || !user) return cb(err, null);
        return cb(null, Utils.pick(user, ['firstname', 'lastname', 'email', 'createdAt','updatedAt']));

    });
});

OAuthUsersSchema.static('getUser', function (email, password, cb) {
    OAuthUsersModel.authenticate(email, password, function (err, user) {
        if (err || !user) return cb(err);
        cb(null, user.email);
    });
});

OAuthUsersSchema.static('authenticate', function (email, password, cb) {
    this.findOne({email: email}, function (err, user) {
        if (err || !user) return cb(err);
        var userProjection = Utils.pick(user, ['firstname', 'lastname', 'email', 'createdAt','updatedAt']);
        var token = jwt.sign(userProjection, secret, {
            expiresIn: 1440 * 60// expires in 24 hours
        });
        cb(null, bcrypt.compareSync(password, user.hashed_password) ? {
            user: userProjection,
            token: token
        } : null);
    });
});


OAuthUsersSchema.plugin(timestamps);
mongoose.model('users', OAuthUsersSchema);

var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;
