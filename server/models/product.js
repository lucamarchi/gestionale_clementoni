/**
 * Created by luca on 23/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Stock = require('./stock');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    numeroCollo: {type: String, require: true},
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
    stockId: {type: Schema.ObjectId, ref: 'Stock'},
    fatherId: {type: Schema.ObjectId, ref: 'Product'},
    scarto: {type: Number, default: 0},
    anno: {type: String},
    lavorazione: {type: Number, default: 1},
    superficie: {type: String}
});


var productModel = mongoose.model('Product', ProductSchema);
module.exports = productModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        productModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var product = this.findOne({'_id': id});
        return product;
    },

    findAll: function() {
        var deferred = Q.defer();
        productModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findNewNumeroCollo: function() {
        var deferred = Q.defer();
        var year = new Date().getFullYear();
        var query = {'numeroCollo': {$exists: true}};
        productModel.findOne(query).sort({"numeroCollo": -1}).limit(1).exec(function(err,result) {
           if (err) {
               deferred.reject(err);
           } else {
               if (!result) {
                   var prefix = year.toString().slice(-2);
                   var matr = prefix + "0001";
                   matr = parseInt(matr);
                   deferred.resolve(matr);
               } else {
                   var workedProduct = false;
                   var tmpMatr = result.numeroCollo;
                   var j = 0;
                   for (var i in tmpMatr) {
                       if (tmpMatr[i] == "/") {
                           workedProduct = true;
                           j = i;
                       }
                   }
                   if (workedProduct) {
                       var matr = tmpMatr.substr(0,j);
                       matr = parseInt(matr)+1;
                   } else {
                       var matr = parseInt(tmpMatr)+1;
                   }
                   deferred.resolve(matr);
               }
           }
        });
        return deferred.promise;
    },

    saveNewProduct: function(product) {
        var deferred = Q.defer();
        var newProduct = new productModel();
        var year = new Date().getFullYear();
        newProduct.matricola = product.matricola;
        newProduct.anno = year;
        newProduct.tipo = product.tipo;
        newProduct.materiale = product.materiale;
        newProduct.qualita = product.qualita;
        newProduct.scelta = product.scelta;
        newProduct.finitura = product.finitura;
        newProduct.coloreRal = product.coloreRal;
        newProduct.pesoLordo = product.pesoLordo;
        newProduct.pesoNetto = product.pesoNetto;
        newProduct.spessore = product.spessore;
        newProduct.larghezza = product.larghezza;
        newProduct.classeLarghezza = product.classeLarghezza;
        newProduct.lunghezza = product.lunghezza;
        newProduct.numFogli = product.numFogli;
        newProduct.prezzo = product.prezzo;
        newProduct.difetti = product.difetti;
        newProduct.stabilimento = product.stabilimento;
        newProduct.superficie = product.superficie;
        if (!product.stato) {
            newProduct.stato = "sospeso";
        } else newProduct.stato = product.stato
        newProduct.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newProduct);
            }
        });
        return deferred.promise;
    },

    updateProduct: function(productId, query) {
        var deferred = Q.defer();
        productModel.findByIdAndUpdate(productId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    addStockToProduct: function(productId,stockId) {
        var query = {'stockId': stockId};
        var product = this.updateProduct(productId, query);
        return product;
    },

    removeStockToProduct: function(stockId) {
        var deferred = Q.defer();
        var query = {$unset: {"stockId": ""}};
        productModel.update({'stockId': stockId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },


    updateNumeroCollo: function(productId,number) {
        var query = {'numeroCollo': number};
        var product = this.updateProduct(productId,query);
        return product;
    },

    deleteProduct: function(productId) {
        var deferred = Q.defer();
        var query = {'_id': productId};
        productModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    modifyProduct: function(productId, product) {
        var deferred = Q.defer();
        var query = {'_id': productId};
        productModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.matricola = product.matricola;
                    result.tipo = product.tipo;
                    result.materiale = product.materiale;
                    result.qualita = product.qualita;
                    result.scelta = product.scelta;
                    result.finitura = product.finitura;
                    result.coloreRal = product.coloreRal;
                    result.pesoLordo = product.pesoLordo;
                    result.pesoNetto = product.pesoNetto;
                    result.spessore = product.spessore;
                    result.larghezza = product.larghezza;
                    result.classeLarghezza = product.classeLarghezza;
                    result.lunghezza = product.lunghezza;
                    result.numFogli = product.numFogli;
                    result.prezzo = product.prezzo;
                    result.difetti = product.difetti;
                    result.stabilimento = product.stabilimento;
                    result.superficie = product.superficie;
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

    findByStock: function(stockId) {
        var query = {'stockId': stockId};
        var product = this.findOne(query);
        return product;
    },

    increaseScarto: function(productId,scarto) {
        var query = {$inc: {'scarto': scarto}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    increaseLavorazione: function(productId) {
        var query = {$inc: {'lavorazione': 1}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    setFatherId: function(productId,fatherId) {
        var query = {'fatherId': fatherId};
        var product = this.updateProduct(productId,query);
        return product;
    }


};