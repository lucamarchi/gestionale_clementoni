var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var Stock = require('./stock');

var ProcessSchema = new Schema({
	macchina: {type: String},
	operatore: {type: String},
	scarto: {type: Number},
	data: {type: Date, default: Date.now},
	figli: [{type: Schema.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Process', ProcessSchema);