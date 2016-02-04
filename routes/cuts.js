var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini?anno=';
var URL_COD = '&codice=';
var Cut = require('./../app/models/cut');

module.exports = function() {
	var router = express.Router();
	
	router.get('/update', function(req,res) {
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
						cut.date = body.data[i].DataOrdine;
						var articoli = [];
						for(var key in body.data[i].data) {
							articoli.push({
								codArticolo: body.data[i].data[key].CodArticolo,
								tipo: (body.data[i].data[key].DesArticolo).trim(),
								note: body.data[i].data[key].Note,
								materiale: body.data[i].data[key].TipoArticolo,
								sottoTipo: (body.data[i].data[key].SottoTipoArticolo).trim(),
								quantita: body.data[i].data[key].Quantita,
								prezzo: body.data[i].data[key].Prezzo,
								spessore: body.data[i].data[key].Spessore,
								lunghezza: body.data[i].data[key].Lunghezza,
								larghezza: body.data[i].data[key].Larghezza,
								peso: (body.data[i].data[key].Peso).replace(",","."),
								dataConsegna: body.data[i].data[key].DataConsegna
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
					articoli = articoli.concat(cut.articoli);
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
				else res.json({data: cut, status: true});
			});	
		})

		.put(function(req,res) {
			Cut.update({_id: req.params.cut_id},{$set: {"accepted": true, "operator": req.body.operator}}, function(err) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({message: "Cut accettato", status: true});
			});
		});

	return router;
};

