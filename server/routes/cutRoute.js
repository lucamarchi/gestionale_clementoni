/**
 * Created by luca on 24/05/16.
 */

var Cut = require('./../models/cut');
var Customer = require('./../models/customer');
var cutController = require('./../controllers/cutController');
var articleController = require('./../controllers/articleController');
var customerController = require('./../controllers/customerController');
var configs = require('./../configs/url');
var regions = require('./../configs/regions');
var Q = require('q');


module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/cuts', function(req, res, next) {
            var data = {};
            Cut.findAll().then(function(result) {
                data.cuts = result;
                res.status(200).json({
                    "success": true,
                    "message": "Cuts list",
                    "data": data
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .get('/cut/:cut_id', function(req,res,next) {
            var cutId = req.params.cut_id;
            var data = {};
            Cut.findById(cutId).then(function(result) {
                data.cut = result;
                articleController.retrieveArticles(result.articoli).then(function(articles) {
                    data.articles = articles;
                    var customerId = result.customer;
                    Customer.findById(customerId).then(function(customer) {
                        data.customer = customer;
                        res.status(200).json({
                            "success": true,
                            "message": "Cut found",
                            "data": data
                        });
                    });
                });
            }).catch(function (err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            });
        })

        .get('/cuts/accepted', function(req,res,next) {
            var data = {};
            Cut.findAllAccepted().then(function(result) {
                data.cuts = result;
                res.status(200).json({
                    "success": true,
                    "message": "Cuts list",
                    "data": data
                });
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
            var data = {};
            Cut.findById(cutId).then(function(cut) {
               if (cut.flag == true) {
                   cutController.acceptedCut(cut._id, operator).then(function(result) {
                       data.cut = result;
                       if (result.articoli && result.articoli.length > 0) {
                           res.status(200).json({
                               "success": true,
                               "message": "Cut accepted",
                               "data": data
                           });
                       } else {
                           res.status(200).json({
                               "success": true,
                               "message": "Cut accepted with 0 articles",
                               "data": data
                           });
                       }
                   });
               } else {
                   res.status(200).json({
                       "success": false,
                       "message": "Cut not ready"
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
            var data = {};
            cutController.retrieveNewCuts().then(function(cuts) {
                data.cuts = cuts;
                if (cuts && cuts.length > 0) {
                    customerController.findCustomers(cuts).then(function(result) {
                        res.status(200).json({
                            "success": true,
                            "message": "Cuts updated",
                            "data": data
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "No new cut found",
                        "data": []
                    });
                }
            }).catch(function (err) {
                res.status(404).json({
                    "success": false,
                    "message": "Internal server error 1",
                    "err": err
                });
            });
        })

        .put('/cut/:cut_id', function(req,res,next) {
            var cut = req.body.cut;
            var cutId = req.params.cut_id;
            var data = {};
            Cut.modifyCut(cutId,cut).then(function(result) {
                data.cut = result;
                res.status(200).json({
                    "success": true,
                    "message": "Cut modified",
                    "data": data
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
                if (result.articoli && result.articoli.length > 0) {
                    var articoli = result.articoli;
                    var promises = [
                        Cut.deleteCut(cutId),
                        articleController.deleteArticles(articoli)
                    ];
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

