var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stock = require('./stock');

var ProductSchema = new Schema({
	matricola: {type: String,required: true},
	tipo: {type: String, required: true},
	materiale: {type: String},
	qualita: {type: String},
	scelta: {type: String},
	finitura: {type: String},
	coloreRal: {type: String},
	peso: {type: Number},
	spessore: {type: Number},
	larghezza: {type: Number},
	classeLarghezza: {type: Number},
	lunghezza: {type: Number},
	numFogli: {type: Number},
	prezzo: {type: Number},
	difetti: {type: String},
	stabilimento: {type: Number},
	stockId: {type: Schema.ObjectId, ref: 'Stock'},
	lavorazione: [{ type: Schema.ObjectId, ref: 'Process'}],
	scarto: {type: Number, default: 0}
});

module.exports = mongoose.model('Product', ProductSchema);