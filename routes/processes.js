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
			var matricola = req.body.stock.matricola;
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
									itemStocks++;
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
													if (itemStocks == figli.length) {
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
																												var itemFigli = 0;
																												for (var i in f) {
																													itemFigli++;
																													console.log("Figlio: "+f[i]._id);
																													Process.findOneAndUpdate({_id: process.id},{$push: {"figli": f[i]}},{new: true},function(err,process) {
																														if (err)
																															res.status(500).json({message: err, status: false});
																														else if(itemFigli == f.length) {
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
									itemStocks++;
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
													if (itemStocks == figli.length) {
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
			/*
			if (req.body.stock.matricola.indexOf("/") >= 0) {
				Product.find({stockId: req.body.stock.id}, function(err,pr) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						Product.find({_id: pr.fatherId}, function(err,pro) {
							if (err)
								res.status(500).json({message: err, status: false});
							else {
				stockId = req.body.stock._id;
				console.log("STOCK ID: " +stockId);
				var f = [];
				var itemProducts = 0;
				var itemStocks = 0;
				var figli = req.body.figli;
				var process = new Process();
				var originalStock = req.body.stock;
				process.scarto = req.body.scarto;
				process.operatore = req.body.operatore;
				process.macchina = req.body.macchina;
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
					itemStocks++;
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
					product.stockId = stock.id;
					product.fatherId = pro.id;
					stock.save(function(err) {
						if (err)
							res.status(500).json({message: err, status: false});
						else {
							product.save(function(err) {
								if (err)
									res.status(500).json({message: err, status: false});
								else {
									if (itemStocks==figli.length) {
										process.save(function(err) {
											if (err)
												res.status(500).json({message: err, status: false});
											else {
												Product.update({_id: pro.id},{$inc: {"scarto": req.body.scarto}}, function(err) {
													if (err)
														res.status(500).json({message: err, status: false});
													else {
														Product.update({_id: pro.id},{$push:{"lavorazione": process.id}}, function(err) {
															if (err)
																res.status(500).json({message: err, status: false});
															else {
																Article.update({_id: req.body.article._id}, {$push: {"lavorazione": process.id}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false});
																	else {
																		Article.update({_id: req.body.article._id},{$set: {"scarto": req.body.scarto, "stato": "lavorazione"}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false});
																			else {
																				Stock.update({_id: originalStock.id},{$set: originalStock}, function(err) {
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
								}
							});
						}
					});
				});								
							}
						});
					}
				});
				
			} else {
				stockId = req.body.stock._id;
				console.log("STOCK ID: " +stockId);
				var f = [];
				var itemProducts = 0;
				var itemStocks = 0;
				var figli = req.body.figli;
				var process = new Process();
				var originalStock = req.body.stock;
				process.scarto = req.body.scarto;
				process.operatore = req.body.operatore;
				process.macchina = req.body.macchina;
				Product.find({stockId: stockId},function(err,prod) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						var productId = prod.id;
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
							itemStocks++;
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
							product.stockId = stock.id;
							product.fatherId = productId;
							console.log("FatherP: "+product.fatherId);
							console.log("Prod: "+ productId);
							product.lavorazione.push(process.id);
							stock.save(function(err) {
								if (err)
									res.status(500).json({message: err, status: false});
								else {
									product.save(function(err) {
										if (err)
											res.status(500).json({message: err, status: false});
										else {
											if (itemStocks==figli.length) {
												process.save(function(err) {
													if (err)
														res.status(500).json({message: err, status: false});
													else {
														Product.update({_id: productId},{$inc: {"scarto": req.body.scarto}}, function(err) {
															if (err)
																res.status(500).json({message: err, status: false});
															else {
																Product.update({_id: productId},{$push:{"lavorazione": process.id}}, function(err) {
																	if (err)
																		res.status(500).json({message: err, status: false});
																	else {
																		Article.update({_id: req.body.article._id}, {$push: {"lavorazione": process.id}}, function(err) {
																			if (err)
																				res.status(500).json({message: err, status: false});
																			else {
																				Article.update({_id: req.body.article._id},{$set: {"scarto": req.body.scarto, "stato": "lavorazione"}}, function(err) {
																					if (err)
																						res.status(500).json({message: err, status: false});
																					else {
																						Stock.update({_id: originalStock.id},{$set: originalStock}, function(err) {
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
										}
									});
								}
							});
						});
					}
				});
			}*/
	return router;
};