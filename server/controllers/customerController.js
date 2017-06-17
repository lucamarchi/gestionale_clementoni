/**
 * Created by luca on 05/04/17.
 */

var Q = require('q');
var Customer = require('./../models/customer');
var Cut = require('./../models/cut');
var Article = require('./../models/article');
var request = require('./../controllers/requestController');

module.exports = {

    findCustomers: function(cuts) {
        var deferred = Q.defer();
        request.findCustomer().then(function(tmpCustomers) {
            if (tmpCustomers.length > 0) {
                var result = Q(null);
                Q.all(cuts.map(function(currCut) {
                    result = result.then(function() {
                        return checkAndSetCustomer(currCut._id, currCut.clienteCod, tmpCustomers)
                    });
                })).then(function(finalResult) {
                    deferred.resolve(finalResult);
                });
            } else {
                deferred.reject();
            }
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    }

};

var checkAndSetCustomer = function(cutId,identity,tmpCustomers) {
    var deferred = Q.defer();
    Customer.findByIdentity(identity).then(function(customer) {
        if (customer && customer.ident === identity) {
            setCustomerToCut(cutId, customer).then(function (result) {
                deferred.resolve(result);
            });
        } else {
            tmpCustomers.forEach(function (currTmpCustomer) {
                if (currTmpCustomer.ident === identity) {
                    Customer.saveNewCustomer(currTmpCustomer).then(function (customer) {
                        setCustomerToCut(cutId, customer).then(function (result) {
                            deferred.resolve(result);
                        });
                    });
                }
            });
        }
    }).catch(function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

var setCustomerToCut = function(cutId,customer) {
    var deferred = Q.defer();
    Cut.addCustomerToCut(customer._id, cutId).then(function(cut) {
        Cut.addRegionToCut(cutId,customer.regione.toLowerCase()).then(function(cutF) {
            Cut.addNomeClienteToCut(cutId, customer.nome).then(function (cutN) {
                Cut.addPRToCut(cutId, customer.provincia).then(function (cutP) {
                    var articleIds = cutP.articoli;
                    var promises = [];
                    articleIds.forEach(function (currArticle) {
                        var newMethod1 = Article.addRegionToArticle(currArticle, cutP.region);
                        var newMethod2 = Article.addPRToArticle(currArticle, cutP.provincia);
                        var newMethod3 = Article.addCodCutToArticle(currArticle, cutP.codice);
                        promises.push(newMethod1);
                        promises.push(newMethod2);
                        promises.push(newMethod3);
                    });
                    Q.all(promises).then(function(result) {
                        deferred.resolve(cutP);
                    });
                })
            })
        })
    }).catch(function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};