var express = require('express');

module.exports = function() {
	var router = express.Router();
	var Product = require('./../app/models/product');
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');

	// AGGIUNTA DI UN ORDINE POST /api/orders ED VISUALIZZAZIONE ORDINI GET /api/orders

	router.route('/orders')
		.post(function(req,res) {
			if (!req.body.products || !req.body.order || req.body.products==undefined || req.body.order==undefined) {
				res.status(500).json({message: 'Dati mancanti', status: false});
			} else {
				var products = req.body.products;
				var orderReq = req.body.order;
				var itemProducts = 0;
				var order = new Order();
				order.numOrdine = orderReq.numOrdine;
				order.ddt = orderReq.ddt;
				order.fornitore = orderReq.fornitore;
				order.dataDdt = orderReq.dataDdt;
				console.log("ORDER: numOrdine:"+orderReq.numOrdine+"\n ddt: "+orderReq.ddt+"\n fornitore: "+orderReq.fornitore+"\n");			
				order.save(function(err) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						console.log('Ordine salvato; con id '+order.id);
						orderId = order.id;
						products.forEach(function(p) {
							console.log('ITERAZIONE PRODOTTO CON MATRICOLA '+p.matricola);
							itemProducts++;
							console.log('Item for each: '+itemProducts);
							var stock = new Stock();
							stock.matricola = p.matricola;
							stock.tipo = p.tipo;
							stock.materiale = p.materiale;
							stock.qualita = p.qualita;
							stock.scelta = p.scelta;
							stock.finitura = p.finitura;
							stock.coloreRal = p.coloreRal;
							stock.peso = p.peso;
							stock.spessore = p.spessore;
							stock.larghezza = p.larghezza;
							stock.classeLarghezza = p.classeLarghezza;
							stock.lunghezza = p.lunghezza;
							stock.numFogli = p.numFogli;
							stock.prezzo = p.prezzo;
							stock.difetti = p.difetti;
							stock.stabilimento = p.stabilimento;
							console.log("STOCK: matricola:"+p.matricola+"\n tipo: "+p.tipo+"\n materiale: "+p.materiale+"\n scelta: "+p.scelta+" \n peso: "+p.peso+"\n stabilimento: "+p.stabilimento+"\n");
							stock.save(function(err) {
								if (err)
									res.status(500).json({message: err, status: false});
								else {
									console.log('STOCK SALVATO CON ID: '+stock.id);
									var stockId = stock.id;
									var product = new Product();
									product.matricola = p.matricola;
									product.tipo = p.tipo;
									product.materiale = p.materiale;
									product.qualita = p.qualita;
									product.scelta = p.scelta;
									product.finitura = p.finitura;
									product.coloreRal = p.coloreRal;
									product.peso = p.peso;
									product.spessore = p.spessore;
									product.larghezza = p.larghezza;
									product.classeLarghezza = p.classeLarghezza;
									product.lunghezza = p.lunghezza;
									product.numFogli = p.numFogli;
									product.prezzo = p.prezzo;
									product.difetti = p.difetti;
									product.stabilimento = p.stabilimento;
									product.stockId = stockId;
									console.log("PRODUCT: matricola:"+p.matricola+"\n tipo: "+p.tipo+"\n materiale: "+p.materiale+"\n scelta: "+p.scelta+" \n peso: "+p.peso+"\n stabilimento: "+p.stabilimento+"\n");
									product.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false});
										else {
											order.update({$push: {"productsId": product.id}}, function(err){
												if (err)
													res.status(500).json({message: err, status: false});
											});
										}
									});
								}
							});
						});
						if (itemProducts == products.length){
							console.log('CONDIZIONE'+itemProducts==products.length);
							res.json({message: 'Order, products e stocks', status: true});
						}
					}
				});
			}
		})

		.get(function(req,res) {
			Order.find({}, function(err,orders) {
				if (err)
					res.status(500).json({message: err, status: false});
				res.json({data: orders, status: true});
			});	
		});

// MODIFICA DI UN ORDINE PUT /api/ordine/:ordine_id, RIMOZIONE DI UN ORDINE DELETE /api/orders/:order_id E VISUALIZZAZIONE ORDINE GET /api/orders/:order_id

	router.route('/orders/:order_id')
		.get(function(req,res) {
			Order.findById(req.params.order_id, function(err,order) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (order.productsId && order.productsId.length!=0) {
					Product.find({_id: {$in: order.productsId}}, function(err, products) {
						if (err)
							res.status(500).json({message: err, status: false});
						else {
							res.json({order: order, products: products, status: true});
						}
					});
				} else res.json({order: order, products: [], status: true});
			});
		})
		.put(function(req,res) {
			/* prima update ordine, 
			nel success se ci sono prodotti, salvo i prodotti e faccio il push*/
			Order.update({_id: req.params.order_id},{$set: req.body.order}, function(err,order) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (req.body.products && req.body.products.length>0) {
					console.log("Order con "+req.body.products.length+"prodotti\n");
					var orderId = order.id;
					var products = req.body.products;
					var itemProducts = 0;
					products.forEach(function(p) {
						itemProducts++;
						var stock = new Stock();
						stock.matricola = p.matricola;
						stock.tipo = p.tipo;
						stock.materiale = p.materiale;
						stock.qualita = p.qualita;
						stock.scelta = p.scelta;
						stock.finitura = p.finitura;
						stock.coloreRal = p.coloreRal;
						stock.peso = p.peso;
						stock.spessore = p.spessore;
						stock.larghezza = p.larghezza;
						stock.classeLarghezza = p.classeLarghezza;
						stock.lunghezza = p.lunghezza;
						stock.numFogli = p.numFogli;
						stock.prezzo = p.prezzo;
						stock.difetti = p.difetti;
						stock.stabilimento = p.stabilimento;
						stock.save(function(err) {
							if (err)
								res.status(500).json({message: err, status: false});
							else {
								var stockId = stock.id;
								var product = new Product();
								product.matricola = p.matricola;
								product.tipo = p.tipo;
								product.materiale = p.materiale;
								product.qualita = p.qualita;
								product.scelta = p.scelta;
								product.finitura = p.finitura;
								product.coloreRal = p.coloreRal;
								product.peso = p.peso;
								product.spessore = p.spessore;
								product.larghezza = p.larghezza;
								product.classeLarghezza = p.classeLarghezza;
								product.lunghezza = p.lunghezza;
								product.numFogli = p.numFogli;
								product.prezzo = p.prezzo;
								product.difetti = p.difetti;
								product.stabilimento = p.stabilimento;
								product.stockId = stockId;
								product.save(function(err,product) {
									if (err)
										res.status(500).json({message: err, status: false});
									else {
										Order.update({_id: orderId},{$push: {"productsId": product.id}}, function(err) {
											if (err)
												res.status(500).json({message: err, status: false});
										});
									}
								});
							}
						});
					});
					if (itemProducts == products.length){
						res.json({message: 'Order, products e stocks', status: true});
					}
				} else {
					console.log("Order con 0 prodotti\n");
					res.json({order: order, status: true});
				}
			});
		})

		.delete(function(req,res) {
			Order.findById(req.params.order_id, function(err,order) {
				if (err) {
					res.status(500).json({message: 'Ordine non trovato', status: false});
				} else if (order.productsId && order.productsId.length!=0) {
					console.log("Ordine con "+ order.productsId.length +" prodotti");
					var itemProducts = 0;
					Product.find({_id: {$in: order.productsId}}, function(err,products) {
						if (err)
							res.status(500).json({message: 'Prodotti non trovati', status: false});
						else {
							products.forEach(function(product) {
								itemProducts++;
								Stock.remove({_id: product.stockId}, function(err) {
									if (err)
										res.status(500).json({message: 'Stock non trovato', status: false});
								});
							});
							if (itemProducts == products.length) {
								Product.remove({_id: {$in: order.productsId}}, function(err) {
									if (err)
										res.status(500).json({message: 'Prodotti non cancellati', status: false});
								});
								order.remove(function(err) {
									if (err)
										res.status(500).json({message: 'Stock non trovato', status: false});
									else res.json({message: 'Order, products e stocks cancellati', status: true});
								});
							}
						}
					});
				}
				else {
					console.log("Ordine con 0 prodotti");
					order.remove(function(err) {
						if (err)
							res.status(500).json({message: 'Order non trovato', status: false});
							else res.json({message: 'Order cancellato', status: true});
						});
				}
			});
		});
	
	return router;
}