/**
 * Created by luca on 03/06/16.
 */

var Process = require('./../models/process');
var Product = require('./../models/product');
var Stock = require('./../models/stock');
var Article = require('./../models/article');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/processes', function(req,res,next) {
            Process.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Processes not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Processes list",
                            "processes": result
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

        .get('/processes/:process_id', function(req,res,next) {
            var processId = req.params.process_id;
            Process.findById(processId)
                .then(function(result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Process not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Process found",
                            "customer": result
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

        .get('/processes/figli/:process_id', function(req,res,next) {
            var processId = req.params.process_id;
            Process.findById(processId).then(function(process) {
                if (process.figli && process.figli.length > 0) {
                    var figli = process.figli;
                    var promises = [];
                    figli.forEach(function(currFigli) {
                        var newMethod = Product.findById(currFigli);
                        promises.push(newMethod);
                    });
                    Q.all(promises).then(function(results) {
                        res.status(200).json({
                            "success": true,
                            "message": "Process found",
                            "process": process,
                            "figli": results
                        });
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Process woth zero figli found",
                        "process": process
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "err": err.message
                });
            })
        })

        .get('/processes/article/:article_id', function(req,res,next) {
            var articleId = req.params.article_id;
            Process.findByArticle(articleId).then(function (results) {
                res.status(200).json({
                    "success": true,
                    "message": "Process with article found",
                    "process": results
                });
            }).catch(function (err) {
                if (err.message === "Process with article not found" && err.status === 400) {
                    res.status(200).json({
                        "success": true,
                        "message": "Process with article not found",
                        "process": []
                    });
                } else {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "err": err.message
                    });
                }
            });
        })

        .post('/processes', function(req,res,next) {
            var stockOriginal = req.body.stock;
            var process = req.body.process;
            var figli = req.body.figli;
            var newNumeroCollo;
            var numFigli = [];
            for (var i = 0; i<figli.length; i++) {
                numFigli.push(i+1);
            }
            var promises = [
                Stock.modifyStock(stockOriginal._id,stockOriginal),
            ];
            if (req.body.article) {
                var article = req.body.article;
                promises.push(Article.setArticleStatus(article._id,"lavorazione"));
                promises.push(Article.unsetStockToArticle(article._id));
                promises.push(Article.increaseScarto(article._id,process.scarto));
            }
            Process.saveNewProcess(process).then(function(result) {
                Product.findByStock(stockOriginal._id).then(function(prodAss) {
                    if (stockOriginal.numeroCollo.indexOf("/") !== -1) {
                        newNumeroCollo = prodAss.numeroCollo + prodAss.lavorazione + process.macchina;
                        Product.findById(prodAss.fatherId).then(function(fatherProd) {
                            promises.push(Process.setProductToProcess(result.id,fatherProd._id));
                            if (article && article != null) {
                                promises.push(Process.setArticleToProcess(result.id, article._id));
                            }
                            promises.push(Product.increaseLavorazione(fatherProd._id));
                            promises.push(Product.increaseScarto(fatherProd._id,process.scarto));
                            Q.all(figli.map(function(currProduct) {
                                return Stock.saveNewStock(currProduct)
                                    .then(function (stock) {
                                        return Product.saveNewProduct(currProduct)
                                            .then(function (prod) {
                                                return Process.setFiglioToProcess(result.id,prod._id)
                                                    .then(function(produ) {
                                                        return Product.setFatherId(prod._id,fatherProd._id)
                                                            .then(function(pros) {
                                                                return Product.addStockToProduct(prod.id, stock.id)
                                                            })
                                                    })
                                            })
                                    })
                            })).then(function(products) {
                                products.forEach(function(currProduct) {
                                    var number = newNumeroCollo + numFigli.pop() + '/';
                                    var newMethodProduct = Product.updateNumeroCollo(currProduct.id,number);
                                    var newMethodStock = Stock.updateNumeroCollo(currProduct.stockId,number);
                                    promises.push(newMethodProduct);
                                    promises.push(newMethodStock);
                                });
                            })
                        });
                    } else {
                        newNumeroCollo = prodAss.numeroCollo + '/' + prodAss.lavorazione + process.macchina;
                        promises.push(Process.setProductToProcess(result.id,prodAss._id));
                        if (article && article != null) {
                            promises.push(Process.setArticleToProcess(result.id, article._id));
                        }
                        promises.push(Product.increaseLavorazione(prodAss._id));
                        promises.push(Product.increaseScarto(prodAss._id,process.scarto));
                        Q.all(figli.map(function(currProduct) {
                            return Stock.saveNewStock(currProduct)
                                .then(function (stock) {
                                    return Product.saveNewProduct(currProduct)
                                        .then(function (prod) {
                                            return Process.setFiglioToProcess(result.id,prod._id)
                                                .then(function(produ) {
                                                    return Product.setFatherId(prod._id,prodAss._id)
                                                        .then(function(produs) {
                                                            return Product.addStockToProduct(prod.id, stock.id)
                                                        })
                                                })
                                        })
                                })
                        })).then(function(products) {
                            products.forEach(function(currProduct) {
                                var number = newNumeroCollo + numFigli.pop() + '/';
                                var newMethodProduct = Product.updateNumeroCollo(currProduct.id,number);
                                var newMethodStock = Stock.updateNumeroCollo(currProduct.stockId,number);
                                promises.push(newMethodProduct);
                                promises.push(newMethodStock);
                            });
                        })
                    }
                    Q.all(promises).then(function(finalResult) {
                        res.status(200).json({
                            "message": "Process done",
                            "process": result,
                            "status": true
                        });
                    })
                });
            }).catch(function(err) {
                res.status(500).json({
                    "message": "Internal problem",
                    "status": false,
                    "err": err.message
                });
            });

        })

        .get('/prova/processes', function(req,res,next) {
            console.log("OK");
        });


};