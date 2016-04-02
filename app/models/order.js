var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var OrderSchema = new Schema({
	ddt: {type: Number, require: true},
	fornitore: {type: String},
	dataDdt: {type: Date},
	dataArrivo: {type: Date, default: Date.now },
	productsId: [{ type: Schema.ObjectId, ref: 'Product'}],
});

module.exports = mongoose.model('Order', OrderSchema);