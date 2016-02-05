var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ProdSchema = new Schema({
	codice: {type: String},
	stato: {type: String},
	data: {type: Date, default: Date.now()},
	articoliId: [{type: Schema.ObjectId}]
});

module.exports = mongoose.model('Prod', ProdSchema);