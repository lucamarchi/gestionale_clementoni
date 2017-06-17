/**
 * Created by luca on 04/04/17.
 */

var Q = require('q');

var productController = require('./productController');

var Order = require('./../models/order');

module.exports = {

    createProductsToOrder: function(orderId,products) {
        var deferred = Q.defer();
        productController.createProducts(products).then(function(result) {
            Q.all(result.map(function(currProduct) {
                return Order.addProductToOrder(orderId,currProduct.id);
            })).then(function() {
                deferred.resolve(result);
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};