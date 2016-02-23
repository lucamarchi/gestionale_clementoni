var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var Stock = require('./stock');

var ProcessSchema = new Schema({
	macchina: {type: String},
	operatore: {type: String},
	scarto: {type: Number},
	data: {type: Date, default: Date.now},
	figli: [{
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
		stabilimento: {type: Number}
	}]
});

module.exports = mongoose.model('Process', ProcessSchema);