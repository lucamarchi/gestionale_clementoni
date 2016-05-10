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

		.put(function(req,res) {
			Stock.findById(req.body.product.stockId, function(err,stock) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					stock.tipo = req.body.product.tipo;
					stock.materiale = req.body.product.materiale;
					stock.qualita = req.body.product.qualita;
					stock.scelta = req.body.product.scelta;
					stock.finitura = req.body.product.finitura;
					stock.coloreRal = req.body.product.coloreRal;
					stock.pesoLordo = req.body.product.pesoLordo;	
					stock.pesoNetto = req.body.product.pesoNetto;
					stock.spessore = req.body.product.spessore;
					stock.larghezza = req.body.product.larghezza;
					stock.classeLarghezza = req.body.product.classeLarghezza;
					stock.lunghezza = req.body.product.lunghezza;
					stock.numFogli = req.body.product.numFogli;
					stock.prezzo = req.body.product.prezzo;
					stock.difetti = req.body.product.difetti;
					stock.stabilimento = req.body.product.stabilimento;
					stock.superficie = req.body.product.superficie;
					stock.save(function(err) {
						if (err) {
							res.status(500).json({message: err, status: false});
						} else {
							Product.findById(req.params.product_id, function(err,product) {
								if (err)
									res.status(500).json({message: err, status: false});
								else {
									product.tipo = req.body.product.tipo;
									product.materiale = req.body.product.materiale;
									product.qualita = req.body.product.qualita;
									product.scelta = req.body.product.scelta;
									product.finitura = req.body.product.finitura;
									product.coloreRal = req.body.product.coloreRal;
									product.pesoLordo = req.body.product.pesoLordo;	
									product.pesoNetto = req.body.product.pesoNetto;
									product.spessore = req.body.product.spessore;
									product.larghezza = req.body.product.larghezza;
									product.classeLarghezza = req.body.product.classeLarghezza;
									product.lunghezza = req.body.product.lunghezza;
									product.numFogli = req.body.product.numFogli;
									product.prezzo = req.body.product.prezzo;
									product.difetti = req.body.product.difetti;
									product.stato = req.body.product.stato;
									product.stabilimento = req.body.product.stabilimento;
									product.superficie = req.body.product.superficie;
									product.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false});
										else {
											res.json({message: "Product e Stock modificati", status: true});
										}
									});
								}
							});
						}
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