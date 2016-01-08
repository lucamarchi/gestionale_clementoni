var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Order = require('./../app/models/order');
	var Stock = require('./../app/models/stock');
	var Product = require('./../app/models/product');

	// VISUALIZZAZIONE STOCK GET /api/stocks

	router.route('/stocks')
		.get(function(req,res) {
			Stock.find({}, function(err,stocks) {
				if (err)
					res.send(err);
				res.json(stocks);
			});	
		});

	// MODIFICA DI UN STOCK PUT /api/stocks/:stock_id, RIMOZIONE DI UN STOCK DELETE /api/stock/:stock_id E VISUALIZZAZIONE STOCK GET /api/stocks/:stock_id
			
	router.route('/stocks/:stock_id')
		.get(function(req,res) {
			Stock.findById(req.params.stock_id, function(err,stock) {
				if (err)
					res.send(err);
				else {
					console.log(JSON.stringify(stock,null,4) +'\n');
					res.json(stock)}
			});
		})

		.put(function(req,res) {
			Stock.findById(req.params.stock_id, function(err,stock) {
				if (err)
					res.send(err)
				if (req.body.matricola)
					stock.matricola = req.body.matricola;
				if (req.body.materiale)
					stock.materiale = req.body.materiale;
				if (req.body.cop)
					stock.cop = req.body.cop;
				if (req.body.lunghezza)
					stock.lunghezza = req.body.lunghezza;
				if (req.body.larghezza)
					stock.larghezza = req.body.larghezza;
				if (req.body.spessore)
					stock.spessore = req.body.spessore;
				if (req.body.prezzo)
					stock.prezzo = req.body.prezzo;
				if (req.body.pesokg)
					stock.pesokg = req.body.pesokg;
				if (req.body.pesoton)
					stock.pesoton = req.body.pesoton;
				if (req.body.qualita)
					stock.qualita = req.body.qualita;
				if (req.body.colore)
					stock.colore = req.body.colore;
				if (req.body.ral)
					stock.ral = req.body.ral;
				if (req.body.note)
					stock.note = req.body.note;
				if (req.body.finitura)
					stock.finitura = req.body.finitura;
				stock.save(function(err) {
					if (err) {
						console.log('Errore, dati non validi');
						res.send(err);
					} else {
						res.json({message: 'Stock modificato', status: true});
						console.log(JSON.stringify(stock,null,4) +'\n');
					}
				});
			});
		})
		
		.delete(function(req,res) {
			Order.update({stockIds: {$elemMatch: {$eq: req.params.stock_id}}},
				{$pull: {stockIds: req.params.stock_id}},{multi:true}, 
					function(err) {
						if (err) {
							res.json({message: 'Errore',status: false});
							console.log('Errore: '+err);
						}
				});
			Product.update({stockId: req.params.stock_id},{$unset: {stockId: ""}}, function(err){
				if (err) {
					res.json({message: 'Errore',status: false});
					console.log('Errore: '+err);
				}
			});
			Stock.remove({
					_id: req.params.stock_id
				}, function(err,stock) {
					if (err) {
						console.log('Errore: '+err);
						res.json({message: 'Errore',status: false});
					} else {
						res.json({message: 'Stock cancellato', status: true});
					}
				}
			);
		});

		router.route('/stocks')
			.get(function(req,res) {
				Stock.find({}, function(err,stocks) {
					if (err)
						res.send(err);
					res.json(stocks);
				});	
		});

	return router;

};