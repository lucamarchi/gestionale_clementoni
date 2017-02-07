/**
 * Created by luca on 23/05/16.
 */


var Product = require('./../models/product');
var Order = require('./../models/order');
var Stock = require('./../models/stock');
var Article = require('./../models/article');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/products', function(req, res, next) {
            Product.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Products not found",
                            "products": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Products list",
                            "products": result
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
    
        .get('/products/:product_id', function(req,res,next) {
            Product.findById(req.params.product_id)
                .then(function(result) {
                    if (!result) {
                        res.status(200).json({
                            "success": false,
                            "message": "Product not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Order and product list",
                            "product": result
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
    
        .delete('/products/:product_id', function(req,res,next) {
            var productId = req.params.product_id;
            Product.findById(productId)
                .then(function(product) {
                    var promises = [
                        Order.removeProductToOrder(productId),
                        Product.deleteProduct(productId)
                    ];
                    if (product.stockId && product.stockId !== null) {
                        var stockId = product.stockId;
                        var newMethod = Stock.deleteStock(stockId);
                        promises.push(newMethod)
                    }
                    Q.all(promises)
                        .then(function(result) {
                            res.status(200).json({
                                "success": true,
                                "message": "Product and stock deleted",
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
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        })
    
        .put('/products/:product_id', function(req,res,next) {
            var newProduct = req.body.product;
            var productId = req.params.product_id;
            Product.modifyProduct(productId, newProduct)
                .then(function(product) {
                    if (product.stockId && product.stockId !== null) {
                        Stock.modifyStock(product.stockId, newProduct)
                            .then(function(stock) {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Product and stock modified",
                                    "product": product
                                });
                            })
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Product modified",
                            "product": product
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

        .put('/product/reso/:product_id', function(req,res,next) {
            var productId = req.params.product_id;
            var reso = req.body.reso;
            var article = req.body.article;
            var product = req.body.product;
            Stock.findById(product.stockId).then(function(result) {
                Article.setReso(article._id,reso).then(function(resultArt) {
                    Product.setReso(productId,reso).then(function(resultProduct) {
                        Stock.createReso(product,reso).then(function(stockReso) {
                            Product.createReso(product,reso).then(function(productReso) {
                                Product.addStockToProduct(productReso.id,stockReso.id).then(function(productadd) {
                                    Product.addFatherId(productadd,productId).then(function(last) {
                                        res.status(200).json({
                                            "success": true,
                                            "message": "Reso created",
                                            "product": last
                                        });
                                    });
                                });
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
        });
    
};