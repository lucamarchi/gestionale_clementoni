/**
 * Created by luca on 23/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var StockSchema = new Schema({
    numeroCollo: {type: String, require: true},
    matricola: {type: String},
    tipo: {type: String},
    materiale: {type: String},
    qualita: {type: String},
    scelta: {type: String},
    finitura: {type: String},
    colore: {type: String},
    ral: {type: String},
    spessoreNominale: {type: Number},
    spessoreEffettivo: {type: Number},
    larghezzaNominale: {type: Number},
    larghezzaEffettiva: {type: Number},
    lunghezza: {type: Number},
    pesoIniziale: {type: Number},
    pesoNetto: {type: Number},
    pesoLordo: {type: Number},
    superficie: {type: String},
    prezzo: {type: Number},
    difetti: {type: String},
    stabilimento: {type: String},
    ubicazione: {type: String},
    cliente: {type: String},
    numPezzi: {type: Number},
    stato: {type: String},
    scarto: {type: Number, default: 0}
});

var stockModel = mongoose.model('Stock', StockSchema);
module.exports = stockModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        stockModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
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
        newStock.colore = stock.colore;
        newStock.ral = stock.ral;
        newStock.spessoreNominale = stock.spessoreNominale;
        newStock.spessoreEffettivo = stock.spessoreEffettivo;
        newStock.larghezzaNominale = stock.larghezzaNominale;
        newStock.larghezzaEffettiva = stock.larghezzaEffettiva;
        newStock.lunghezza = stock.lunghezza;
        newStock.pesoIniziale = stock.pesoIniziale;
        newStock.pesoNetto = stock.pesoNetto;
        newStock.pesoLordo = stock.pesoLordo;
        newStock.superficie = stock.superficie;
        newStock.prezzo = stock.prezzo;
        newStock.difetti = stock.difetti;
        newStock.stabilimento = stock.stabilimento;
        newStock.ubicazione = stock.ubicazione;
        newStock.cliente = stock.cliente;
        newStock.numPezzi = stock.numPezzi;
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
                    result.colore = stock.colore;
                    result.ral = stock.ral;
                    result.spessoreNominale = stock.spessoreNominale;
                    result.spessoreEffettivo = stock.spessoreEffettivo;
                    result.larghezzaNominale = stock.larghezzaNominale;
                    result.larghezzaEffettiva = stock.larghezzaEffettiva;
                    result.lunghezza = stock.lunghezza;
                    result.pesoIniziale = stock.pesoIniziale;
                    result.pesoNetto = stock.pesoNetto;
                    result.pesoLordo = stock.pesoLordo;
                    result.superficie = stock.superficie;
                    result.prezzo = stock.prezzo;
                    result.difetti = stock.difetti;
                    result.stabilimento = stock.stabilimento;
                    result.ubicazione = stock.ubicazione;
                    result.cliente = stock.cliente;
                    result.numPezzi = stock.numPezzi;
                    result.save(function(err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(result);
                        }
                    });
                }
            }
        });
        return deferred.promise;
    },

    addClienteCodToStock: function(stockId, clienteCod) {
        var query = {$set: {'clienteCod': clienteCod}};
        var stock = this.updateStock(stockId,query);
        return stock;
    },

    increaseScarto: function(stockId,scarto) {
        var query = {$inc: {'scarto': scarto}};
        var stock = this.updateStock(stockId,query);
        return stock;
    },

    createReso: function(stock,reso) {
        var deferred = Q.defer();
        var newStock = new stockModel();
        newStock.numeroCollo = stock.numeroCollo+"L";
        newStock.matricola = stock.matricola;
        newStock.tipo = stock.tipo;
        newStock.materiale = stock.materiale;
        newStock.qualita = stock.qualita;
        newStock.scelta = stock.scelta;
        newStock.finitura = stock.finitura;
        newStock.colore = stock.colore;
        newStock.ral = stock.ral;
        newStock.spessoreNominale = stock.spessoreNominale;
        newStock.spessoreEffettivo = stock.spessoreEffettivo;
        newStock.larghezzaNominale = stock.larghezzaNominale;
        newStock.larghezzaEffettiva = stock.larghezzaEffettiva;
        newStock.lunghezza = stock.lunghezza;
        newStock.pesoIniziale = reso;
        newStock.pesoNetto = stock.pesoNetto;
        newStock.pesoLordo = stock.pesoLordo;
        newStock.superficie = stock.superficie;
        newStock.prezzo = stock.prezzo;
        newStock.difetti = stock.difetti;
        newStock.stabilimento = stock.stabilimento;
        newStock.ubicazione = stock.ubicazione;
        newStock.cliente = stock.cliente;
        newStock.numPezzi = stock.numPezzi;
        newStock.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newStock);
            }
        });
        return deferred.promise;
    }
    

};