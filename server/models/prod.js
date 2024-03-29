/**
 * Created by luca on 03/06/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Article = require('./../models/article');
var Schema = mongoose.Schema;

var ProdSchema = new Schema({
    numero: {type: Number},
    codice: {type: String},
    dataCreazione: {type: Date,default: Date.now()},
    articoliId: [{type: Schema.ObjectId, ref: 'Article'}],
    pesoIniziale: {type: Number, default: 0},
    pesoLavorato: {type: Number, default: 0},
    pesoSaldo: {type: Number, default: 0}
});

prodModel = mongoose.model('Prod', ProdSchema);
module.exports = prodModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        prodModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    findById: function(id) {
        var prod = this.findOne({'_id': id});
        return prod;
    },

    findAll: function() {
        var deferred = Q.defer();
        prodModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    },

    saveNewProd: function(prod,number) {
        var deferred = Q.defer();
        var newProd = new prodModel();
        newProd.codice = prod.codice;
        newProd.numero = number;
        newProd.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newProd);
            }
        });
        return deferred.promise;
    },


    updateProd: function(prodId, query) {
        var deferred = Q.defer();
        prodModel.findByIdAndUpdate(prodId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    addArticleToProd: function(prodId,articleId) {
        var query = {$push: {'articoliId': articleId}};
        var prod = this.updateProd(prodId, query);
        return prod;
    },

    deleteProd: function(prodId) {
        var deferred = Q.defer();
        var query = {'_id': prodId};
        prodModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    removeArticleToProd: function(prodId,articleId) {
        var query = {$pull: {'articoliId': articleId}};
        var prod = this.updateProd(prodId,query);
        return prod;
    },

    findNewNumeroProd: function() {
        var deferred = Q.defer();
        prodModel.findOne().sort({numero: -1}).limit(1).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (!result) {
                    var number = 1;
                    deferred.resolve(number);
                } else {
                    var number = result.numero+1;
                    deferred.resolve(number);
                }
            }
        });
        return deferred.promise;
    },

    setPesoInizialeProd: function(prodId,peso) {
        var query = {$inc: {'pesoIniziale': peso}};;
        var prod = this.updateProd(prodId, query);
        return prod;
    },

    setPesoSaldoProd: function(prodId,peso) {
        var query = {$inc: {'pesoSaldo': peso}};
        var prod = this.updateProd(prodId, query);
        return prod;
    },

    modifyProd: function(prodId, prod) {
        var deferred = Q.defer();
        var query = {'_id': prodId};
        prodModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.codice = prod.codice;
                    result.pesoIniziale = prod.pesoIniziale;
                    result.pesoSaldo = prod.pesoSaldo;
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

};