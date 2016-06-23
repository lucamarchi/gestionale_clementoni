/**
 * Created by luca on 23/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var StockSchema = new Schema({
    numeroCollo: {type: String},
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
    scarto: {type: Number},
    superficie: {type: String}
});

var stockModel = mongoose.model('Stock', StockSchema);
module.exports = stockModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        stockModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Stock not found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var stock = this.findOne({'_id': id});
        return stock;
    },

    findAll: function() {
        var deferred = Q.defer();
        stockModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("No stocks found");
                err.status = 400;
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    saveNewStock: function(stock) {
        var deferred = Q.defer();
        var newStock = new stockModel();
        newStock.matricola = stock.matricola;
        newStock.tipo = stock.tipo;
        newStock.materiale = stock.materiale;
        newStock.qualita = stock.qualita;
        newStock.scelta = stock.scelta;
        newStock.finitura = stock.finitura;
        newStock.coloreRal = stock.coloreRal;
        newStock.pesoLordo = stock.pesoLordo;
        newStock.pesoNetto = stock.pesoNetto;
        newStock.spessore = stock.spessore;
        newStock.larghezza = stock.larghezza;
        newStock.classeLarghezza = stock.classeLarghezza;
        newStock.lunghezza = stock.lunghezza;
        newStock.numFogli = stock.numFogli;
        newStock.prezzo = stock.prezzo;
        newStock.difetti = stock.difetti;
        newStock.stabilimento = stock.stabilimento;
        newStock.superficie = stock.superficie;
        newStock.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newStock);
            }
        });
        return deferred.promise;
    },

    updateStock: function(stockId, query) {
        var deferred = Q.defer();
        stockModel.findByIdAndUpdate(stockId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    updateNumeroCollo: function(stockId,number) {
        var query = {'numeroCollo': number};
        var stock = this.updateStock(stockId,query);
        return stock;
    },

    deleteStock: function(stockId) {
        var deferred = Q.defer();
        var query = {'_id': stockId};
        stockModel.remove(query).exec(function(err,result) {
           if (err) {
               deferred.reject(err)
           } else {
               deferred.resolve(result);
           }
        });
        return deferred.promise;
    },

    modifyStock: function(stockId, stock) {
        var deferred = Q.defer();
        var query = {'_id': stockId};
        stockModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.matricola = stock.matricola;
                    result.tipo = stock.tipo;
                    result.materiale = stock.materiale;
                    result.qualita = stock.qualita;
                    result.scelta = stock.scelta;
                    result.finitura = stock.finitura;
                    result.coloreRal = stock.coloreRal;
                    result.pesoLordo = stock.pesoLordo;
                    result.pesoNetto = stock.pesoNetto;
                    result.spessore = stock.spessore;
                    result.larghezza = stock.larghezza;
                    result.classeLarghezza = stock.classeLarghezza;
                    result.lunghezza = stock.lunghezza;
                    result.numFogli = stock.numFogli;
                    result.prezzo = stock.prezzo;
                    result.difetti = stock.difetti;
                    result.stabilimento = stock.stabilimento;
                    result.superficie = stock.superficie;
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
    }

};