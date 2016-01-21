var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini';
var Cut = require('./../app/models/cut');

module.exports = function() {
	var router = express.Router();

	router.get('/cuts', function(req,res,timer) {
		var itemProducts = 0;
		request({
			url: URL_AGENTI,
			json: true,
		}, function(error, response, body) {
			if (error) {
				res.json({status: false, message: 'Agenti unreachable'});
			}
			else if (!error && response.statusCode==200) {
				for (var i in body.data) {
					itemProducts++;
					var cut = new Cut();
					cut.anno = body.data[i].Anno;
					cut.codice = body.data[i].Codice;
					cut.clienteCod = body.data[i].ClienteCod;
					cut.note = body.data[i].Note;
					var articoli = [];
					for(var key in body.data[i].data) {
						articoli[i].codArticolo = body.data[i].data[key].CodArticolo;
						articoli[i].desArticolo = body.data[i].data[key].DesArticolo;
						articoli[i].note = body.data[i].data[key].Note;
						articoli[i].quantita = body.data[i].data[key].Quantita;
						articoli[i].prezzo = body.data[i].data[key].Prezzo;
						articoli[i].altezza = body.data[i].data[key].Altezza;
						articoli[i].larghezza = body.data[i].data[key].Larghezza;
						articoli[i].profondita = body.data[i].data[key].Profondita;
						articoli[i].dataConsegna = body.data[i].data[key].DataConsegna;
						cut.articoli = articoli;
					}
					cut.save(function(err) {
						if (err)
							res.json({status: false, message: 'Cut non salvato'});
					});
				}
				if (itemProducts==body.data.length) {
					res.json({status: true, message: 'Cuts salvati'});
				}
			}
		});
	});
	return router;
};