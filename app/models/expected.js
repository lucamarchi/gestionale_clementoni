/**
 * Created by luca on 06/06/16.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stock = require('./stock');

var ExpectedSchema = new Schema({
    tipo: {type: String},
    materiale: {type: String},
    qualita: {type: String},
    scelta: {type: String},
    finitura: {type: String},
    coloreRal: {type: String},
    pesoNetto: {type: Number},
    spessore: {type: Number},
    larghezza: {type: Number},
    lunghezza: {type: Number},
    numFogli: {type: Number},
    prezzo: {type: Number},
    superficie: {type: String},
    fornitore: {type: String},
    dataPrevista: {type: Date}
});


module.exports = mongoose.model('Expected', ExpectedSchema);