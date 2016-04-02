var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stock = require('./stock');

var ProductSchema = new Schema({
	numeroCollo: {type: String, require: true},
	matricola: {type: String},
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
	stockId: {type: Schema.ObjectId, ref: 'Stock'},
	lavorazione: [{ type: Schema.ObjectId, ref: 'Process',unique: true}],
	fatherId: {type: Schema.ObjectId, ref: 'Product'},
	scarto: {type: Number, default: 0},
	anno: {type: String}
});

/*ProductSchema.pre('save', function(next,done) {
    var self = this;
    var year = new Date().getFullYear();
    mongoose.models['Product'].findOne({anno: year}).sort({matricola: -1}).limit(1).exec(function(err,prod) {
    	if (err)
    		console.log(err);
    	else  if (!prod) {
    		yearString = year.toString().slice(-2);
    		var matricola = yearString + "0001";
    		self.matricola = matricola;
    	} else if (prod) {
    		var matricola = prod.matricola +1;
    		self.matricola = matricola;
    	}
    });
    next();
});*/

module.exports = mongoose.model('Product', ProductSchema);