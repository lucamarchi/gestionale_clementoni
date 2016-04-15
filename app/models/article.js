var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
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
	dataConsegna: {type: Date},
	lavorazione: [{ type: Schema.ObjectId, ref: 'Process'}],
	scarto: {type: Number, default: 0},
	stato: {type: String},
	stockId: {type: Schema.ObjectId, ref: 'Stock'},
	ordineCod: {type: Number},
	clienteCod: {type: Number}
});

module.exports = mongoose.model('Article', ArticleSchema);