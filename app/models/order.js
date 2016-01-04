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
	productIds: [{ type: Schema.ObjectId, ref: 'Product'}],
	stockIds: [{ type: Schema.ObjectId, ref: 'Stock'}]
});

module.exports = mongoose.model('Order', OrderSchema);