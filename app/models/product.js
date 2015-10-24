var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	ordineId: {type: Number, require: true},
	matricola: {type: Number,required: true},
	materiale: {type: String, required: true},
	cop: {type: String, enum: ['coil', 'pacco']},
	quantita: {type: Number, default: 0},
	dimenisioni: {type: String},
	pesokg: {type: Number},
	pesoton: {type: Number},
	qualita: {type: String},
	colore: {type: String},
	ral: {type: String},
	note: {type: String},
	finitura: {type: String}
});

module.exports = mongoose.model('Product', ProductSchema);