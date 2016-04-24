var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

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

UserSchema.methods.comparePassword1 = function(password) {
    return password==this.password;
};

module.exports = mongoose.model('User', UserSchema);