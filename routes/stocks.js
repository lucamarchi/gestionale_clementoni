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
		/*
		.put(function(req,res) {
			if (!req.body.stock || req.body.stock==undefined || !req.body.figli || req.body.figli==undefined) {
				res.status(500).json({message: 'Dati mancanti', status: false});
			} else {
				Stock.findById({_id: req.params.stock_id}, function(err,stock) {
					if (err)
						res.status(500).json({message: 'Errore', status: false});
					else {
						var figli = req.body.figli;
						figli.forEach(function(f) {
							stock.figli.push(f);
						});
					}
				});
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
	*/
		.delete(function(req,res) {
			Stock.findById(req.params.stock_id, function(err,stock) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (stock.fatherId==undefined && stock.fatherId==undefined) {
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