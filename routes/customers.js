var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Customer = require('./../app/models/customer');
		
	router.route('/customers')
		.get(function(req,res) {
			Customer.find({}, function(err,customers) {
				if (err)
					res.status(500).json({message: err, status: false});
				res.json({data: customers, status: true});
			});	
		});

	router.route('/customers/:customer_id')
		.get(function(req,res) {
			Customer.find({_id: req.params.customer_id}, function(err,customer) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({data: customer, status: true});
			});
		});
		
	return router;

};