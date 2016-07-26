/**
 * Created by luca on 23/05/16.
 */

var Stock = require('./../models/stock');
var Product = require('./../models/product');
var Article = require('./../models/article');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/stocks', function(req, res, next) {
            Stock.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Stocks not found",
                            "stocks": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Stocks list",
                            "stocks": result
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

        .get('/stocks/:stock_id', function(req,res,next) {
            Stock.findById(req.params.stock_id)
                .then(function(result) {
                    if (!result) {
                        res.status(200).json({
                            "success": false,
                            "message": "Stock not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Stock found",
                            "stock": result
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

        .delete('/stocks/:stock_id', function(req,res,next) {
            var stockId = req.params.stock_id;
            var promises = [
                Stock.deleteStock(stockId),
                Product.removeStockToProduct(stockId),
                Article.removeStockToArticle(stockId)
            ];
            Q.all(promises)
                .then(function(result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Stock deleted",
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

        .put('/stocks/:stock_id', function(req,res,next) {
            var stock = req.body.stock;
            var stockId = req.params.stock_id;
            Stock.modifyStock(stockId,stock)
                .then(function(stock) {
                    res.status(200).json({
                        "success": true,
                        "message": "Stock modified",
                        "stock": stock
                    });
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err.message
                    });
                });
        });

};