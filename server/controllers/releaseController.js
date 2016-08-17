/**
 * Created by luca on 07/07/16.
 */

var Product = require('./../models/product');
var Article = require('./../models/article');
var Release = require('./../models/release');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/releases', function(req, res, next) {
            Release.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Releases not found",
                            "releases": []
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
                        res.status(200).json({
                            "success": false,
                            "message": "Release not found"
                        });
                    } else {
                        var promisesArticle = [];
                        var promisesProduct = [];
                        if (result.productsId && result.productsId.length > 0) {
                            var productsId = result.productsId;
                            productsId.forEach(function (currProduct) {
                                var newMethod = Product.findById(currProduct);
                                promisesProduct.push(newMethod);
                            });
                        }
                        if (result.articlesId && result.articlesId.length > 0) {
                            var articlesId = result.articlesId;
                            articlesId.forEach(function (currArticle) {
                                var newMethod = Article.findById(currArticle);
                                promisesArticle.push(newMethod);
                            });
                        }
                        Q.all(promisesProduct).then(function (products) {
                            Q.all(promisesArticle)
                                .then(function (articles) {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Release and product list",
                                        "release": result,
                                        "products": products,
                                        "articles": articles
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
            if (req.body.stocks && req.body.stocks.length > 0) {
                var stocks = req.body.stocks;
                var products = [];
                var promises = [];
                stocks.forEach(function(currStocks) {
                    var newMethod = Product.findByStock(currStocks._id);
                    promises.push(newMethod);
                });
                Q.all(promises).then(function(products) {
                    Release.saveNewRelease(release).then(function(result) {
                        if (products && products.length > 0) {
                            var promises = [];
                            products.forEach(function (currProduct) {
                                var newMethod = Release.addProductToRelease(result._id, currProduct._id);
                                promises.push(newMethod);
                            });
                        }
                        if (req.body.articles && req.body.articles.length > 0) {
                            var articles = req.body.articles;
                            if (!promises) {
                                var promises = [];
                            }
                            articles.forEach(function (currArticle) {
                                var newMethod = Release.addArticleToRelease(result._id, currArticle._id);
                                var newMethodSet = Article.setArticleStatus(currArticle._id,"in uscita");
                                promises.push(newMethod);
                                promises.push(newMethodSet);
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
                    })
                });
            }
            Release.saveNewRelease(release).then(function(result) {
                if (products && products.length > 0) {
                    var promises = [];
                    products.forEach(function (currProduct) {
                        var newMethod = Release.addProductToRelease(result._id, currProduct._id);
                        promises.push(newMethod);
                    });
                }
                if (req.body.articles && req.body.articles.length > 0) {
                    var articles = req.body.articles;
                    if (!promises) {
                        var promises = [];
                    }
                    articles.forEach(function (currArticle) {
                        var newMethod = Release.addArticleToRelease(result._id, currArticle._id);
                        var newMethodSet = Article.setArticleStatus(currArticle._id,"in uscita");
                        promises.push(newMethod);
                        promises.push(newMethodSet);
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
            var promises = [];
            Release.findById(releaseId).then(function(result) {
                console.log(result);
                if (result && result.articlesId && result.articlesId.length > 0) {
                    var articles = result.articlesId;
                    articles.forEach(function(currArticle) {
                        var newMethod = Article.setArticleStatus(currArticle,"lavorazione");
                        promises.push(newMethod);
                    });
                }
                var newMethod = Release.deleteRelease(releaseId);
                promises.push(newMethod);
                Q.all(promises).then(function(result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Release deleted"
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })
    
        .put('/release/complete/:release_id', function(req,res,next) {
            var releaseId = req.params.release_id;
            Release.setReleaseComplete(releaseId).then(function(result) {
                res.status(200).json({
                    "success": true,
                    "message": "Release complete"
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

};