var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Product = require('./../app/models/product');
	var Order = require('./../app/models/order');
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
				console.log(JSON.stringify(product,null,4) +'\n');
				product.save(function(err) {
				if (err){
					console.log("Errore post product: " + err);
					return res.send(err);
				} else {
					Order.findById(req.params.order_id, function(err,order) {
					if (err) {
						console.log('Ordine non trovato \n');
						return res.send.err;
					} else {
						order.productIds.push(product);
						order.save(function(err) {
							if (err) {
								console.log(JSON.stringify(order,null,4) +'\n');
								return res.send(err);}
							});						
						}
					});
					res.json({message: product.id, status: true});
					console.log('Prodotto inserito \n');
				}

				});		
			} else res.status(500).json({message: 'Dato non valido,post', status: false});
		});

	// VISUALIZZAZIONE PRODOTTI GET /api/products

	router.route('/products')
		.get(function(req,res) {
			Product.find({}, function(err,products) {
				if (err)
					res.send(err);
				res.json(products);
			});	
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
		
		.put(function(req,res) {
			Product.findById(req.params.product_id, function(err,product) {
				if (err)
					res.send(err)
				if (req.body.matricola)
					product.matricola = req.body.matricola;
				if (req.body.materiale)
					product.materiale = req.body.materiale;
				if (req.body.cop)
					product.cop = req.body.cop;
				if (req.body.lunghezza)
					product.lunghezza = req.body.lunghezza;
				if (req.body.larghezza)
					product.larghezza = req.body.larghezza;
				if (req.body.spessore)
					product.spessore = req.body.spessore;
				if (req.body.prezzo)
					product.prezzo = req.body.prezzo;
				if (req.body.pesokg)
					product.pesokg = req.body.pesokg;
				if (req.body.pesoton)
					product.pesoton = req.body.pesoton;
				if (req.body.qualita)
					product.qualita = req.body.qualita;
				if (req.body.colore)
					product.colore = req.body.colore;
				if (req.body.ral)
					product.ral = req.body.ral;
				if (req.body.note)
					product.note = req.body.note;
				if (req.body.finitura)
					product.finitura = req.body.finitura;
				product.save(function(err) {
					if (err) {
						console.log('Errore, dati non validi');
						res.send(err);
					} else {
						res.json({message: 'Prodotto modificato', status: true});
						console.log(JSON.stringify(product,null,4) +'\n');
					}
				});
			});
		})
		
		.delete(function(req,res) {
			Product.remove({
				_id: req.params.product_id
			}, function(err,product) {
				if (err) {
					console.log('Errore');
					res.send(err);
				} else {
					res.json({message: 'Prodotto cancellato', status: true});
					console.log(JSON.stringify(product,null,4) +'\n');
				}
			});
		});

	return router;

};