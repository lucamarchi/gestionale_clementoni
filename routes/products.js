var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Product = require('./../app/models/product');
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');
		
	router.route('/products')
		.get(function(req,res) {
			Product.find({}, function(err,products) {
				if (err)
					res.status(500).json({message: err, status: false});
				res.json({data: products, status: true});
			});	
		});

	router.route('/products/:product_id')
		.delete(function(req,res) {
			Product.findById(req.params.product_id, function(err,product) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					Stock.remove({_id: product.stockId}, function(err) {
						if (err)
							res.status(500).json({message: err, status: false});
					});
					Stock.remove({fatherId: req.params.product_id}, function(err) {
						if (err)
							res.status(500).json({message: err, status: false});
					});
					Order.update({productsId: req.params.product_id},{$pull: {productsId: req.params.product_id}}, 
						function(err) {
							if (err)
								res.status(500).json({message: err, status: false});
						});
					product.remove(function(err) {
						if (err)
							res.status(500).json({message: err, status: false});
						else res.json({message: "Product e stock cancellati", status: true});
					});
				}
			});
		})
		.get(function(req,res) {
			Product.findById(req.params.product_id, function(err,product) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({data: product, status: true});
			});
		});

		
	return router;

};