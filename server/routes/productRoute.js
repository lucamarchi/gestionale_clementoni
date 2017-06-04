/**
 * Created by luca on 23/05/16.
 */


var Product = require('./../models/product');
var productController = require('./../controllers/productController');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/products', function(req, res, next) {
            var data = {};
            Product.findAll().then(function(result) {
                data.products = result;
                res.status(200).json({
                    "success": true,
                    "message": "Products list",
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
    
        .get('/products/:product_id', function(req,res,next) {
            var data = {};
            Product.findById(req.params.product_id).then(function(result) {
                data.product = result;
                res.status(200).json({
                    "success": true,
                    "message": "Product retrieved",
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
    
        .delete('/products/:product_id', function(req,res,next) {
            var productId = req.params.product_id;
            productController.deleteProductFromOrder(productId).then(function() {
                res.status(200).json({
                    "success": true,
                    "message": "Product deleted",
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        })

        .delete('/product/stock/:product_id', function(req,res,next) {
            var productId = req.params.product_id;
            var data = {};
            Product.deleteStock(productId).then(function(result) {
                data.product = result;
                res.status(200).json({
                    "success": true,
                    "message": "Stock deleted",
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
    
        .put('/products/:product_id', function(req,res,next) {
            var data = {};
            var newProduct = req.body.product;
            var productId = req.params.product_id;
            Product.modifyProduct(productId, newProduct).then(function(product) {
                data.product = product;
                res.status(200).json({
                    "success": true,
                    "message": "Product modified",
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

        .put('/product/reso/:product_id', function(req,res,next) {
            var productId = req.params.product_id;
            var data = {};
            var reso = req.body.reso;
            var article = req.body.article;
            var product = req.body.product;
            productController.createProductReso(productId,product,reso,article).then(function(result) {
                data.product = result;
                res.status(200).json({
                    "success": true,
                    "message": "Product reso created",
                    "data": data
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