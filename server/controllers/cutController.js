/**
 * Created by luca on 24/05/16.
 */

var Cut = require('./../models/cut');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var request = require('./requestController');
var configs = require('./../configs/url');
var regions = require('./../configs/regions');
var Q = require('q');

function Report() {
    this.name = 'x';
    this.peso = 'y';
}

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/cuts', function(req, res, next) {
            Cut.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Cuts not found",
							"cuts": []
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
                        res.status(200).json({
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
                                        "message": "Cut found without customer",
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
                    res.status(200).json({
                        "success": false,
                        "message": "No cut accepted",
                        "cuts": []
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

        .put('/cut/accepted/:cut_id', function (req,res,next) {
            var cutId = req.params.cut_id;
            var operator = req.body.operator;
            Cut.findById(cutId).then(function(cut) {
               if (cut.flag == true) {
                   Cut.setCutAccepted(cutId).then(function(result) {
                       if (!result) {
                           res.status(200).json({
                               "success": false,
                               "message": "No cut accepted"
                           });
                       } else {
                           Cut.setOperatorToCut(cutId, operator).then(function (result) {
                               var promises = [];
                               var status = "libero";
                               result.articoli.forEach(function (currArticle) {
                                   var newMethod1 = Article.setArticleStatusProd(currArticle, status);
                                   var newMethod2 = Article.setArticleStatusEvas(currArticle, status);
                                   promises.push(newMethod1);
                                   promises.push(newMethod2);
                               });
                               Q.all(promises).then(function (articles) {
                                   res.status(200).json({
                                       "success": true,
                                       "message": "Cut accepted",
                                       "cut": result
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
               } else {
                   res.status(200).json({
                       "success": false,
                       "message": "Cut not ready"
                   });
               }
            });
        })

        .get('/cuts/regions/:region_name', function(req,res,next) {
            var region = req.params.region_name;
            Cut.findByRegion(region).then(function(result) {
                if (!result || result.length === 0) {
                    res.status(200).json({
                        "success": false,
                        "message": "No cut by this region",
                        "cuts": []
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

        .get('/cuts/report', function(req,res,next) {
            var regionsArr = regions.name;
            var promises = [];
            regionsArr.forEach(function (currRegion) {
                var newMethod = calculateRegionPeso(currRegion);
                promises.push(newMethod);
            });
            Q.all(promises).then(function (result) {
                res.status(200).json({
                    "success": true,
                    "message": "Reports found",
                    "report": result
                });
            }).catch(function (err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error 1",
                    "err": err
                });
            });
        })

        .get('/cuts/update', function(req,res,next) {
            Cut.lastCutCod().then(function (result) {
                var date = new Date().getFullYear()-1;
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
                                                return Cut.increasePeso(cut.id, article.peso)
                                                    .then(function(res) {
                                                        return Cut.addArticleToCut(article.id, cut.id)
                                                    })
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
                                           "cuts": finalCuts
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
                        res.status(200).json({
                            "success": true,
                            "message": "No new cut found",
							"cuts": []
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
        })

        .put('/cut/:cut_id', function(req,res,next) {
            var cut = req.body.cut;
            var cutId = req.params.cut_id;
            Cut.modifyCut(cutId,cut).then(function(result) {
                res.status(200).json({
                    "success": true,
                    "message": "Cut modified",
                    "cut": result
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            })
        })

        .delete('/cut/:cut_id', function(req,res,next) {
            var cutId = req.params.cut_id;
            Cut.findById(cutId).then(function(result) {
                var promises = [
                    Cut.deleteCut(cutId)
                ];
                if (result.articoli && result.articoli.length > 0) {
                    var articoli = result.articoli;
                    articoli.forEach(function (currArticle) {
                        var newMethod = Article.deleteArticle(currArticle);
                        promises.push(newMethod);
                    });
                    Q.all(promises).then(function(result) {
                        res.status(200).json({
                            "success": true,
                            "message": "Cut and Articles deleted",
                        })
                    });
                } else {
                    Cut.deleteCut(cutId).then(function(result) {
                        res.status(200).json({
                            "success": true,
                            "message": "Cuts deleted",
                        })
                    });
                }
            }).catch(function(err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err
                });
            });
        });

    checkAndSetCustomer = function(cutId,identity,tmpCustomers) {
        var deferred = Q.defer();
        Customer.findByIdentity(identity).then(function(customer) {
            if (customer && customer.ident === identity) {
                Cut.addCustomerToCut(customer._id,cutId).then(function(result) {
                    Cut.addRegionToCut(cutId,customer.regione.toLowerCase()).then(function(cutF) {
                        Cut.addNomeClienteToCut(cutId, customer.nome).then(function (cutN) {
                            Cut.addPRToCut(cutId, customer.provincia).then(function(cutP) {
                                var articleIds = cutP.articoli;
                                var promises = [];
                                articleIds.forEach(function(currArticle) {
                                    var newMethod1 = Article.addRegionToArticle(currArticle,cutP.region);
                                    var newMethod2 = Article.addPRToArticle(currArticle,cutP.provincia);
                                    var newMethod3 = Article.addCodCutToArticle(currArticle,cutP.codice);
                                    var newMethod4 = Article.addCodNameToArticle(currArticle,customer.nome);
                                    promises.push(newMethod1);
                                    promises.push(newMethod2);
                                    promises.push(newMethod3);
                                    promises.push(newMethod4);
                                });
                                Q.all(promises).then(function(result) {
                                    deferred.resolve(cutP);
                                });
                            });
                        });
                    });
                });
            }
        }).catch(function(err) {
            if (err.message === "Customer not found" && err.status === 400) {
                tmpCustomers.forEach(function (currTmpCustomer) {
                    if (currTmpCustomer.ident === identity) {
                        Customer.saveNewCustomer(currTmpCustomer).then(function (customer) {
                            Cut.addCustomerToCut(customer._id, cutId).then(function (cut) {
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
                                            Q.all(promises).then(function (result) {
                                                deferred.resolve(cutP);
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    }
                });
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    },

    calculateRegionPeso = function(region) {
        var deferred = Q.defer();
        var report = [];
        Cut.findByRegion(region).then(function(result) {
            var peso = 0;
            result.forEach(function(currCuts) {
                peso += currCuts.pesoTotale;
            });
            var tmpReport = [region,peso];
            console.log(tmpReport);
            deferred.resolve(tmpReport);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};

