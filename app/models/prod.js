var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ProdSchema = new Schema({
	codice: {type: String},
	dataCreazione: {type: Date,default: Date.now()},
	dataEvasione: {type: Date},
	articoliId: [{type: Schema.ObjectId, ref: 'Article', unique: true}]
});

module.exports = mongoose.model('Prod', ProdSchema);