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
			console.log("STOCK ORIGINALE: " +req.body.stock);
			console.log("NUMEROCOLLO STOCK ORIGINALE: "+req.body.stock.numeroCollo);
			var originalStock = req.body.stock;
			for (var i in matricola) {
				if (matricola[i] == "/") {
					isFiglio = true;
				}
			}
			if (isFiglio) {
				console.log("isFiglio: "+isFiglio)
				Product.findOne({stockId: originalStock._id}, function(err,sonProd) {
					if (err) {
						res.status(500).json({message: err, status: false, msg: "1"});
					}
					else {
						var matr = sonProd.numeroCollo + sonProd.lavorazione + req.body.macchina;
						var numFgl = [];
						for (var i = 0; i<req.body.figli.length; i++) {
							numFgl.push(i+1);
						}
						var sonProdId = sonProd._id;
						console.log(sonProdId);
						Product.findOne({_id: sonProd.fatherId}, function(err,fatherProd) {
							if (err)
								res.status(500).json({message: err, status: false, msg: "2"});
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
								process.product = fatherProdId;
								if (req.body.article) {
									process.article = req.body.article._id;
								}
								figli.forEach(function(p) {
									var stock = new Stock();
									var el = numFgl.pop();
									stock.numeroCollo = matr + el + '/';
									stock.tipo = p.tipo;
									stock.materiale = p.materiale;
									stock.qualita = p.qualita;
									stock.scelta = p.scelta;
									stock.finitura = p.finitura;
									stock.coloreRal = p.coloreRal;
									stock.pesoLordo = p.pesoLordo;
									stock.pesoNetto = p.pesoNetto;
									stock.spessore = p.spessore;
									stock.larghezza = p.larghezza;
									stock.classeLarghezza = p.classeLarghezza;
									stock.lunghezza = p.lunghezza;
									stock.numFogli = p.numFogli;
									stock.prezzo = p.prezzo;
									stock.difetti = p.difetti;
									stock.stabilimento = p.stabilimento;
									stock.superficie = p.superficie;
									var product = new Product();
									product.numeroCollo = matr + el + '/';
									product.tipo = p.tipo;
									product.materiale = p.materiale;
									product.qualita = p.qualita;
									product.scelta = p.scelta;
									product.finitura = p.finitura;
									product.coloreRal = p.coloreRal;
									product.pesoLordo = p.pesoLordo;
									product.pesoNetto = p.pesoNetto;
									product.spessore = p.spessore;
									product.larghezza = p.larghezza;
									product.classeLarghezza = p.classeLarghezza;
									product.lunghezza = p.lunghezza;
									product.numFogli = p.numFogli;
									product.prezzo = p.prezzo;
									product.difetti = p.difetti;
									product.stabilimento = p.stabilimento;
									product.superficie = p.superficie;
									product.stockId = stock.id;
									product.fatherId = fatherProdId;
									f.push(product);
									stock.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false, msg: "3"});
										else {
											product.save(function(err) {
												if (err)
													res.status(500).json({message: err, status: false, msg: "4"});
												else {
													itemStocks++;
													if (itemStocks == figli.length && numFgl.length==0) {
														process.figli = f;
														process.save(function(err) {
															if (err)
																res.status(500).json({message: err, status: false, msg: "5"});
															else {
																Product.update({_id: fatherProdId},{$inc: {"scarto": req.body.scarto}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false, msg: "6"});
																	else {
																		Product.update({_id: sonProdId},{$inc: {"lavorazione": 1}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false, msg: "7"});
																			else {
																				if (req.body.article) {
																						Article.update({_id: req.body.article._id},{$set: {"stato": "lavorazione"}}, function(err) {
																							if (err)
																								res.status(500).json({message: err, status: false, msg: "8"});
																							else {
																								Article.update({_id: req.body.article._id},{$inc: {"scarto": req.body.scarto}}, function(err) {
																									if (err)
																										res.status(500).json({message: err, status: false, msg: "9"});
																									else {
																										Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																											if (err)
																												res.status(500).json({message: err, status: false, msg: "10"});
																											else {
																												Article.update({_id: req.body.article._id},{$unset: {stockId: ""}}, function(err) {
																													if (err)
																														res.status(500).json({message: err, status: false, msg: "11"});
																													else res.json({message: 'Lavorazione corretta', status: true, data: process});
																												})
																											}
																										});
																									}
																								});
																							}
																						});
																				
																				} else {
																					Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																					if (err)
																						res.status(500).json({message: err, status: false, msg: "12"});
																					else {
																						res.json({message: 'Lavorazione corretta', status: true, data: process});
																					}
																				});
																				}
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
						res.status(500).json({message: err, status: false, msg: "13"});
					else {
						var matr = fatherProd.numeroCollo + '/' + fatherProd.lavorazione + req.body.macchina;
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
						process.macchina = req.body.macchina;
						process.product = fatherProdId;
						if (req.body.article) {
							process.article = req.body.article._id;
						}
								figli.forEach(function(p) {
									var stock = new Stock();
									var el = numFgl.pop();
									stock.numeroCollo = matr + el + '/';
									stock.tipo = p.tipo;
									stock.materiale = p.materiale;
									stock.qualita = p.qualita;
									stock.scelta = p.scelta;
									stock.finitura = p.finitura;
									stock.coloreRal = p.coloreRal;
									stock.pesoLordo = p.pesoLordo;
									stock.pesoNetto = p.pesoNetto;
									stock.spessore = p.spessore;
									stock.larghezza = p.larghezza;
									stock.classeLarghezza = p.classeLarghezza;
									stock.lunghezza = p.lunghezza;
									stock.numFogli = p.numFogli;
									stock.prezzo = p.prezzo;
									stock.difetti = p.difetti;
									stock.stabilimento = p.stabilimento;
									stock.superficie = p.superficie;
									var product = new Product();
									product.numeroCollo = matr + el + '/';
									product.tipo = p.tipo;
									product.materiale = p.materiale;
									product.qualita = p.qualita;
									product.scelta = p.scelta;
									product.finitura = p.finitura;
									product.coloreRal = p.coloreRal;
									product.pesoLordo = p.pesoLordo;
									product.pesoNetto = p.pesoNetto;
									product.spessore = p.spessore;
									product.larghezza = p.larghezza;
									product.classeLarghezza = p.classeLarghezza;
									product.lunghezza = p.lunghezza;
									product.numFogli = p.numFogli;
									product.prezzo = p.prezzo;
									product.difetti = p.difetti;
									product.stabilimento = p.stabilimento;
									product.superficie = p.superficie;
									product.stockId = stock.id;
									product.fatherId = fatherProdId;
									f.push(product);
									stock.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false, msg: "14"});
										else {
											product.save(function(err) {
												if (err)
													res.status(500).json({message: err, status: false, msg: "15"});
												else {
													itemStocks++;
													if (itemStocks == figli.length && numFgl.length==0) {
														process.figli = f;
														process.save(function(err) {
															if (err)
																res.status(500).json({message: err, status: false, msg: "16"});
															else {
																Product.update({_id: fatherProdId},{$inc: {"scarto": req.body.scarto}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false, msg: "17"});
																	else {
																		Product.update({_id: fatherProdId},{$inc: {"lavorazione": 1}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false, msg: "18"});
																			else {
																		if (req.body.article) {
																				Article.update({_id: req.body.article._id},{$set: {"stato": "lavorazione"}}, function(err) {
																							if (err)
																								res.status(500).json({message: err, status: false, msg: "19"});
																							else {
																								Article.update({_id: req.body.article._id},{$inc: {"scarto": req.body.scarto}}, function(err) {
																									if (err)
																										res.status(500).json({message: err, status: false, msg: "20"});
																									else {
																										Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																											if (err)
																												res.status(500).json({message: err, status: false, msg: "21"});
																											else {
																												Article.update({_id: req.body.article._id},{$unset: {stockId: ""}}, function(err) {
																													if (err)
																														res.status(500).json({message: err, status: false, msg: "22"});
																													else res.json({message: 'Lavorazione corretta', status: true, data: process});
																												})
																											}
																										});
																									}
																								});
																							}
																						});
																				
																				} else {
																					Stock.update({_id: originalStock._id},{$set: originalStock}, function(err) {
																						if (err)
																							res.status(500).json({message: err, status: false, msg: "23"});
																						else {
																							res.json({message: 'Lavorazione corretta', status: true, data: process});
																						}
																					});
																				}
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

	router.route('/processes/articles/:article_id')
		.get(function(req,res) {
			Process.findOne({article: req.params.article_id},function(err,processes) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					if (processes) {
						if (processes.figli.length>0) {
							Product.find({_id: {$in: processes.figli}}, function(err, products) {
								if (err)
									res.status(500).json({message: err, status: false})
								else res.json({processes: processes, figli: products, status: true});
							});
						} else res.status(500).json({processes: processes, figli: [], status: false})
					} else res.status(500).json({message: err, status: false})
				}
			});
		});
			
	return router;
};