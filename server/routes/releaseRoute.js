/**
 * Created by luca on 07/07/16.
 */

var Product = require('./../models/product');
var Article = require('./../models/article');
var Release = require('./../models/release');
var releaseController = require('./../controllers/releaseController');
var productController = require('./../controllers/productController');
var articleController = require('./../controllers/articleController');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/releases', function(req, res, next) {
            var data = {};
            Release.findAll().then(function(result) {
                data.releases = result;
                res.status(200).json({
                    "success": true,
                    "message": "Releases list",
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

        .get('/release/:release_id', function(req,res,next) {
            var data = {};
            Release.findById(req.params.release_id).then(function(result) {
                data.release = result;
                productController.retrieveProducts(result.productsId).then(function(products) {
                    data.products = products;
                    releaseController.retrieveArticles(result).then(function(articles) {
                        data.articles = articles;
                        res.status(200).json({
                            "success": true,
                            "message": "Release and product list",
                            "data": data
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

        .post('/release', function(req,res,next) {
            var release = req.body.release;
            var data = {};
            releaseController.createRelease(release).then(function(result) {
                data.release = result;
                var promises = [];
                if (req.body.products && req.body.products.length > 0) {
                    var products = req.body.products;
                    promises.push(releaseController.addProductsToRelease(result,products));
                }
                if (req.body.articles && req.body.articles.length > 0) {
                    var articles = req.body.articles;
                    promises.push(releaseController.createTriplaArticlesToRelease(result,articles));
                }
                Q.all(promises).then(function() {
                    res.status(200).json({
                        "success": true,
                        "message": "Release saved",
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

        .delete('/release/:release_id', function(req,res,next) {
            var releaseId = req.params.release_id;
            releaseController.removeRelease(releaseId).then(function() {
                res.status(200).json({
                    "success": true,
                    "message": "Release deleted"
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
            releaseController.setReleaseComplete(releaseId).then(function() {
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