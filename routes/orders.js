var express = require('express');

module.exports = function() {
	var router = express.Router();
	var Product = require('./../app/models/product');
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');
	var controlPrd = require('./../app/control/checkvalprd');
	var controlOrd = require('./../app/control/checkvalord');

	// AGGIUNTA DI UN ORDINE POST /api/orders ED VISUALIZZAZIONE ORDINI GET /api/orders

	router.route('/orders')
		.post(function(req,res) {
			var check = controlOrd.check(req);
			console.log('Check order status %s', check);
			if (check) {			
				var order = new Order();
				order.numOrdine = req.body.numOrdine;
				order.ddt = req.body.ddt;
				order.fornitore = req.body.fornitore;
				order.cTrasporto = req.body.cTrasporto;
				order.cOrdine = req.body.cOrdine;
				order.cTotale = req.body.cTotale;
				order.save(function(err) {
					if (err)
						res.send(err);
					else {
						console.log('Ordine inserito');
						console.log(JSON.stringify(order,null,4));
						res.json({message: order.id, status: true});
					}
				});
			} else res.status(500).json({message: 'Dato non valido (ordine)', status: false});
		})

		.get(function(req,res) {
			Order.find({}, function(err,orders) {
				if (err)
					res.send(err);
				console.log('GET number orders %s', orders.length + '\n');
				res.json(orders);
			});	
		});

// MODIFICA DI UN ORDINE PUT /api/ordine/:ordine_id, RIMOZIONE DI UN ORDINE DELETE /api/orders/:order_id E VISUALIZZAZIONE ORDINE GET /api/orders/:order_id

	router.route('/orders/:order_id')
		.get(function(req,res) {
			Order.findById(req.params.order_id, function(err,order) {
				if (err)
					res.send(err);
				else {
					console.log(JSON.stringify(order,null,4) +'\n');
					res.json(order)}
			});
		})
		.put(function(req,res) {
			Order.findById(req.params.order_id, function(err,order) {
				if (err)
					res.send(err)
					if (req.body.numOrdine)
						order.numOrdine = req.body.numOrdine;
					if (req.body.ddt)
						order.ddt = req.body.ddt;
					if (req.body.fornitore)
						order.fornitore = req.body.fornitore;
					if (req.body.cTrasporto)
						order.cTrasporto = req.body.cTrasporto;
					if (req.body.cOrdine)
						order.cOrdine = req.body.cOrdine;
					if (req.body.cTotale)
						order.cTotale = req.body.cTotale;
				
					order.save(function(err) {
								if (err) {
									console.log('Errore, dati non validi (ordine,put');
									res.send(err);
								}
								else {
									res.json({message: 'Ordine modificato'});
									console.log(JSON.stringify(order,null,4) +'\n');}

							});
			});
		})
		.delete(function(req,res) {
			Order.findById(req.params.order_id, function(err,order) {
				if (err)
					res.send(err);
				else {
					console.log('LUNGHEZZA: '+  order.productIds!=undefined && order.productIds.length);
					if (typeof order.productIds!=undefined && order.productIds.length > 0) {
						console.log('Array: '+order.productIds.length > 0);
						productsId = order.productIds;
						productsId.forEach(function(id) {
							Product.remove({
								_id: id
							}, function(err,product) {
								if (err) {
									console.log('Errore');
								} else {
									console.log('Product remove: '+id);
								}
							});
						});
						if (typeof order.stockIds!=undefined && order.stockIds.length > 0) {
							stocksId = order.stockIds;
							stocksId.forEach(function(id) {
								Stock.remove({
									_id: id
								}, function(err,stock) {
									if (err) {
										console.log('Errore');
									} else {
										console.log('Stock remove: '+id);
									}
								});
							});
						}
						Order.remove({
							_id: req.params.order_id
							}, function(err,order) {
								if (err) {
									console.log('Errore');
									res.send(err);
								} else {
									res.json({message: 'Ordine cancellato', status: true});
									console.log(JSON.stringify(order,null,4) +'\n');
								}
							}
						);
					}
				}
		});
	});
	
	return router;
}