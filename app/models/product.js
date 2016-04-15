var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stock = require('./stock');

var ProductSchema = new Schema({
	numeroCollo: {type: String, require: true},
	matricola: {type: String},
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
	fatherId: {type: Schema.ObjectId, ref: 'Product'},
	scarto: {type: Number, default: 0},
	anno: {type: String},
	lavorazione: {type: Number, default: 0}
});


module.exports = mongoose.model('Product', ProductSchema);