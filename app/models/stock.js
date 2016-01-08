var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StockSchema = new Schema({
	matricola: {type: String,required: true},
	materiale: {type: String, required: true},
	cop: {type: String, enum: ['coil', 'pacco','nastro']},
	lunghezza: {type: Number},
	larghezza: {type: Number},
	spessore: {type: Number},
	pesokg: {type: Number},
	pesoton: {type: Number},
	qualita: {type: String},
	colore: {type: String},
	ral: {type: String},
	note: {type: String},
	finitura: {type: String},
	prezzo: {type: Number},
	orderId: {type: Schema.ObjectId, ref: 'Order'},
});

module.exports = mongoose.model('Stock', StockSchema);