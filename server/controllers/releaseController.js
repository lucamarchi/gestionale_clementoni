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
            Release.saveNewRelease(release).then(function(result) {
                if (req.body.stocks && req.body.stocks.length > 0) {
                    var stocks = req.body.stocks;
                    var promises = [];
                    var pesoTotale = 0;
                    stocks.forEach(function(currStock) {
                        pesoTotale += currStock.pesoNetto;
                        var newMethod = Product.findByStock(currStock._id);
                        promises.push(newMethod);
                    });
                    Q.all(promises).then(function(products) {
                       if (products && products.length > 0) {
                           var promises = [];
                           products.forEach(function(currProduct) {
                               var newMethod = Release.addProductToRelease(result._id,currProduct._id);
                               promises.push(newMethod);
                           });
                           if (req.body.articles && req.body.articles.length > 0) {
                               var articles = req.body.articles;
                               articles.forEach(function(currArticle) {
                                   var article = currArticle.article;
                                   var quantita = currArticle.quantita;
                                   var unita = currArticle.unita;
                                   var triplaArticle = { article: article._id, quantita: quantita, unita: unita };
                                   var newMethod = Release.addArticleToRelease(result._id,triplaArticle);
                                   var newMethodStat = Article.setArticleStatus(article._id, "completato");
                                   var newMethodScalaArt = Article.updatePesoAttualeArticle(article._id,article.pesoAttuale);
                                   var newMethodPesoTot = Release.addPesoTotaleToRelease(result._id,pesoTotale);
                                   promises.push(newMethod);
                                   promises.push(newMethodStat);
                                   promises.push(newMethodPesoTot);
                                   promises.push(newMethodScalaArt);
                               })
                           }
                           Release.findNewNumeroRelease().then(function(number) {
                               var query = {'numero': number};
                               Release.updateRelease(result._id, query).then(function(result) {
                                   Q.all(promises).then(function(resp) {
                                       res.status(200).json({
                                           "success": true,
                                           "message": "Release saved",
                                           "release": result
                                       });
                                   });
                               });
                           });
                       }
                    });
                } else if (req.body.articles && req.body.articles.length > 0) {
                    var articles = req.body.articles;
                    var promises = [];
                    articles.forEach(function(currArticle) {
                        var article = currArticle.article;
                        var quantita = currArticle.quantita;
                        var unita = currArticle.unita;
                        var triplaArticle = { article: article._id, quantita: quantita, unita: unita };
                        var newMethod = Release.addArticleToRelease(result._id,triplaArticle);
                        var newMethodStat = Article.setArticleStatus(article._id, "completato");
                        var newMethodScalaArt = Article.updatePesoAttualeArticle(article._id,article.pesoAttuale);
                        promises.push(newMethod);
                        promises.push(newMethodStat);
                        promises.push(newMethodScalaArt);
                    });
                    Release.findNewNumeroRelease().then(function(number) {
                        var query = {'numero': number};
                        Release.updateRelease(result._id, query).then(function(result) {
                            Q.all(promises).then(function(resp) {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Release saved",
                                    "release": result
                                });
                            });
                        });
                    });
                } else {
                    Release.findNewNumeroRelease().then(function(number) {
                        var query = {'numero': number};
                        Release.updateRelease(result._id, query).then(function(result) {
                            res.status(200).json({
                                "success": true,
                                "message": "Release saved",
                                "release": result
                            });
                        });
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