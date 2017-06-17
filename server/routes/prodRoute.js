/**
 * Created by luca on 03/06/16.
 */

var Q = require('q');
var Prod = require('./../models/prod');
var Article = require('./../models/article');
var articleController = require('./../controllers/articleController');
var prodController = require('./../controllers/prodController');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/prods', function(req, res, next) {
            var data = {};
            Prod.findAll().then(function(result) {
                data.prods = result;
                res.status(200).json({
                    "success": true,
                    "message": "Prods list",
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

        .get('/prods/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            var data = {};
            Prod.findById(prodId).then(function(result) {
                data.prod = result;
                articleController.retrieveArticles(result.articoliId).then(function(articles) {
                    data.articles = articles;
                    res.status(200).json({
                        "success": true,
                        "message": "Prod found",
                        "data": data
                    });
                });
            }).catch(function (err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .post('/prods', function(req,res,next) {
            var prod = req.body.prod;
            var articles = req.body.articoli;
            var data = {};
            prodController.createProd(prod).then(function(result) {
                data.prod = result;
                var promises = [
                    prodController.addArticlesToProd(result._id,articles),
                    articleController.setArrayArticlesStatusProd(articles,"assegnato")
                ];
                Q.all(promises).then(function() {
                    res.status(200).json({
                        "success": true,
                        "message": "Prod save",
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

        .delete('/prods/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            prodController.deleteProd(prodId).then(function() {
                res.status(200).json({
                    "success": true,
                    "message": "Prod delete"
                });
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
            var articlesToAdd = req.body.articlesToAdd;
            var articlesToRemove = req.body.articlesToRemove;
            var data = {};
            Prod.modifyProd(prodId,prod).then(function(result) {
                var promises = [
                    prodController.addArticlesToProd(result._id, articlesToAdd),
                    articleController.setArrayArticlesStatusProd(articlesToAdd, "assegnato"),
                    prodController.removeArticlesToProd(result._id,articlesToRemove),
                    articleController.setArrayArticlesStatusProd(articlesToRemove, "libero")
                ];
                Q.all(promises).then(function () {
                    Prod.findById(prodId).then(function(result) {
                        data.prod = result;
                        articleController.retrieveArticles(result.articoliId).then(function(articles) {
                            data.articles = articles;
                            res.status(200).json({
                                "success": true,
                                "message": "Prod modified",
                                "data": data
                            });
                        });
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

        .delete('/prod/articles/:prod_id', function(req,res,next) {
            var prodId = req.params.prod_id;
            var articleId = req.body.article._id;
            var data = {};
            prodController.removeArticleToProd(prodId,articleId).then(function(result) {
                data.prod = result;
                res.status(200).json({
                    "success": true,
                    "message": "Article removed from prod",
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

};