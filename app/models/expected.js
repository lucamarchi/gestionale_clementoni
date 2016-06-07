/**
 * Created by luca on 06/06/16.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stock = require('./stock');

var ExpectedSchema = new Schema({
    matricola: {type: String},
    tipo: {type: String},
    materiale: {type: String},
    qualita: {type: String},
    scelta: {type: String},
    finitura: {type: String},
    coloreRal: {type: String},
    pesoLordo: {type: Number},
    pesoNetto: {type: Number},
    spessore: {type: Number},
    larghezza: {type: Number},
    classeLarghezza: {type: Number},
    lunghezza: {type: Number},
    numFogli: {type: Number},
    prezzo: {type: Number},
    difetti: {type: String},
    stabilimento: {type: Number},
    stato: {type: String},
    scarto: {type: Number, default: 0},
    anno: {type: String},
    superficie: {type: String},
    ddt: {type: Number, require: true},
    fornitore: {type: String},
    dataDdt: {type: Date}
});


module.exports = mongoose.model('Expected', ExpectedSchema);