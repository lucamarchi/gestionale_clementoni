var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/ordini';
var Cut = require('./../app/models/cut');

module.exports = function() {
	var router = express.Router();

	router.get('/update', function(req,res) {
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
						articoli.push({
							codArticolo: body.data[i].data[key].CodArticolo,
							desArticolo: body.data[i].data[key].DesArticolo,
							note: body.data[i].data[key].Note,
							quantita: body.data[i].data[key].Quantita,
							prezzo: body.data[i].data[key].Prezzo,
							altezza: body.data[i].data[key].Altezza,
							larghezza: body.data[i].data[key].Larghezza,
							profondita: body.data[i].data[key].Profondita,
							dataConsegna: body.data[i].data[key].DataConsegna
						});
					}
					cut.articoli = articoli;
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
			console.log(req.body.operator);
			Cut.update({_id: req.params.cut_id},{$set: {"accepted": true, "operator": req.body.operator}}, function(err) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({message: "Cut accettato", status: true});
			});
		});

	router.put('')

	return router;
};

var latestCuts = function() {
	var year = new Date().getFullYear();
	Cut.find({anno: year}).sort({codice: -1}).limit(1).exec(function(err, cut) {
		if (err)
			return -2;
		else {
			if (cut)
				return cut.codice;
			else return -1;
		}
	});
};
