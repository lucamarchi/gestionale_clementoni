var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini?anno=';
var URL_COD = '&codice=';
var Cut = require('./../app/models/cut');

module.exports = function() {
	var router = express.Router();
	
	router.get('/update/:cod_cut', function(req,res) {
		var itemProducts = 0;
		var cod;
		var url = URL_AGENTI;	
		var date = new Date().getFullYear();
		console.log("Codice: "+cod+ " condizione >0 "+cod>0);
		var url = URL_AGENTI + date + URL_COD + req.params.cod_cut;
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
							desArticolo: body.data[i].data[key].DesArticolo,
							note: body.data[i].data[key].Note,
							tipo: body.data[i].data[key].TipoArticolo,
							sottoTipo: body.data[i].data[key].SottoTipoArticolo,
							quantita: body.data[i].data[key].Quantita,
							prezzo: body.data[i].data[key].Prezzo,
							spessore: body.data[i].data[key].Spessore,
							lunghezza: body.data[i].data[key].Lunghezza,
							larghezza: body.data[i].data[key].Larghezza,
							peso: body.data[i].data[key].Peso,
							dataConsegna: body.data[i].data[key].DataConsegna
						});
					}
					cut.articoli = articoli;
					cut.save(function(err) {
						if (err) 
							console.log(err);
					});		
			}
				if (itemProducts==body.data.length) {
					console.log("DIMENSIONE: "+ body.data.length)
					res.json({status: true, message: 'Cuts salvati'});
				}
			} else res.json({status: true, message: 'Nessun cut nuovo'});
		});
	});

	router.get('/cuts', function(req,res) {
		Cut.find({}, function(err,cuts) {
			if (err)
				res.status(500).json({message: err, status: false});
			else res.json({data: cuts, status: true});
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


function latestCuts() {
	var year = new Date().getFullYear();
	Cut.find({anno: year}).sort({codice: -1}).limit(1).exec(function(err, cut) {
		if (err) {
			console.log('Errore latestCuts: ' + err);
			return 0;
		}
		else {
			if (cut.length > 0) {
				console.log('Length Cuts: '+cut.length);
				return cut.codice;
			}
			else {
				console.log('Length 0 latestCuts: ' + cut.length);
				return 0;
			}
		}
	});
};
