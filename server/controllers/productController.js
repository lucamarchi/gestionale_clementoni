/**
 * Created by luca on 04/04/17.
 */

var Q = require('q');
var Order = require('./../models/order');
var Product = require('./../models/product');
var Article = require('./../models/article');

module.exports = {

    createProducts: function(products) {
        var deferred = Q.defer();
        Q.all(products.map(function (currProduct) {
            return Product.saveNewProduct(currProduct);
        })).then(function(products) {
            Product.findNewNumeroCollo().then(function (number) {
                var promises = [];
                products.forEach(function(product) {
                    var newMethodProduct = Product.updateNumeroCollo(product.id, number);
                    number++;
                    promises.push(newMethodProduct);
                });
                Q.all(promises).then(function(result) {
                    deferred.resolve(result);
                });
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    retrieveProducts: function(productsId) {
        var deferred = Q.defer();
        var promises = [];
        productsId.forEach(function(currProduct) {
            var newMethod = Product.findById(currProduct);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteProducts: function(productsId) {
        var deferred = Q.defer();
        var promises = [];
        productsId.forEach(function(currProduct) {
            var newMethod = Product.deleteProduct(currProduct);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteProductFromOrder: function(productId) {
        var deferred = Q.defer();
        var promises = [
            Product.deleteProduct(productId),
            Order.removeProductToOrder(productId)
        ];
        Q.all(promises).then(function() {
            deferred.resolve();
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteProductsFromOrder: function(products) {
        var deferred = Q.defer();
        var promises = [];
        products.forEach(function (currProduct) {
            promises.push(Product.deleteProduct(currProduct._id));
            promises.push(Order.removeProductToOrder(currProduct._id));
        });
        Q.all(promises).then(function() {
            deferred.resolve();
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    createProductReso: function(productId,product,reso,article) {
        var deferred = Q.defer();
        var promises = [
            Product.setReso(productId,reso),
            Article.setReso(article._id,reso)
        ];
        Product.createReso(product,reso).then(function(createdProd) {
            Product.addFatherId(createdProd,productId).then(function(result) {
               Q.all(promises).then(function() {
                   deferred.resolve(result);
               });
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    modifyProducts: function(products) {
        var deferred = Q.defer();
        var promises = [];
        products.forEach(function(currProduct) {
            promises.push(Product.modifyProduct(currProduct._id,currProduct));
        });
        Q.all(promises).then(function(result) {
            deferred.resolve(result);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteStock: function(productId) {
        var deferred = Q.defer();
        Product.deleteStockNetto(productId).then(function(product) {
            Product.deleteStockLordo(productId).then(function(result) {
                deferred.resolve(result);
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};