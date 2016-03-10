var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini?anno=';
var URL_COD = '&codice=';
var Cut = require('./../app/models/cut');
var Article = require('./../app/models/article')

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
								ti = 'NASTRO'
							} else if (ti == 'COILS') {
								ti = 'COIL'
							} else if (ti == 'LAMIERA PIANA') {
								ti = 'PIANA'
							} else if (ti == 'LAMIERA PRESSOPIEGATA “OMEGA”') {
								ti = 'PRESSOPIEGATA OMEGA'
							} else if (ti == 'LAMIERA PRESSOPIEGATA “U”') {
								ti = 'PRESSOPIEGATA U'
							}
							var article = new Article();
							article.codArticolo = body.data[i].data[key].CodArticolo;
							article.note = body.data[i].data[key].Note;
							article.tipo = ti;
							article.materiale = body.data[i].data[key].TipoArticolo;
							article.sottoTipo = (body.data[i].data[key].SottoTipoArticolo).trim();
							article.quantita = body.data[i].data[key].Quantita;
							article.prezzo = body.data[i].data[key].Prezzo;
							article.spessore = body.data[i].data[key].Spessore;
							article.lunghezza = body.data[i].data[key].Lunghezza;
							article.larghezza = body.data[i].data[key].Larghezza;
							article.peso = (body.data[i].data[key].Peso).replace(",",".");
							article.dataConsegna = body.data[i].data[key].DataConsegna;
							articoli.push(article);
							article.save(function(err) {
								if (err) res.status(500).json({message: err, status: false});
							});
						}
						cut.articoli = articoli;
						data.push(cut);
						cut.save(function(err) {
							if (err) 
								console.log(err);
						});		
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
							res.json({cut: cut, articoli: articoli, status: true});
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