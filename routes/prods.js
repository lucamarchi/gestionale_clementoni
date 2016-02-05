var express = require('express');

module.exports = function() {
	var router = express.Router();
	var Prod = require('./../app/models/prod');

	router.route('/prods')
		.post(function(req,res) {
			if (!req.body.prod || req.body.prod==undefined || !req.body.articoli || req.body.articoli==undefined) {
				res.status(500).json({message: 'Dati mancanti', status: false});
			} else {
				var prod = new Prod();
				prod.codice = req.body.prod.codice;
				req.body.articoli.forEach(function(art) {
					prod.articoliId.push(art.id);
					console.log(art)
				});
				prod.save(function(err,pr) {
					if (err)
						res.status(500).json({message: 'Errore', status: false});
					else res.json({message: 'Prod salvato', status: true, data: pr});
				});
			}
		});

		return router;
}