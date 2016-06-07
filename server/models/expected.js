/**
 * Created by luca on 07/06/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;

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


expectedModel = mongoose.model('Expected', ExpectedSchema);
module.exports = expectedModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        expectedModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Expected not found");
                err.status = 400;
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
            } if(!result) {
                var err = new Error("No expected found");
                err.status = 400;
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
        newExpected.matricola = expected.matricola;
        newExpected.tipo = expected.tipo;
        newExpected.materiale = expected.materiale;
        newExpected.qualita = expected.qualita;
        newExpected.scelta = expected.scelta;
        newExpected.finitura = expected.finitura;
        newExpected.coloreRal = expected.coloreRal;
        newExpected.pesoLordo = expected.pesoLordo;
        newExpected.pesoNetto = expected.pesoNetto;
        newExpected.spessore = expected.spessore;
        newExpected.larghezza = expected.larghezza;
        newExpected.classeLarghezza = expected.classeLarghezza;
        newExpected.lunghezza = expected.lunghezza;
        newExpected.numFogli = expected.numFogli;
        newExpected.prezzo = expected.prezzo;
        newExpected.difetti = expected.difetti;
        newExpected.stabilimento = expected.stabilimento;
        newExpected.stato = expected.stato;
        newExpected.anno = expected.anno;
        newExpected.superficie = expected.superficie;
        newExpected.ddt = expected.ddt;
        newExpected.fornitore = expected.fornitore;
        newExpected.dataDdt = expected.dataDdt;
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
                    result.matricola = expected.matricola;
                    result.tipo = expected.tipo;
                    result.materiale = expected.materiale;
                    result.qualita = expected.qualita;
                    result.scelta = expected.scelta;
                    result.finitura = expected.finitura;
                    result.coloreRal = expected.coloreRal;
                    result.pesoLordo = expected.pesoLordo;
                    result.pesoNetto = expected.pesoNetto;
                    result.spessore = expected.spessore;
                    result.larghezza = expected.larghezza;
                    result.classeLarghezza = expected.classeLarghezza;
                    result.lunghezza = expected.lunghezza;
                    result.numFogli = expected.numFogli;
                    result.prezzo = expected.prezzo;
                    result.difetti = expected.difetti;
                    result.stabilimento = expected.stabilimento;
                    result.stato = expected.stato;
                    result.anno = expected.anno;
                    result.superficie = expected.superficie;
                    result.ddt = expected.ddt;
                    result.fornitore = expected.fornitore;
                    result.dataDdt = expected.dataDdt;
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