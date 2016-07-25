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
                        res.status(404).json({
                            "success": false,
                            "message": "Articles not found"
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

        .get('/articles/prova/', function(req,res,next) {
            var articleId = req.params.article_id;
            Article.findOne(articleId).then(function(result) {
                if (!result)
                    console.log("NO!: "+result);
                else console.log("SI: "+result);
            }).catch(function(err) {
                console.log("ERR");
                console.log(err);
            })
        });

};

