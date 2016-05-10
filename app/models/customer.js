var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var CustomerSchema = new Schema({
	ident: {type: Number},
	agente: {type: Number},
	bancaAbi: {type: Number},
	bancaCab: {type: Number},
	codFiscale: {type: String},
	fax: {type: String},
	indirizzo: {type: String},
	localita : {type: String},
	nome: {type: String},
	pagamento: {type: String},
	partitaIva: {type: String},
	provincia: {type: String},
	regione: {type: String},
	telefono: {type: String},
	email: {type: String}
});

module.exports = mongoose.model('Customer', CustomerSchema);