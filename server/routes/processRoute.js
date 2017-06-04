/**
 * Created by luca on 03/06/16.
 */

var Process = require('./../models/process');
var Product = require('./../models/product');
var Article = require('./../models/article');
var productController = require('./../controllers/productController');
var utils = require('./../controllers/utilsController');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/processes', function(req,res,next) {
            var data = {};
            Process.findAll().then(function(result) {
                data.processes = result;
                    res.status(200).json({
                        "success": true,
                        "message": "Processes list",
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

        .get('/processes/:process_id', function(req,res,next) {
            var processId = req.params.process_id;
            var data = {};
            Process.findById(processId).then(function(result) {
                data.process = result;
                res.status(200).json({
                    "success": true,
                    "message": "Process found",
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

        .get('/processes/figli/:process_id', function(req,res,next) {
            var processId = req.params.process_id;
            var data = {};
            Process.findById(processId).then(function(process) {
                data.process = process;
                var figli = process.figli;
                Product.findById(figli).then(function(result) {
                    data.figli = result;
                    res.status(200).json({
                        "success": true,
                        "message": "Process found",
                        "data": data
                    });
                });
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
            var data = {};
            Process.findByArticle(articleId).then(function (results) {
                data.processes = results;
                res.status(200).json({
                    "success": true,
                    "message": "Process with article found",
                    "data": data
                });
            }).catch(function (err) {
                if (err.message === "Process with article not found" && err.status === 400) {
                    res.status(200).json({
                        "success": true,
                        "message": "Process with article not found",
                        "processes": []
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

        .post('/processes', function (req, res, next) {
            var processes = req.body.processes;
            var promises = [];
            var data = {};
            var processesCreated = [];
            var count = 0;
            processes.forEach(function (currProcess) {
                count++;
                var products = currProcess.stocks;
                products.forEach(function (currProduct) {
                    promises.push(Product.modifyProduct(currProduct._id, currProduct));
                    promises.push(Product.increaseLavorazione(currProduct._id));
                });
                var scartoMap = currProcess.scarto;
                var scarto = 0;
                for (var key in scartoMap) {
                    scarto += scartoMap[key];
                }
                currProcess["scarto"] = scarto;
                if (currProcess.hasOwnProperty("article") && currProcess.article) {
                    var article = currProcess.article;
                    var clienteCod = article.clienteCod;
                    promises.push(Article.setArticleStatusProd(article._id, "lavorazione"));
                    promises.push(Article.unsetProductToArticle(article._id));
                    promises.push(Article.increaseScarto(article._id, scarto));
                }
                Process.saveNewProcess(currProcess).then(function (result) {
                    processesCreated.push(result);
                    var singleFatherProd = [];
                    var multiFatherProd = [];
                    var numeroCollo = "";
                    products.forEach(function (currProduct) {
                        if (currProduct.numeroCollo.indexOf("/") !== -1) {
                            multiFatherProd.push(currProduct);
                        } else {
                            singleFatherProd.push(currProduct);
                        }
                        numeroCollo += currProduct.numeroCollo;
                    });
                    this.checkNumber(products).then(function (number) {
                        numeroCollo += "/" + number + currProcess.machinery;
                        var promisesFather = [];
                        if (multiFatherProd.length > 0) {
                            multiFatherProd.forEach(function (currProduct) {
                                currProduct.fatherId.forEach(function (currP) {
                                    var newMethod = Product.findById(currP);
                                    promisesFather.push(newMethod);
                                });
                            });
                        }
                        singleFatherProd.forEach(function (currProduct) {
                            var newMethod = Product.findById(currProduct._id);
                            promisesFather.push(newMethod);
                        });
                        Q.all(promisesFather).then(function (fatherResultTmp) {
                            var fatherResult = utils.deleteDuplicates(fatherResultTmp);
                            var scartoFatherMap = createScartoFatherMap(fatherResult,products,scartoMap);
                            fatherResult.forEach(function (currProduct) {
                                if (scartoFatherMap[currProduct._id])
                                    promises.push(Product.increaseScarto(currProduct._id, scartoFatherMap[currProduct._id]));
                            });
                            products.forEach(function (currProduct) {
                                promises.push(Process.addProductToProcess(result._id, currProduct._id));
                            });
                            var figlio = currProcess.producedProduct;
                            Product.saveNewProduct(figlio).then(function (figlioProduct) {
                                if (clienteCod) {
                                    promises.push(Product.addClienteCodToProduct(figlioProduct._id, clienteCod));
                                }
                                Process.setFiglioToProcess(result.id, figlioProduct.id).then(function (lastProcess) {
                                    fatherResult.forEach(function (currFather) {
                                        var newMethod = Product.addFatherId(figlioProduct.id, currFather._id);
                                        promises.push(newMethod);
                                    });
                                    promises.push(Product.updateNumeroCollo(figlioProduct.id, numeroCollo));
                                    if (count == processes.length) {
                                        data.process = processesCreated;
                                        Q.all(promises).then(function () {
                                            res.status(200).json({
                                                "message": "Process done",
                                                "data": data,
                                                "status": true
                                            });
                                        }).catch(function (err) {
                                            res.status(500).json({
                                                "message": "Internal problem",
                                                "status": false,
                                                "err": err.message
                                            });
                                        })
                                    }
                                });
                            });
                        });
                    });
                }).catch(function(err) {
                    res.status(500).json({
                        "message": "Internal problem",
                        "status": false,
                        "err": err.message
                    });
                });
            });
        })

        /*.post('/processes', function(req,res,next) {
            var productOriginal = req.body.products;
            var process = req.body.process;
            var scarto = process.scarto;
            var createFiglio = req.body.figlio;
            var promises = [];
            var data = {};
            productOriginal.forEach(function(currProduct) {
                promises.push(Product.modifyProduct(currProduct._id,currProduct));
                promises.push(Product.increaseLavorazione(currProduct._id));
            });
            if (req.body.article) {
                var article = req.body.article;
                var clienteCod = article.clienteCod;
                promises.push(Article.setArticleStatusProd(article._id,"lavorazione"));
                promises.push(Article.unsetProductToArticle(article._id));
                promises.push(Article.increaseScarto(article._id,process.scarto));
            }
            Process.saveNewProcess(process).then(function(result) {
                data.process = result;
                var singleFatherProd = [];
                var multiFatherProd = [];
                var numeroCollo = "";
                productOriginal.forEach(function(currProduct) {
                    if (currProduct.numeroCollo.indexOf("/") !== -1) {
                        multiFatherProd.push(currProduct);
                    } else {
                        singleFatherProd.push(currProduct);
                    }
                    numeroCollo += currProduct.numeroCollo;
                });
                this.checkNumber(productOriginal).then(function(number) {
                    numeroCollo +=  "/" + number + process.macchina;
                    var promisesFather = [];
                    if (multiFatherProd.length > 0) {
                        multiFatherProd.forEach(function(currProduct) {
                            currProduct.fatherId.forEach(function(currP) {
                                var newMethod = Product.findById(currP);
                                promisesFather.push(newMethod);
                            });
                        });
                    }
                    singleFatherProd.forEach(function(currProduct) {
                        var newMethod = Product.findById(currProduct._id);
                        promisesFather.push(newMethod);
                    });
                    Q.all(promisesFather).then(function(fatherResultTmp) {
                        var fatherResult = utils.deleteDuplicates(fatherResultTmp);
                        fatherResult.forEach(function(currProduct) {
                            promises.push(Product.increaseScarto(currProduct._id,scarto));
                        });
                        productOriginal.forEach(function(currProduct) {
                            promises.push(Process.addProductToProcess(result._id,currProduct._id));
                        });
                        Product.saveNewProduct(createFiglio).then(function(figlioProduct) {
                            if (clienteCod) {
                                promises.push(Product.addClienteCodToProduct(figlioProduct._id,clienteCod));
                            }
                            Process.setFiglioToProcess(result.id,figlioProduct.id).then(function(lastProcess) {
                                fatherResult.forEach(function(currFather) {
                                    var newMethod = Product.addFatherId(figlioProduct.id, currFather._id);
                                    promises.push(newMethod);
                                });
                                promises.push(Product.updateNumeroCollo(figlioProduct.id,numeroCollo));
                                Q.all(promises).then(function(promises) {
                                    res.status(200).json({
                                        "message": "Process done",
                                        "data": data,
                                        "status": true
                                    });
                                });
                            });
                        });
                    });
                });
            }).catch(function(err) {
                res.status(500).json({
                    "message": "Internal problem",
                    "status": false,
                    "err": err.message
                });
            });
        })*/;

    createScartoFatherMap = function(father,products,scartoMap) {
        var scartoFatherMap = {};
        var check = true;
        for (var key in scartoMap) {
            check = true;
            for (var i=0; i<products.length && check; i++) {
                if (products[i]._id == key) {
                    for (var j=0; j<father.length && check; j++) {
                        if (products[i].fatherId.length > 0) {
                            for (var k=0; k<products[i].fatherId.length && check; j++) {
                                if (products[i].fatherId[k] == father[j]._id) {
                                    scartoFatherMap[father[j]._id] = scartoMap[key];
                                    check = false;
                                }
                            }
                        } else {
                            scartoFatherMap[key] = scartoMap[key];
                            check = false;
                        }
                    }
                }
            }
        }
        return scartoFatherMap;
    }

    checkNumber = function(products) {
        var promises = [];
        var deferred = Q.defer();
        products.forEach(function(currProduct) {
            var newMethod = Process.findByProduct(currProduct._id);
            promises.push(newMethod);
        });
        Q.all(promises).then(function(result) {
            var count = 0;
            result.forEach(function(currProcess) {
                currProcess.forEach(function(currP) {
                    var check = true;
                    var tmpCount = 0;
                    if (check) {
                        products.forEach(function (currProduct) {
                            if (currP.product.indexOf(currProduct._id) == -1) {
                                check = false;
                            } else {
                                tmpCount++;
                            }
                        });
                    }
                    if (tmpCount == products.length) {
                        count++;
                    }
                });
            });
            deferred.resolve(count);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

};