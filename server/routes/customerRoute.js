/**
 * Created by luca on 24/05/16.
 */

var Cut = require('./../models/cut');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var request = require('./../controllers/requestController');
var configs = require('./../configs/url');
var Q = require('q');

module.exports = function(app, apiRoutes) {

    apiRoutes
        .get('/customers/update', function(req,res,next) {
            var data = {};
           request.findCustomer().then(function(results) {
               var promises = [];
               results.forEach(function(currCustomer) {
                   var newMethod = Customer.saveNewCustomer(currCustomer);
                   promises.push(newMethod);
               });
               Q.all(promises).then(function(customers) {
                   data.customers = customers;
                   res.status(404).json({
                       "success": true,
                       "message": "Customers updated",
                       "data": data
                   });
               });
           }).catch(function(err) {
               res.status(404).json({
                   "success": false,
                   "message": "Customers not updated",
                   "err": err.message
               });
           })
        })
    
        .get('/customers', function(req, res, next) {
            var data = {};
            Customer.findAll().then(function(result) {
                data.customers = result;
                res.status(200).json({
                    "success": true,
                    "message": "Customers list",
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
    
        .get('/customer/:customer_id', function(req,res,next) {
            var customerId = req.params.customer_id;
            var data = {};
            Customer.findById(customerId).then(function(result) {
                data.customer = result;
                res.status(200).json({
                    "success": true,
                    "message": "Customer found",
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

        .get('/customerCod/:cod_cliente', function(req,res,next) {
            var codCliente = req.params.cod_cliente;
            var data = {};
            Customer.findByIdentity(codCliente).then(function(result) {
                data.customer = result;
                res.status(200).json({
                    "success": true,
                    "message": "Customer found",
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