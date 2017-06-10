/**
 * Created by luca on 24/05/16.
 */

var Cut = require('./../models/cut');
var Article = require('./../models/article');
var articleController = require('./../controllers/articleController');
var cutController = require('./../controllers/cutController');
var configs = require('./../configs/url');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/articles', function(req,res,next) {
            var data = {};
            Article.findAllWithStatus().then(function(result) {
                data.articles = result;
                res.status(200).json({
                    "success": true,
                    "message": "Article list",
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

        .get('/article/:article_id', function(req,res,next) {
            var data = {};
            Article.findById(req.params.article_id).then(function(result) {
                data.article = result;
                res.status(200).json({
                    "success": true,
                    "message": "Article retrieved",
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
    
        .get('/articlesProd/:status', function(req,res,next) {
            var status = req.params.status;
            var data = {};
            Article.findByStatusProd(status).then(function(result) {
                data.articles = result;
                res.status(200).json({
                    "success": true,
                    "message": "Article list",
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

        .get('/articlesEvas/:status', function(req,res,next) {
            var status = req.params.status;
            var data = {};
            Article.findByStatusEvas(status).then(function(result) {
                data.articles = result;
                res.status(200).json({
                    "success": true,
                    "message": "Article list",
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
    
        .put('/articles/product/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            var productId = req.body.product._id;
            var data = {};
            Article.addProductToArticle(articleId,productId).then(function(result) {
                data.articles = result;
                res.status(200).json({
                    "success": true,
                    "message": "Product add to article",
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
    
        .put('/articles/complete/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            var data = {};
            Article.setArticleComplete(articleId).then(function(result) {
                Article.unsetProductToArticle(articleId).then(function(result) {
                    data.articles = result;
                    res.status(200).json({
                        "success": true,
                        "message": "Article complete",
                        "data": data
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

        .delete('/article/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            articleController.deleteArticle(articleId).then(function() {
                res.status(200).json({
                    "success": true,
                    "message": "Article deleted"
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
            var data = {};
            Article.modifyArticle(articleId, article).then(function(result) {
                if (((article.hasOwnProperty("lunghezzaAssegnata") && article.hasOwnProperty("larghezzaAssegnata") && article.hasOwnProperty("qualita")) || ((article.tipo == "coil" || article.tipo == "nastro") & article.hasOwnProperty("larghezzaAssegnata") && article.hasOwnProperty("qualita")))) {
                    articleController.setArticleInit(articleId,"libero").then(function(result) {
                        data.article = result;
                        cutController.checkArticlesInCut(articleId).then(function(result) {
                            if (result == true) {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Article modified and Cut ready",
                                    "data": data,
                                });
                            } else {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Article modified",
                                    "data": data
                                });
                            }
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Article modified"
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

