var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CutSchema = new Schema({
	anno: {type: Number},
	codice: {type: Number},
	clienteCod: {type: Number},
	note: {type: String},
	date: {type: String},
	accepted: {type: Boolean, default: false},
	operator: {type: String},
	articoli: [{
		codArticolo: {type: Number},
		tipo: {type: String},
		note: {type: String},
		materiale: {type: String},
		sottoTipo: {type: String},
		quantita: {type: Number},
		prezzo: {type: String},
		spessore: {type: Number},
		lunghezza: {type: Number},
		larghezza: {type: Number},
		peso: {type: Number},
		dataConsegna: {type: String},
	}]
});

module.exports = mongoose.model('Cut', CutSchema);