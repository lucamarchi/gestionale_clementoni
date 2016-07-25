/**
 * Created by luca on 20/05/16.
 */

var Order = require('./../models/order');
var Product = require('./../models/product');
var Stock = require('./../models/stock');
var Expected = require('./../models/expected');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/orders', function(req, res, next) {
            Order.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(200).json({
                            "success": false,
                            "message": "Orders not found",
							"orders": []
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Orders list",
                            "orders": result
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

        .get('/orders/:order_id', function(req,res,next) {
            Order.findById(req.params.order_id)
                .then(function(result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Order not found"
                        });
                    } else {
                        if (result.productsId && result.productsId.length > 0) {
                            var productsId = result.productsId;
                            var promises = [];
                            productsId.forEach(function(currProduct) {
                               var newMethod = Product.findById(currProduct);
                                promises.push(newMethod);
                            });
                            Q.all(promises)
                                .then(function(products) {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Order and product list",
                                        "order": result,
                                        "products": products
                                    });
                                })
                                .catch(function(err) {
                                    res.status(500).json({
                                        "success": false,
                                        "message": "Internal server error",
                                        "error": err.message
                                    });
                                });
                        } else {
                            res.status(200).json({
                                "success": true,
                                "message": "Order with zero product",
                                "order": result
                            });
                        }
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

        .post('/orders', function(req,res,next) {
            var order = req.body.order;
            Order.saveNewOrder(order)
                .then(function(result) {
                    if (req.body.products && req.body.products.length > 0) {
                        var products = req.body.products;
                        Q.all(products.map(function(currProduct) {
                            return Stock.saveNewStock(currProduct)
                                .then(function (stock) {
                                    return Product.saveNewProduct(currProduct)
                                        .then(function (prod) {
                                            return Order.addProductToOrder(result.id, prod.id)
                                                .then(function(res) {
                                                    return Product.addStockToProduct(prod.id, stock.id)
                                                })
                                        })
                                })
                        }))
                        .then(function(products) {
                            Product.findNewNumeroCollo()
                                .then(function(number) {
                                    var lastNumberInserted = number;
                                    var promises = [];
                                    products.forEach(function(product) {
                                        var newMethodProduct = Product.updateNumeroCollo(product.id,number);
                                        number++;
                                        promises.push(newMethodProduct);
                                    });
                                    Q.all(promises)
                                        .then(function(products) {
                                            var promises = [];
                                            products.forEach(function(product) {
                                                var newMethodStock = Stock.updateNumeroCollo(product.stockId,lastNumberInserted);
                                                lastNumberInserted++;
                                                promises.push(newMethodStock);
                                            });
                                            if (req.body.expected && req.body.expected.length > 0) {
                                                var expected = req.body.expected;
                                                expected.forEach(function(currExpected) {
                                                    var newMethod;
                                                    if (currExpected.pesoNetto <= 0) {
                                                        newMethod = Expected.deleteExpected(currExpected._id);
                                                    } else {
                                                        newMethod = Expected.modifyExpected(currExpected._id, currExpected);
                                                    }
                                                    promises.push(newMethod);
                                                });
                                            }
                                            Q.all(promises)
                                                .then(function(stocks) {
                                                    res.status(200).json({
                                                        "success": true,
                                                        "message": "Order with "+products.length+" products saved",
                                                        "order": result,
                                                        "products": products
                                                    })
                                                });
                                        })
                                })
                        })
                        .catch(function(err) {
                               res.status(500).json({
                                   "success": false,
                                   "message": "Err",
                                   "err": err
                               })
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Order with zero product",
                            "order": result,
                            "products": []
                        })
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Err",
                        "err": err
                    })
                });
        })

        .delete('/orders/:order_id', function(req,res,next) {
            var orderId = req.params.order_id;
            Order.findById(orderId)
                .then(function(order) {
                    var promisesDelete = [
                        Order.deleteOrder(orderId)
                    ];
                    if (order.productsId && order.productsId.length > 0) {
                        var productsId = order.productsId;
                        var promisesFindProds = [];
                        productsId.forEach(function(currProduct) {
                            var newMethod = Product.findById(currProduct);
                            promisesFindProds.push(newMethod);
                        });
                        Q.all(promisesFindProds)
                            .then(function(products) {
                                products.forEach(function(currProduct) {
                                    var newMethodProd = Product.deleteProduct(currProduct);
                                    var newMethodStock = Stock.deleteStock(currProduct.stockId);
                                    promisesDelete.push(newMethodProd,newMethodStock);
                                });
                                Q.all(promisesDelete)
                                    .then(function(result) {
                                        res.status(200).json({
                                            "success": true,
                                            "message": "Order, Product and Stocks deleted",
                                        })
                                    })
                                    .catch(function(err) {
                                        res.status(500).json({
                                            "success": false,
                                            "message": "Internal Error",
                                            "err": err.message
                                        })
                                    });
                            })
                            .catch(function(err) {
                                res.status(500).json({
                                    "success": false,
                                    "message": "Internal Error",
                                    "err": err.message
                                })
                            });
                    } else {
                        Order.deleteOrder(orderId)
                            .then(function(result) {
                                res.status(200).json({
                                    "success": true,
                                    "message": "Order with zero products deleted",
                                })
                            });
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal Error",
                        "err": err.message
                    })
                });
        })

        .put('/orders/:order_id', function(req,res,next) {
            var order = req.body.order;
            var orderId = req.params.order_id;
            Order.modifyOrder(orderId,order)
                .then(function(order) {
                    if (req.body.products && req.body.products.length > 0) {
                        var products = req.body.products;
                        Q.all(products.map(function(currProduct) {
                            return Stock.saveNewStock(currProduct)
                                .then(function (stock) {
                                    return Product.saveNewProduct(currProduct)
                                        .then(function (prod) {
                                            return Order.addProductToOrder(order.id, prod.id)
                                                .then(function(res) {
                                                    return Product.addStockToProduct(prod.id, stock.id)
                                                })
                                        })
                                })
                        })).then(function(products) {
                                Product.findNewNumeroCollo()
                                    .then(function(number) {
                                        var lastNumberInserted = number;
                                        var promises = [];
                                        products.forEach(function(product) {
                                            var newMethodProduct = Product.updateNumeroCollo(product.id,number);
                                            number++;
                                            promises.push(newMethodProduct);
                                        });
                                        Q.all(promises)
                                            .then(function(products) {
                                                var promises = [];
                                                products.forEach(function(product) {
                                                    var newMethodStock = Stock.updateNumeroCollo(product.stockId,lastNumberInserted);
                                                    lastNumberInserted++;
                                                    promises.push(newMethodStock);
                                                });
                                                if (req.body.expected && req.body.expected.length > 0) {
                                                    var expected = req.body.expected;
                                                    expected.forEach(function(currExpected) {
                                                        var newMethod;
                                                        if (currExpected.pesoNetto <= 0) {
                                                            newMethod = Expected.deleteExpected(currExpected._id);
                                                        } else {
                                                            newMethod = Expected.modifyExpected(currExpected._id, currExpected);
                                                        }
                                                        promises.push(newMethod);
                                                    });
                                                }
                                                Q.all(promises)
                                                    .then(function(stocks) {
                                                        res.status(200).json({
                                                            "success": true,
                                                            "message": "Order with zero product",
                                                            "order": order,
                                                            "products": products
                                                        })
                                                    });
                                            })
                                    })
                            })
                            .catch(function(err) {
                                res.status(500).json({
                                    "success": false,
                                    "message": "Err",
                                    "err": err.message
                                })
                            });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Order with zero product modified",
                            "order": order
                        })
                    }
                })
                .catch(function(err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Err",
                        "err": err.message
                    });
                })
        });
};