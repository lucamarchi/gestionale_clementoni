/**
 * Created by luca on 24/05/16.
 */

var Cut = require('./../models/cut');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var request = require('./requestController');
var configs = require('./../configs/url');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/cuts', function(req, res, next) {
            Cut.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Cuts not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Cuts list",
                            "cuts": result
                        });
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })

        .get('/cut/:cut_id', function(req,res,next) {
            var cutId = req.params.cut_id;
            Cut.findById(cutId)
                .then(function (result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Cut not found"
                        });
                    } else {
                        if (result.articoli && result.articoli.length > 0) {
                            var articlesId = result.articoli;
                            var promisesArticle = [];
                            articlesId.forEach(function (currArticle) {
                                var newMethod = Article.findById(currArticle);
                                promisesArticle.push(newMethod);
                            });
                        }
                        Q.all(promisesArticle)
                            .then(function (articles) {
                                if (result.customer && result.customer != null) {
                                    var customerId = result.customer;
                                    Customer.findById(customerId).then(function(customer) {
                                        res.status(200).json({
                                            "success": true,
                                            "message": "Cut found",
                                            "cut": result,
                                            "articles": articles,
                                            "customer": customer
                                        });
                                    });
                                } else {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Cut found withoud customer",
                                        "cut": result,
                                        "articles": articles
                                    });
                                }
                            })
                            .catch(function (err) {
                                res.status(404).json({
                                    "success": false,
                                    "message": "Internal server error",
                                    "err": err.message
                                });
                            });
                    }
                })
                .catch(function (err) {
                    res.status(404).json({
                        "success": false,
                        "message": "Internal server error",
                        "err": err.message
                    });
                });
        })

        .get('/cuts/accepted', function(req,res,next) {
            Cut.findAllAccepted().then(function(result) {
                if (!result || result.length === 0) {
                    res.status(404).json({
                        "success": false,
                        "message": "No cut accepted"
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Cuts list",
                        "cuts": result
                    });
                }
            }).catch(function(err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            });
        })

        .put('/cut/:cut_id', function (req,res,next) {
            var cutId = req.params.cut_id;
            var operator = req.body.operator;
            Cut.setCutAccepted(cutId).then(function(result) {
                if (!result) {
                    res.status(404).json({
                        "success": false,
                        "message": "No cut accepted"
                    });
                } else {
                    Cut.setOperatorToCut(cutId, operator).then(function (result) {
                        var promises = [];
                        var status = "libero";
                        result.articoli.forEach(function (currArticle) {
                            var newMethod = Article.setArticleStatus(currArticle, status);
                            promises.push(newMethod);
                        });
                        Q.all(promises).then(function (articles) {
                            res.status(200).json({
                                "success": true,
                                "message": "Cut accepted",
                                "cut": result,
                                "articles": articles
                            });
                        })
                    });
                }
            }).catch(function(err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            });
        })

        .get('/cuts/update', function(req,res,next) {
            Cut.lastCutCod().then(function (result) {
                var date = new Date().getFullYear();
                var newCod = result + 1;
                var finalCuts = [];
                request.findNewCuts(date, newCod).then(function (cuts) {
                    if (cuts && cuts.length > 0) {
                        Q.all(cuts.map(function (currCut) {
                            return Cut.saveNewCut(currCut)
                                .then(function (cut) {
                                    finalCuts.push(cut);
                                    return Q.all(currCut.articoli.map(function (currArticle) {
                                        return Article.saveNewArticle(currArticle)
                                            .then(function (article) {
                                                return Cut.addArticleToCut(article.id, cut.id)
                                            })
                                    }));
                                })
                        })).then(function (cuts) {
                            request.findCustomer().then(function(tmpCustomers) {
                               if (tmpCustomers.length > 0) {
                                   var result = Q(null);
                                   Q.all(finalCuts.map(function(currFinalCut) {
                                       result = result.then(function() {
                                           return checkAndSetCustomer(currFinalCut._id, currFinalCut.clienteCod, tmpCustomers)
                                       })
                                   })).then(function(finalResult) {
                                       res.status(200).json({
                                           "success": true,
                                           "message": "Cuts updated",
                                           "cuts": cuts
                                       });
                                   })
                               }
                            });
                        }).catch(function (err) {
                            res.status(404).json({
                                "success": false,
                                "message": "Internal server error 1",
                                "err": err
                            });
                        });
                    } else {
                        res.status(404).json({
                            "success": true,
                            "message": "No new cut found",
                        });
                    }
                });
            }).catch(function(err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err
                });
            })
        });

    checkAndSetCustomer = function(cutId,identity,tmpCustomers) {
        var deferred = Q.defer();
        Customer.findByIdentity(identity).then(function(customer) {
            if (customer && customer.ident === identity) {
                Cut.addCustomerToCut(customer._id,cutId).then(function(result) {
                    deferred.resolve(result);
                });
            }
        }).catch(function(err) {
            if (err.message === "Customer not found" && err.status === 400) {
                tmpCustomers.forEach(function (currTmpCustomer) {
                    if (currTmpCustomer.ident === identity) {
                        Customer.saveNewCustomer(currTmpCustomer).then(function (customer) {
                            Cut.addCustomerToCut(customer._id, cutId).then(function (cut) {
                                deferred.resolve(cut);
                            })
                        })
                    }
                });
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }

};

