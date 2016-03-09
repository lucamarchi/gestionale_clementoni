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
			var isFiglio = false;
			var matricola = req.body.stock.numeroCollo;
			var originalStock = req.body.stock;
			for (var i in matricola) {
				if (matricola[i] == "/") {
					isFiglio = true;
				}
			}
			if (isFiglio) {
				console.log("isFiglio: "+isFiglio)
				Product.findOne({stockId: originalStock._id}, function(err,sonProd) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						var matr = sonProd.numeroCollo + (sonProd.lavorazione.length) + req.body.macchina;
						var numFgl = [];
						for (var i = 0; i<req.body.figli.length; i++) {
							numFgl.push(i+1);
						}
						var sonProdId = sonProd._id;
						console.log(sonProdId);
						Product.findOne({_id: sonProd.fatherId}, function(err,fatherProd) {
							if (err)
								res.status(500).json({message: err, status: false});
							else {
								var fatherProdId = fatherProd._id;
								console.log(fatherProdId);
								var figliProdInProcess = [];
								var itemStocks = 0;
								var figli = req.body.figli;
								var process = new Process();
								var f = [];
								process.scarto = req.body.scarto;
								process.operatore = req.body.operatore;
								process.macchina = req.body.macchina;
								figli.forEach(function(p) {
									var stock = new Stock();
									var el = numFgl.pop();
									stock.numeroCollo = matr + el;
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
									var product = new Product();
									product.numeroCollo = matr + el;
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
									product.stockId = stock.id;
									product.fatherId = fatherProdId;
									f.push(product);
									stock.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false});
										else {
											product.save(function(err) {
												if (err)
													res.status(500).json({message: err, status: false});
												else {
													itemStocks++;
													if (itemStocks == figli.length && numFgl.length==0) {
														process.figli = f;
														process.save(function(err) {
															if (err)
																res.status(500).json({message: err, status: false});
															else {
																Product.update({_id: fatherProdId},{$inc: {"scarto": req.body.scarto}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false});
																	else {
																		Product.update({_id: sonProdId},{$push:{"lavorazione": process.id}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false});
																			else {
																				Article.update({_id: req.body.article._id}, {$push: {"lavorazione": process.id}}, function(err) {
																					if (err)
																						res.status(500).json({message: err, status: false});
																					else {
																						Article.update({_id: req.body.article._id},{$set: {"stato": "lavorazione"}}, function(err) {
																							if (err)
																								res.status(500).json({message: err, status: false});
																							else {
																								Article.update({_id: req.body.article._id},{$inc: {"scarto": req.body.scarto}}, function(err) {
																									if (err)
																										res.status(500).json({message: err, status: false});
																									else {
																										Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																											if (err)
																												res.status(500).json({message: err, status: false});
																											else {
																												res.json({message: 'Lavorazione corretta', status: true, data: process});
																											}
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
																});
															}
														});
													}
												}
											});
										}
									});
								});
							}
						});
					}
				});
			}
			else {
								console.log("isFiglio: "+isFiglio)

				Product.findOne({stockId: originalStock._id}, function(err,fatherProd) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						var matr = fatherProd.numeroCollo + '/' + fatherProd.lavorazione.length + req.body.macchina;
						var numFgl = [];
						for (var i = 0; i<req.body.figli.length; i++) {
							numFgl.push(i+1);
						}
						console.log(numFgl)
						var fatherProdId = fatherProd._id;
						var figliProdInProcess = [];
						var itemStocks = 0;
						var process = new Process();
						var figli = req.body.figli;
						var f = [];
						process.scarto = req.body.scarto;
						process.operatore = req.body.operatore;
						process.macchina = req.body.macchina;
								figli.forEach(function(p) {
									var stock = new Stock();
									var el = numFgl.pop();
									stock.numeroCollo = matr + el;
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
									var product = new Product();
									product.numeroCollo = matr + el;
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
									product.stockId = stock.id;
									product.fatherId = fatherProdId;
									f.push(product);
									stock.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false});
										else {
											product.save(function(err) {
												if (err)
													res.status(500).json({message: err, status: false});
												else {
													itemStocks++;
													if (itemStocks == figli.length && numFgl.length==0) {
														process.figli = f;
														process.save(function(err) {
															if (err)
																res.status(500).json({message: err, status: false});
															else {
																Product.update({_id: fatherProdId},{$inc: {"scarto": req.body.scarto}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false});
																	else {
																		Product.update({_id: fatherProdId},{$push:{"lavorazione": process.id}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false});
																			else {
																				Article.update({_id: req.body.article._id}, {$push: {"lavorazione": process.id}}, function(err) {
																					if (err)
																						res.status(500).json({message: err, status: false});
																					else {
																						Article.update({_id: req.body.article._id},{$set: {"stato": "lavorazione"}}, function(err) {
																							if (err)
																								res.status(500).json({message: err, status: false});
																							else {
																								Article.update({_id: req.body.article._id},{$inc: {"scarto": req.body.scarto}}, function(err) {
																									if (err)
																										res.status(500).json({message: err, status: false});
																									else {
																										Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																											if (err)
																												res.status(500).json({message: err, status: false});
																											else {
																												res.json({message: 'Lavorazione corretta', status: true, data: process});
																											}
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
																});
															}
														});
													}
												}
											});
										}
									});
								});
					}
				});
			}
		})
			
	return router;
};