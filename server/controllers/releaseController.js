/**
 * Created by luca on 07/07/16.
 */

var Product = require('./../models/product');
var Cut = require('./../models/cut');
var Release = require('./../models/release');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/releases', function(req, res, next) {
            Release.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Releases not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Releases list",
                            "releases": result
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

        .get('/release/:release_id', function(req,res,next) {
            Release.findById(req.params.release_id)
                .then(function(result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Release not found"
                        });
                    } else {
                        var promisesCut = [];
                        var promisesProduct = [];
                        if (result.productsId && result.productsId.length > 0) {
                            var productsId = result.productsId;
                            productsId.forEach(function (currProduct) {
                                var newMethod = Product.findById(currProduct);
                                promisesProduct.push(newMethod);
                            });
                        }
                        if (result.cutsId && result.cutsId.length > 0) {
                            var cutsId = result.cutsId;
                            cutsId.forEach(function (currCut) {
                                var newMethod = Cut.findById(currCut);
                                promisesCut.push(newMethod);
                            });
                        }
                        Q.all(promisesProduct).then(function (products) {
                            Q.all(promisesCut)
                                .then(function (cuts) {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Release and product list",
                                        "release": result,
                                        "products": products,
                                        "cuts": cuts
                                    });
                                });
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

        .post('/release', function(req,res,next) {
            var release = req.body.release;
            Release.saveNewRelease(release).then(function(result) {
                if (req.body.products && req.body.products.length > 0) {
                    var products = req.body.products;
                    var promises = [];
                    products.forEach(function (currProduct) {
                        var newMethod = Release.addProductToRelease(result._id, currProduct._id);
                        promises.push(newMethod);
                    });
                }
                if (req.body.cuts && req.body.cuts.length > 0) {
                    var cuts = req.body.cuts;
                    if (!promises) {
                        var promises = [];
                    }
                    cuts.forEach(function (currCut) {
                        var newMethod = Release.addCutToRelease(result._id, currCut._id);
                        promises.push(newMethod);
                    });
                }
                if (promises && promises.length > 0) {
                    Q.all(promises).then(function (restmp) {
                        res.status(200).json({
                            "success": true,
                            "message": "Release saved",
                            "release": result
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Release saved",
                        "release": result
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            })
        })

        .delete('/release/:release_id', function(req,res,next) {
            var releaseId = req.params.release_id;
            Release.findById(releaseId).then(function(release) {
                var promises = [
                    Release.deleteRelease(releaseId)
                ];
                if (release.productsId && release.productsId.length > 0) {
                    var productsId = release.productsId;
                    productsId.forEach(function(currProduct) {
                        var newMethod = Release.removeProductToRelease(releaseId,currProduct);
                        promises.push(newMethod);
                    });
                }
                if (release.cutsId && release.cutsId.length > 0) {
                    var cutsId = release.cutsId;
                    if (!promises) {
                        var promises = [];
                    }
                    cutsId.forEach(function(currCut) {
                        var newMethod = Release.removeCutToRelease(releaseId,currCut);
                        promises.push(newMethod);
                    })
                }
                Q.all(promises).then(function(result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Release deleted",
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        });


};