/**
 * Created by luca on 03/06/16.
 */

var Prod = require('./../models/prod');
var Article = require('./../models/article');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/prods', function(req, res, next) {
            Prod.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Prods not found",
							"prods": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Prods list",
                            "prods": result
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

        .get('/prods/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            Prod.findById(prodId).then(function(result) {
                if (result.articoliId && result.articoliId.length > 0) {
                    var articoli = result.articoliId;
                    var promises = [];
                    articoli.forEach(function(currArticle) {
                        var newMethod = Article.findById(currArticle);
                        promises.push(newMethod);
                    });
                    Q.all(promises)
                        .then(function(articles) {
                            res.status(200).json({
                                "success": true,
                                "message": "Prod found",
                                "prod": result,
                                "articoli": articles
                            });
                        });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Prod found with zero articles",
                        "prod": result
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .post('/prods', function(req,res,next) {
            var prod = req.body.prod;
            Prod.findNewNumeroProd().then(function(number) {
                Prod.saveNewProd(prod,number)
                    .then(function (result) {
                        if (req.body.articoli && req.body.articoli.length > 0) {
                            var articoli = req.body.articoli;
                            var promises = [];
                            articoli.forEach(function (currArticle) {
                                var newMethodAdd = Prod.addArticleToProd(result._id, currArticle._id);
                                var newMethodSet = Article.setArticleStatusProd(currArticle._id,"assegnato");
                                promises.push(newMethodAdd,newMethodSet);
                            });
                            Q.all(promises)
                                .then(function (finalResult) {
                                    var artPromises = [];
                                    articoli.forEach(function(currArticle) {
                                       var newMethod = Article.findById(currArticle);
                                        artPromises.push(newMethod);
                                    });
                                    Q.all(artPromises).then(function(retrieveArt) {
                                        var peso = 0;
                                        retrieveArt.forEach(function(currArticle) {
                                            peso += currArticle.pesoAttuale;
                                        });
                                        Prod.setPesoInizialeProd(result.id,peso).then(function(prods1) {
                                            Prod.setPesoSaldoProd(result.id,peso).then(function(prods2) {
                                                res.status(200).json({
                                                    "success": true,
                                                    "message": "Prod save",
                                                    "prod": result
                                                });
                                            });
                                        })
                                    });
                                })
                        } else {
                            res.status(200).json({
                                "success": true,
                                "message": "Prod save with zero articles",
                                "prod": result
                            });
                        }
                    })
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .delete('/prods/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            Prod.findById(prodId).then(function(prod) {
                var promises = [
                    Prod.deleteProd(prodId)
                ];
                if (prod.articoliId && prod.articoliId.length > 0) {
                    var articoli = prod.articoliId;
                    articoli.forEach(function(currArticle) {
                        var newMethodSet = Article.setArticleStatusProd(currArticle,"libero");
                        promises.push(newMethodSet);
                    });
                    Q.all(promises)
                        .then(function(result) {
                            res.status(200).json({
                                "success": true,
                                "message": "Prod delete",
                                "prod": result
                            });
                        });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Prod delete with zero articles",
                        "prod": prod
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .put('/prods/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            var prod = req.body.prod;
            Prod.modifyProd(prodId,prod).then(function(result) {
                if (req.body.articoli && req.body.articoli.length > 0) {
                    var promises = [];
                    var articoli = req.body.articoli;
                    var peso = 0;
                    articoli.forEach(function(currArticle) {
                        var newMethodAdd = Prod.addArticleToProd(prodId,currArticle._id);
                        var newMethodSet = Article.setArticleStatusProd(currArticle._id, "assegnato");
                        peso += currArticle.pesoAttuale;
                        promises.push(newMethodAdd,newMethodSet);
                    });
                    peso += prod.pesoIniziale;
                    Q.all(promises).then(function(final) {
                        Prod.setPesoInizialeProd(result.id,peso).then(function(prods1) {
                            Prod.setPesoSaldoProd(result.id,peso).then(function(prods2) {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Prod save",
                                    "prod": result
                                });
                            });
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Prod updated with 0 articles",
                        "prod": result
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

        .delete('/prod/articles/:prod_id', function(req,res,next) {
            var articleId = req.body.article._id;
            Prod.removeArticleToProd(articleId).then(function(result) {
                if (result || result !== null) {
                    Article.setArticleStatusProd(articleId,"libero").then(function(prod) {
                        res.status(200).json({
                            "success": true,
                            "message": "Article removed from prod",
                            "prod": result
                        });
                });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "No article in prod"
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        });

};