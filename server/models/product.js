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
            } if(!result) {
                var err = new Error("Product not found");
                err.status = 400;
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
            } if(!result) {
                var err = new Error("No products found");
                err.status = 400;
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
        var query = {'anno': year};
        productModel.findOne(query).sort({numeroCollo: -1}).limit(1).exec(function(err,result) {
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
                       matr = parseInt(matr)+1
                       console.log("NUMCollo prodotto figlio: "+matr)
                   } else {
                       var matr = parseInt(tmpMatr)+1;
                       console.log("NUMCollo prodotto non figlio: "+matr)
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
        newProduct.tipo = product.tipo;
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
        // FARLO CON IL SELETTORE E QUERY
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
                if (!result) {
                    var err = new Error("No product found");
                    err.status = 400;
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
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
                    result.tipo = product.tipo;
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