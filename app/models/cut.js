var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CutSchema = new Schema({
	anno: {type: String},
	codice: {type: String},
	clienteCod: {type: Number},
	note: {type: String},
	articoli: [{
		codArticolo: {type: Number},
		desArticolo: {type: String},
		note: {type: String},
		quantita: {type: Number},
		prezzo: {type: String},
		altezza: {type: Number},
		larghezza: {type: Number},
		profondita: {type: Number},
		dataConsegna: {type: String}
	}]
});

module.exports = mongoose.model('Cut', CutSchema);