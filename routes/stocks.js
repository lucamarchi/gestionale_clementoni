var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');
	var Product = require('./../app/models/product');

	router.route('/stocks')
		.get(function(req,res) {
			Stock.find({}, function(err,stocks) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({data: stocks, status: true});
			});	
		});
			
	router.route('/stocks/:stock_id')
		.get(function(req,res) {
			Stock.findById(req.params.stock_id, function(err,stock) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({data: stock, status: true});
			});
		})

		.delete(function(req,res) {
			Stock.findById(req.params.stock_id, function(err,stock) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (stock!==undefined && stock.fatherId==undefined && stock.fatherId==undefined) {
					Product.update({"stockId": req.params.stock_id},{$unset: {"stockId": ""}}, function(err,product) {
						if (err)
							res.status(500).json({message: err, status: false});
					});
				}
				stock.remove(function(err) {
					if (err)
						res.status(500).json({message: err, status: false});
					else res.json({message: "Stock cancellato correttamente", status: true});
				});
			}); 
		});

	return router;

};