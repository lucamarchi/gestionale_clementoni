/**
 * Created by luca on 20/05/16.
 */

var Q = require('q');
var Order = require('./../models/order');
var orderController = require('./../controllers/orderController');
var productController = require('./../controllers/productController');
var expectedController = require('./../controllers/expectedController');
var utils = require('./../controllers/utilsController');


module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/orders', function(req, res, next) {
            var data = {};
            Order.findAll().then(function(result) {
                data.orders = result;
                res.status(200).json({
                    "success": true,
                    "message": "Orders list",
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

        .get('/order/:order_id', function(req,res,next) {
            var data = {};
            Order.findById(req.params.order_id).then(function(result) {
                data.order = result;
                productController.retrieveProducts(result.productsId).then(function(products) {
                    data.products = products;
                    res.status(200).json({
                        "success": true,
                        "message": "Order and product list",
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

        .post('/order', function(req,res,next) {
            var data = {};
            var order = req.body.order;
            Order.saveNewOrder(order).then(function(result) {
                data.order = result;
                var products = req.body.products;
                var expecteds = req.body.expecteds;
                var promises = [
                    orderController.createProductsToOrder(result.id,products),
                    expectedController.modifyOrDeleteExpected(expecteds)
                ];
                Q.all(promises).then(function() {
                    res.status(200).json({
                        "success": true, "message": "Order with " + products.length + " product created",
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

        .delete('/orders/:order_id', function(req,res,next) {
            var orderId = req.params.order_id;
            Order.findById(orderId).then(function(order) {
                var products = order.productsId;
                var promises = [
                    Order.deleteOrder(orderId),
                    productController.deleteProducts(products)
                ];
                Q.all(promises).then(function() {
                    res.status(200).json({
                        "success": true,
                        "message": "Order and " + products.length + " products deleted"
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            });
        })

        .put('/order/:order_id', function(req,res,next) {
            var data = {};
            var orderId = req.params.order_id;
            var order = req.body.order;
            var productsToRemove = req.body.productsToRemove;
            var productsToAdd = req.body.productsToAdd;
            var productsToModify = req.body.productsToModify;
            var expecteds = req.body.expecteds;
            Order.modifyOrder(orderId,order).then(function(result) {
                data.order = result;
                var promises1 = orderController.createProductsToOrder(result.id,productsToAdd);
                Q.all(promises1).then(function(firstProducts) {
                    var promises2 = productController.modifyProducts(productsToModify);
                    Q.all(promises2).then(function(secondProducts) {
                        data.products = utils.mergeElemArray(firstProducts,secondProducts);
                        var promises3 = [
                            expectedController.modifyOrDeleteExpected(expecteds),
                            productController.deleteProductsFromOrder(productsToRemove)
                        ];
                        Q.all(promises3).then(function() {
                            res.status(200).json({
                                "success": true,
                                "message": "Modified order",
                                "data": data
                            });
                        });
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            });
        })
};
