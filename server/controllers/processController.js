/**
 * Created by luca on 11/06/17.
 */

var Q = require('q');
var _ = require('lodash');
var Process = require('./../models/process');
var Product = require('./../models/product');
var Article = require('./../models/article');
var productController = require('./../controllers/productController');



module.exports = {

    findFigliAndArticleProcess: function(processes) {
        var defer = Q.defer();
        var tmpProcesses = [];
        var count = 0;
        _.each(processes, function(currProcess) {
            var tmpElem = {};
            _.set(tmpElem, 'process', currProcess);
                Product.findById(currProcess.figli).then(function(figlio) {
                    _.set(tmpElem,'figlio', figlio);
                    productController.retrieveProducts(currProcess.product).then(function(products) {
                        _.set(tmpElem,'products', products);
                        count++;
                        tmpProcesses.push(tmpElem);
                        if (count == tmpProcesses.length) {
                            defer.resolve(tmpProcesses);
                        }
                    });
                }).catch(function(err) {
                    defer.reject(err);
                });
        });
        return defer.promise;
    }


};