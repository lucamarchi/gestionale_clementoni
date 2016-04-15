var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini?anno=';
var URL_COD = '&codice=';
var URL_CUSTOMER = 'http://test.agenti.copal.it/api/clienti'
var Cut = require('./../app/models/cut');
var Article = require('./../app/models/article')
var Customer = require('./../app/models/customer')

module.exports = function() {
	var router = express.Router();
	
	router.get('/cuts/update', function(req,res) {
		var itemProducts = 0;
		var cod;
		var url = URL_AGENTI;	
		var data = [];
		var date = new Date().getFullYear();
		console.log("Codice: "+cod+ " condizione >0 "+cod>0);
		Cut.find({anno: date}).sort({codice: -1}).limit(1).exec(function(err, cut) {
			if (err) {
				console.log(err);
			} else {
				if (cut[0] && cut[0].codice!=undefined) {
					cod = cut[0].codice+1;
					console.log("Codice: "+cod);
				} else {
					console.log("CUT di else: "+cut);
					cod = 0;
				}
			var url = URL_AGENTI + date + URL_COD + cod;
			console.log('URL: '+url);
			request({
				url: url,
				json: true,	
			}, function(error, response, body) {
				if (error) {
					res.json({status: false, message: 'Agenti unreachable'});
				}
				else if (!error && response.statusCode==200 && body.data.length>0) {
					for (var i in body.data) {
						itemProducts++;
						var cut = new Cut();
						cut.anno = body.data[i].Anno;
						cut.codice = body.data[i].Codice;
						cut.clienteCod = body.data[i].ClienteCod;
						cut.note = body.data[i].Note;
						cut.date = new Date(body.data[i].DataOrdine);
						var articoli = [];
						for(var key in body.data[i].data) {
							var ti = (body.data[i].data[key].DesArticolo).trim();
							if (ti == 'NASTRI') {
								ti = 'nastro'
							} else if (ti == 'COILS') {
								ti = 'coil'
							} else if (ti == 'LAMIERA PIANA') {
								ti = 'piana'
							} else if (ti == 'LAMIERA PRESSOPIEGATA “OMEGA”') {
								ti = 'pressopiegata omega'
							} else if (ti == 'LAMIERA PRESSOPIEGATA “U”') {
								ti = 'pressopiegata u'
							} else {
								ti = ti.toLowerCase();
							}
							var article = new Article();
							article.codArticolo = body.data[i].data[key].CodArticolo;
							article.note = body.data[i].data[key].Note;
							article.tipo = ti;
							article.materiale = (body.data[i].data[key].TipoArticolo).toLowerCase();
							article.sottoTipo = (body.data[i].data[key].SottoTipoArticolo).trim();
							article.quantita = body.data[i].data[key].Quantita;
							article.prezzo = body.data[i].data[key].Prezzo;
							article.spessore = body.data[i].data[key].Spessore;
							article.lunghezza = body.data[i].data[key].Lunghezza;
							article.larghezza = body.data[i].data[key].Larghezza;
							article.peso = (body.data[i].data[key].Peso).replace(",",".")*1000;
							var s = (body.data[i].data[key].DataConsegna).split(' ');
							var y = s[0].split('/');
							var d = new Date(y[2],y[1]-1,y[0]);
							article.ordineCod = cut.codice;
							article.clienteCod = cut.clienteCod;
							article.dataConsegna = d;
							articoli.push(article);
							article.save(function(err) {
								if (err) res.status(500).json({message: err, status: false});
							});
						}
						cut.articoli = articoli;
						data.push(cut);
						if (cut.articoli.length>0) {
							cut.save(function(err) {
								if (err) 
									console.log(err);
							});
						}		
					}
					if (itemProducts==body.data.length) {
						console.log("DIMENSIONE: "+ body.data.length)
						res.json({status: true, message: 'Cuts salvati', data: data});
					}
				} else res.json({status: true, message: 'Nessun cut nuovo'});
			});
			}	
		});
	});


	router.get('/cuts', function(req,res) {
		Cut.find({}, function(err,cuts) {
			if (err)
				res.status(500).json({message: err, status: false});
			else res.json({data: cuts, status: true});
		});	
	});

	router.get('/cuts/accepted', function(req,res) {
		Cut.find({accepted: true}, function(err,cuts) {
			if (err) {
				console.log(err);
				res.json({status: false, data: 'Errore'});
			}
			else {
				var articoli = [];
				cuts.forEach(function(cut) {
					cut.articoli.forEach(function(art) {
						if (art.stato == 'LIBERO')
							articoli.push(art)
					})
				});
				res.json({status: true, data: articoli});
			}
		});
	});

	router.route('/cuts/:cut_id')
		.get(function(req,res) {
			Cut.findById(req.params.cut_id, function(err,cut) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (cut.articoli && cut.articoli.length!=0) {
					Article.find({_id: {$in: cut.articoli}}, function(err, articoli) {
						if (err)
							res.status(500).json({message: err, status: false});
						else {
							if (!cut.customer) {
								console.log("Condizione if: "+ !cut.customer && cut.customer!=undefined)
								request({
									url: URL_CUSTOMER,
									json: true,	
								}, function(error, response, body) {
									if (error) {
										res.json({status: false, message: 'Agenti unreachable'});
									}
									else if (!error && response.statusCode==200 && body.data.length>0) {
										for (var i in body.data) {
											if (body.data[i].Id==cut.clienteCod) {
												var customer = new Customer();
												customer.ident = body.data[i].Id;
												customer.agente = body.data[i].Agente;
												customer.bancaAbi = body.data[i].BancaAbi;
												customer.bancaCab = body.data[i].BancaCab;
												customer.codFiscale = body.data[i].CodFiscale;
												customer.fax = body.data[i].Fax;
												customer.indirizzo = body.data[i].Indirizzo;
												customer.localita = body.data[i].Localita;
												customer.nome = body.data[i].Nome;
												customer.pagamento = body.data[i].Pagamento;
												customer.partitaIva = body.data[i].PartitaIva;
												customer.provincia = body.data[i].Provincia;
												customer.regione = body.data[i].Regione;
												customer.telefono = body.data[i].Telefono;
												customer.email = body.data[i].eMail;
												console.log("CUSTOMER FIND : "+ customer)
												customer.save(function(err) {
													if (err) 
														res.status(500).json({message: err, status: false});
													else {
														Cut.update({_id: req.params.cut_id},{$set: {"customer": customer.id}},function(err) {
															if (err) 
																res.status(500).json({message: err, status: false});
															else {
																res.json({cut: cut, articoli: articoli, customer: customer, status: true});
															}	
														});
													}
												});
											}
										}
									}
								});
							} else {
								Customer.findById(cut.customer, function(err,customer) {
									if (err)
										res.status(500).json({message: err, status: false});
									else {
										res.json({cut: cut, articoli: articoli, customer: customer, status: true});
									}
								});
							}
						}
					});
				} else res.json({cut: cut, articoli: [], status: true});
			});
		})

		.put(function(req,res) {
			var itemProducts = 0;
			Cut.findOne({_id: req.params.cut_id}, function(err,cut) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					cut.accepted = true;
					cut.operator = req.body.operator;
					if(cut.articoli && cut.articoli.length>0) {
						var articoli = cut.articoli;
						articoli.forEach(function(a) {
							Article.update({_id: a},{$set: {"stato": "libero"}}, function(err) {
								if (err)
									res.status(500).json({message: err, status: false});
								else {
									itemProducts++;
									if (itemProducts==articoli.length) {
										if (!cut.customer) {
											console.log("Condizione if: "+ !cut.customer)
											request({
												url: URL_CUSTOMER,
												json: true,	
											}, function(error, response, body) {
												if (error) {
													res.json({status: false, message: 'Agenti unreachable'});
												}
												else if (!error && response.statusCode==200 && body.data.length>0) {
													for (var i in body.data) {
														if (body.data[i].Id==cut.clienteCod) {
															var customer = new Customer();
															customer.ident = body.data[i].Id;
															customer.agente = body.data[i].Agente;
															customer.bancaAbi = body.data[i].BancaAbi;
															customer.bancaCab = body.data[i].BancaCab;
															customer.codFiscale = body.data[i].CodFiscale;
															customer.fax = body.data[i].Fax;
															customer.indirizzo = body.data[i].Indirizzo;
															customer.localita = body.data[i].Localita;
															customer.nome = body.data[i].Nome;
															customer.pagamento = body.data[i].Pagamento;
															customer.partitaIva = body.data[i].PartitaIva;
															customer.provincia = body.data[i].Provincia;
															customer.regione = body.data[i].Regione;
															customer.telefono = body.data[i].Telefono;
															customer.email = body.data[i].eMail;
															cut.customer = customer.id
															console.log("CUSTOMER FIND : "+ customer)
															customer.save(function(err) {
																if (err) 
																	res.status(500).json({message: err, status: false});
																else {
																	cut.save(function(err,cut) {
																		if (err)
																			res.status(500).json({message: err, status: false});
																		else {
																			res.json({message: "Cut accettato", status: true});
																		}
																	});
																}
															});
														}
													}
												}
											});
										} else {
											cut.save(function(err,cut) {
												if (err)
													res.status(500).json({message: err, status: false});
												else {
													res.json({message: "Cut accettato", status: true});
												}
											});
										}
									}
								}
							});
						});
					} else {
						cut.save(function(err,cut) {
							if (err)
								res.status(500).json({message: err, status: false});
							else {
								res.json({message: "Cut accettato", status: true});
							}
						});
					}
				}
			});
		});

	return router;
};