var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Product = require('./../app/models/product');
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');
	var controlPrd = require('./../app/control/checkvalprd');
	var controlOrd = require('./../app/control/checkvalord');

	router.route('/products/:order_id')
		.post(function(req,res) {
			var check = controlPrd.check(req);
			console.log('Check status product %s',check + '\n');
			if (check && req.params.order_id!=null) {
				var product = new Product();
				product.matricola = req.body.matricola;
				product.materiale = req.body.materiale;
				product.cop = req.body.cop;
				product.lunghezza = req.body.lunghezza;
				product.larghezza = req.body.larghezza;
				product.spessore = req.body.spessore;
				product.pesokg = req.body.pesokg;
				product.pesoton = req.body.pesoton;
				product.qualita = req.body.qualita;
				product.colore = req.body.colore;
				product.ral = req.body.ral;
				product.note = req.body.note;
				product.finitura = req.body.finitura;
				product.prezzo = req.body.prezzo;
				product.orderId = req.params.order_id;
				var stock = new Stock();
				stock.matricola = req.body.matricola;
				stock.materiale = req.body.materiale;
				stock.cop = req.body.cop;
				stock.lunghezza = req.body.lunghezza;
				stock.larghezza = req.body.larghezza;
				stock.spessore = req.body.spessore;
				stock.pesokg = req.body.pesokg;
				stock.pesoton = req.body.pesoton;
				stock.qualita = req.body.qualita;
				stock.colore = req.body.colore;
				stock.ral = req.body.ral;
				stock.note = req.body.note;
				stock.finitura = req.body.finitura;
				stock.prezzo = req.body.prezzo;
				stock.orderId = req.params.order_id;
				console.log(JSON.stringify(product,null,4) +'\n');
				product.save(function(err) {
				if (err){
					console.log("Errore post product: " + err);
					return res.json({status: false, message: 'Prodotto non salvato'});
				} else {
					stock.save(function(err) {
						if (err) {
							console.log("Errore post stock: " + err);
							return res.json({status: false, message: 'Stock non salvato'});
						} else {
							Order.findById(req.params.order_id, function(err,order) {
								if (err) {
									console.log('Ordine non trovato \n');
									return res.send.err;
								} else {
									order.productIds.push(product);
									order.stockIds.push(stock);
									order.save(function(err) {
										if (err) {
											console.log(JSON.stringify(order,null,4) +'\n');
											return res.send(err);
										}
									});						
								}
								Product.findById(product.id, function(err,product) {
									if (err) {
										console.log('Prodotto non trovato \n');
										return res.send.err;
									} else {
										product.stockId = stock.id;
										product.save(function(err) {
										if (err) {
											console.log(JSON.stringify(order,null,4) +'\n');
											return res.send(err);
										}
									});						
								}
								});
							});	
						}
					});
					res.json({message: product.id, status: true});
					console.log('Prodotto e stock inserito \n');
				}

				});		
			} else res.status(500).json({message: 'Dato non valido,post', status: false});
		});

	// MODIFICA DI UN PRODOTTO PUT /api/products/:product_id, RIMOZIONE DI UN PRODOTTO DELETE /api/products/:product_id E VISUALIZZAZIONE PRODOTTO GET /api/products/:product_id
			
	router.route('/products/:product_id')
		.get(function(req,res) {
			Product.findById(req.params.product_id, function(err,product) {
				if (err)
					res.send(err);
				else {
					console.log(JSON.stringify(product,null,4) +'\n');
					res.json(product)}
			});
		})
		
	return router;

};