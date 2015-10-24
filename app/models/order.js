var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var OrderSchema = new Schema({
	numOrdine: {type: Number, require: true},
	ddt: {type: Number},
	fornitore: {type: String},
	date: {type: Date, default: Date.now },
	cTrasporto: {type: Number},
	cOrdine: {type: Number},
	cTotale: {type: Number},
	products: [{ type: String}]
});

module.exports = mongoose.model('Order', OrderSchema);