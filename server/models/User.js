/**
 * Created by luca on 20/05/16.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true},
    role: { type: String, required: true}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var userModel = mongoose.model('User', UserSchema);
module.exports = userModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        userModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("User not found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },


    findById: function(id) {
        var user = this.findOne({'_id': id});
        return user;
    },

    findByUsername: function(username) {
        var user = this.findOne({'username': username});
        return user;
    },

    checkPassword: function(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

};