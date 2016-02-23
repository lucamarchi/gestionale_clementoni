var express = require('express');

module.exports = function() {
	var router = express.Router();
	var Prod = require('./../app/models/prod');
	var Process = require('./../app/models/process');
	var Stock = require('./../app/models/stock');
	var Article = require('./../app/models/article');
	var Product = require('./../app/models/product')

	router.route('/processes')
		.post(function(req,res) {
			stockId = req.body.stock._id;
			console.log("STOCK ID: " +stockId);
			var f = [];
			var itemProducts = 0;
			var figli = req.body.figli;
			figli.forEach(function(p) {
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
				f.push({
					matricola: stock.matricola,
					tipo: stock.tipo,
					materiale: stock.materiale,
					qualita: stock.qualita,
					scelta: stock.scelta,
					finitura: stock.finitura,
					coloreRal: stock.coloreRal,
					peso: stock.peso,
					spessore: stock.spessore,
					larghezza: stock.larghezza,
					classeLarghezza: stock.classeLarghezza,
					lunghezza: stock.lunghezza,
					numFogli: stock.numFogli,
					prezzo: stock.prezzo,
					difetti: stock.difetti,
					stabilimento: stock.stabilimento
				});
				stock.save(function(err){
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						itemProducts++;
						if (itemProducts==figli.length) {
							var process = new Process();
							process.scarto = req.body.scarto;
							process.macchina = req.body.macchina;
							process.operatore = req.body.operatore;
							console.log(f);
							process.figli = f;
							console.log(process.figli);
							Stock.update({_id: stockId}, {$set: req.body.stock}, function(err) {
								if (err) {
									console.log("Errore update stock: "+err);
									res.status(500).json({message: err, status: false});
								}
								else {
									process.save(function(err) {
										if (err) {
											console.log("Errore save process: "+err);
											res.status(500).json({message: err, status: false});
										}
										else {
											console.log("Id process: "+process.id);
											Article.update({_id: req.body.article._id},{$set: {"scarto": req.body.scarto, "stato": "lavorazione"}}, function(err) {
												if (err) {
													console.log("Errore updatete article: "+err);
													res.status(500).json({message: err, status: false});
												} else {
													Article.update({_id: req.body.article._id}, {$push: {"lavorazione": process.id}}, function(err) {
														if (err) {
															console.log("Errore update article: "+err);
															res.status(500).json({message: err, status: false});
														}
														else {
															Product.update({stockId: stockId},{$inc: {"scarto": req.body.scarto}}, function(err) {
																if (err) {
																	console.log("Errore update product: "+err);
																	res.status(500).json({message: err, status: false});
																}
																else 
																	Product.update({stockId: stockId},{$push: {"lavorazione": process.id}},function(err) {
																		if (err) res.status(500).json({message: err, status: false});
																		else res.json({message: 'Lavorazione corretta', status: true, 
																		data: process});	
																	});
															});		
														}
													});
												}
											});
										}
									});
								}
							});
						}
					}				
				});
			});
		});

		return router;
};