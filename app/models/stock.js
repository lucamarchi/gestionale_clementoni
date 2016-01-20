var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StockSchema = new Schema({
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
	fatherId: {type: Schema.ObjectId, ref: 'Product'},
	scarto: {type: Number}
});

module.exports = mongoose.model('Stock', StockSchema);