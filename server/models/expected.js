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
    scelta: {type: String},
    finitura: {type: String},
    coloreRal: {type: String},
    pesoNetto: {type: Number},
    spessore: {type: Number},
    classeLarghezza: {type: Number},
    lunghezza: {type: Number},  
    numFogli: {type: Number},
    prezzo: {type: Number},
    stato: {type: String},
    anno: {type: String},
    superficie: {type: String},
    fornitore: {type: String},
    dataPrevista: {type: Date}
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
        newExpected.scelta = expected.scelta;
        newExpected.finitura = expected.finitura;
        newExpected.coloreRal = expected.coloreRal;
        newExpected.pesoNetto = expected.pesoNetto;
        newExpected.spessore = expected.spessore;
        newExpected.classeLarghezza = expected.classeLarghezza;
        newExpected.lunghezza = expected.lunghezza;
        newExpected.numFogli = expected.numFogli;
        newExpected.prezzo = expected.prezzo;
        newExpected.anno = expected.anno;
        newExpected.superficie = expected.superficie;
        newExpected.fornitore = expected.fornitore;
        newExpected.dataPrevista = expected.dataPrevista;
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
                    result.scelta = expected.scelta;
                    result.finitura = expected.finitura;
                    result.coloreRal = expected.coloreRal;
                    result.pesoNetto = expected.pesoNetto;
                    result.spessore = expected.spessore;
                    result.classeLarghezza = expected.classeLarghezza;
                    result.lunghezza = expected.lunghezza;
                    result.numFogli = expected.numFogli;
                    result.prezzo = expected.prezzo;
                    result.anno = expected.anno;
                    result.superficie = expected.superficie;
                    result.fornitore = expected.fornitore;
                    result.dataPrevista = expected.dataPrevista;
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