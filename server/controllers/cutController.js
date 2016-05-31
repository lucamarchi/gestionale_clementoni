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

    apiRoutes.get('/cuts', function(req,res,next) {
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
    }),

    apiRoutes.get('/cut/:cut_id', function(req,res,next) {
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
                    if (result.customer && result.customer != null) {
                        var customerId = result.customer;
                        var promiseCustomer = Customer.findById(customerId);
                    }
                    Q.all(promisesArticle, promiseCustomer)
                        .then(function (articles,customer) {
                            res.status(200).json({
                                "success": true,
                                "message": "Cut found",
                                "cut": result,
                                "articles": articles,
                                "customer": customer
                            });
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
    });

    apiRoutes.get('/cuts/accepted', function(req,res,next) {
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
    });

    apiRoutes.put('/cut/:cut_id', function (req,res,next) {
        var cutId = req.params.cut_id;
        Cut.setCutAccepted(cutId).then(function(result) {
            if (!result) {
                res.status(404).json({
                    "success": false,
                    "message": "No cut accepted"
                });
            } else {
                var promises = [];
                var status = "libero";
                result.articoli.forEach(function(currArticle) {
                    var newMethod = Article.setArticleStatus(currArticle,status);
                    promises.push(newMethod);
                });
                Q.all(promises).then(function(articles) {
                    res.status(200).json({
                        "success": true,
                        "message": "Cut accepted",
                        "cut": result,
                        "articles": articles
                    });
                })
            }
        }).catch(function(err) {
            res.status(404).json({
                "success": false,
                "message": "Internal server error",
                "err": err.message
            });
        });
    });

    apiRoutes.get('/cuts/update', function(req,res,next) {
        Cut.lastCutCod().then(function (result) {
            var date = new Date().getFullYear();
            var newCod = result + 1;
            console.log("CODICE: "+newCod);
            request.findNewCuts(date, newCod).then(function (cuts) {
                if (cuts && cuts.length > 0) {
                    Q.all(cuts.map(function (currCut) {
                        return Cut.saveNewCut(currCut)
                            .then(function (cut) {
                                return Q.all(currCut.articoli.map(function (currArticle) {
                                    return Article.saveNewArticle(currArticle)
                                        .then(function (article) {
                                            return Cut.addArticleToCut(article.id, cut.id)
                                        })
                                }))
                            })
                    })).then(function (result) {
                        res.status(404).json({
                            "success": true,
                            "message": "Cuts updated",
                            "cuts": cuts
                        });
                    }).catch(function (err) {
                        res.status(404).json({
                            "success": false,
                            "message": "Internal server error 2",
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
                "message": "Internal server error 2",
                "err": err
            });
        })
    }),

    apiRoutes.get('/prova', function(res,req,err) {
        request.findCustomer().then(function (results) {
            var promises = [];
            for (var i in results) {
                var newMethod = Customer.checkCustomer(results[i].Id);
                promises.push(newMethod);
            }
            Q.all(promises).then(function (results) {
                console.log(results);
            });
        })
    })

};