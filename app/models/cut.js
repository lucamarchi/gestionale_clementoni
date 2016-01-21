var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CutSchema = new Schema({
	anno: {type: Number},
	codice: {type: Number},
	clienteCod: {type: Number},
	note: {type: String},
	accepted: {type: Boolean, default: false},
	operator: {type: String},
	articoli: [{
		codArticolo: {type: Number},
		desArticolo: {type: String},
		note: {type: String},
		quantita: {type: Number},
		prezzo: {type: String},
		altezza: {type: Number},
		larghezza: {type: Number},
		profondita: {type: Number},
		dataConsegna: {type: String},
	}]
});

module.exports = mongoose.model('Cut', CutSchema);