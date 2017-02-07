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
        .get('/articles', function(req,res,next) {
            Article.findAllWithStatus()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Articles not found",
                            "articles": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Article list",
                            "articles": result
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
    
        .get('/articles/:status', function(req,res,next) {
            var status = req.params.status;
            Article.findByStatus(status)
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Articles not found",
							"articles": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Article list",
                            "articles": result
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
    
        .put('/articles/stock/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            var stockId = req.body.stock._id;
            Article.addStockToArticle(articleId,stockId)
                .then(function(result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Stock add to article",
                        "articles": result
                    });
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })
    
        .put('/articles/complete/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            Article.setArticleComplete(articleId)
                .then(function(result) {
                    Article.unsetStockToArticle(articleId)
                        .then(function(result) {
                            res.status(200).json({
                                "success": true,
                                "message": "Article complete",
                                "articles": result
                            });
                        })
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })

        .delete('/article/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            Article.deleteArticle(articleId)
                .then(function(result) {
                    Cut.removeArticleToCut(articleId).then(function(result) {
                        res.status(200).json({
                            "success": true,
                            "message": "Article deleted"
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

        .put('/articles/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            var article = req.body.article;
            Article.modifyArticle(articleId, article).then(function(result) {
                if (article.lunghezzaAssegnata && article.larghezzaAssegnata && article.qualita) {
                    Cut.findByArticle(articleId).then(function (cut) {
                        if (cut && cut !== null) {
                            var promises = [];
                            if (cut.articoli && cut.articoli.length > 0) {
                                var articles = cut.articoli;
                                articles.forEach(function (currArt) {
                                    var newMethod = Article.findById(currArt);
                                    promises.push(newMethod);
                                });
                                Q.all(promises).then(function (articles) {
                                    var check = true;
                                    articles.forEach(function (currArticles) {
                                        if (!currArticles.lunghezzaAssegnata && !currArticles.larghezzaAssegnata && !article.qualita) {
                                            check = false;
                                        }
                                    });
                                    if (check) {
                                        Cut.setCutReady(cut._id).then(function (result) {
                                            res.status(200).json({
                                                "success": true,
                                                "message": "Article and cut modified"
                                            })
                                        });
                                    } else {
                                        res.status(200).json({
                                            "success": true,
                                            "message": "Article modified"
                                        })
                                    }
                                });
                            } else {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Article modified"
                                });
                            }
                        } else {
                            res.status(200).json({
                                "success": true,
                                "message": "Article modified"
                            });
                        }
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Article modified"
                    })
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            })
        })

        .get('/articles/region/:region_name', function(req,res,next) {
            var region = req.params.region_name;
            Cut.findByRegion(region).then(function(result) {
                if (result && result.length > 0) {
                    var promises = [];
                    result.forEach(function(currCut) {
                        if (currCut.articoli && currCut.articoli.length > 0) {
                            var currArticles = currCut.articoli;
                            currArticles.forEach(function(currArt) {
                                var newMethod = Article.findById(currArt);
                                promises.push(newMethod);
                            });
                        }
                    });
                    Q.all(promises).then(function(articles) {
                        res.status(200).json({
                            "success": true,
                            "message": "Article by region list",
                            "articles": articles
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "No Article by this region",
                        "articles": []
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

};

