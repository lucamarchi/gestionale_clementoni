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

    apiRoutes.get('/customers/update', function(req,res,next) {
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

       })
    });
};