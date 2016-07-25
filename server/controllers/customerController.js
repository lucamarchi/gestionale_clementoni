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
        .get('/customers/update', function(req,res,next) {
           request.findCustomer().then(function(results) {
               var promises = [];
               results.forEach(function(currCustomer) {
                   var newMethod = Customer.saveNewCustomer(currCustomer);
                   promises.push(newMethod);
               });
               Q.all(promises).then(function(customers) {
                   res.status(404).json({
                       "success": true,
                       "message": "Customers updated",
                       "customers": customers
                   });
               })
           }).catch(function(err) {
               res.status(404).json({
                   "success": false,
                   "message": "Customers not updated",
                   "err": err.message
               });
           })
        })
    
        .get('/customers', function(req, res, next) {
            Customer.findAll()
                .then(function(result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Customers not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Customers list",
                            "customers": result
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
    
        .get('/customer/:customer_id', function(req,res,next) {
            var customerId = req.params.customer_id;
            Customer.findById(customerId)
                .then(function(result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Customer not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Customer found",
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

        .get('/customerCod/:cod_cliente', function(req,res,next) {
            var codCliente = req.params.cod_cliente;
            Customer.findByIdentity(codCliente).then(function(result) {
                if (!result) {
                    res.status(404).json({
                        "success": false,
                        "message": "Customer not found"
                    });
                } else {
                    res.status(200).json({
                        "success": true,
                        "message": "Customer found",
                        "customer": result
                    });
                }
            }).catch(function(err) {
                if (err.message === "Customer not found" && err.status === 400) {
                    console.log("PORCODIO");
                }
                res.status(500).json({
                    "success": false,
                    "message": "Internal server error",
                    "error": err.message
                });
            });
        });

};