var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var CutSchema = new Schema({
	anno: {type: Number},
	codice: {type: Number},
	clienteCod: {type: Number},
	note: {type: String},
	date: {type: String},
	accepted: {type: Boolean, default: false},
	operator: {type: String},
	articoli: [{ type: Schema.ObjectId, ref: 'Article'}],
});

module.exports = mongoose.model('Cut', CutSchema);