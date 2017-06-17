/**
 * Created by luca on 07/06/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;

var ExpectedSchema = new Schema({
    tipo: {type: String},
    materiale: {type: String},
    qualita: {type: String},
    finitura: {type: String},
    colore: {type: String},
    spessore: {type: Number},
    lunghezza: {type: Number},
    larghezza: {type: Number},
    superficie: {type: String},
    quantita: {type: Number},
    fornitore: {type: String},
    dataPrevista: {type: Date},
    prezzo: {type: Number},
    pesoOrdinato: {type: Number},
    pesoConsegnato: {type: Number},
    pesoSaldo: {type: Number}
});


expectedModel = mongoose.model('Expected', ExpectedSchema);
module.exports = expectedModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        expectedModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    findById: function(id) {
        var expected = this.findOne({'_id': id});
        return expected;
    },

    findAll: function() {
        var deferred = Q.defer();
        expectedModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    saveNewExpected: function(expected) {
        var deferred = Q.defer();
        var newExpected = new expectedModel();
        newExpected.tipo = expected.tipo;
        newExpected.materiale = expected.materiale;
        newExpected.qualita = expected.qualita;
        newExpected.finitura = expected.finitura;
        newExpected.colore = expected.colore;
        newExpected.spessore = expected.spessore;
        newExpected.lunghezza = expected.lunghezza;
        newExpected.larghezza = expected.larghezza;
        newExpected.superficie = expected.superficie;
        newExpected.quantita = expected.quantita;
        newExpected.fornitore = expected.fornitore;
        newExpected.dataPrevista = expected.dataPrevista;
        newExpected.prezzo = expected.prezzo;
        newExpected.pesoOrdinato = expected.pesoOrdinato;
        newExpected.pesoConsegnato = expected.pesoConsegnato;
        newExpected.pesoSaldo = expected.pesoSaldo;
        newExpected.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newExpected);
            }
        });
        return deferred.promise;
    },

    modifyExpected: function(expectedId, expected) {
        var deferred = Q.defer();
        var query = {'_id': expectedId};
        expectedModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.tipo = expected.tipo;
                    result.materiale = expected.materiale;
                    result.qualita = expected.qualita;
                    result.finitura = expected.finitura;
                    result.colore = expected.colore;
                    result.spessore = expected.spessore;
                    result.lunghezza = expected.lunghezza;
                    result.larghezza = expected.larghezza;
                    result.superficie = expected.superficie;
                    result.quantita = expected.quantita;
                    result.fornitore = expected.fornitore;
                    result.dataPrevista = expected.dataPrevista;
                    result.prezzo = expected.prezzo;
                    result.pesoOrdinato = expected.pesoOrdinato;
                    result.pesoConsegnato = expected.pesoConsegnato;
                    result.pesoSaldo = expected.pesoSaldo;
                }
                result.save(function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(result);
                    }
                });
            }
        });
        return deferred.promise;
    },

    deleteExpected: function(expectedId) {
        var deferred = Q.defer();
        var query = {'_id': expectedId};
        expectedModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

};