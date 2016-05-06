var express = require('express');

module.exports = function() {
	var router = express.Router();
	var Prod = require('./../app/models/prod');
	var Process = require('./../app/models/process');
	var Stock = require('./../app/models/stock');
	var Article = require('./../app/models/article');
	var Product = require('./../app/models/product')

	router.route('/prods')
		.post(function(req,res) {
			if (!req.body.prod || req.body.prod==undefined || !req.body.articoli || req.body.articoli==undefined) {
				res.status(500).json({message: 'Dati mancanti', status: false});
			} else {
				Prod.findOne().sort({numero: -1}).limit(1).exec(function(err,prod) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						if (!prod) {
							var numero = 1;
						} else {
							var numero = prod.numero+1;
						}
				var prod = new Prod();
				prod.codice = req.body.prod.codice;
				prod.numero = numero;
				req.body.articoli.forEach(function(art) {
					prod.articoliId.push(art._id);
					Article.update({_id: art._id}, {$set: {"stato": "definito"}}, function(err) {
						if (err) res.status(500).json({message: 'Errore', status: false});
					})
					console.log(art)
				});
				prod.save(function(err,pr) {
					if (err)
						res.status(500).json({message: 'Errore', status: false});
					else res.json({message: 'Prod salvato', status: true, data: pr});
				});
			}
		});
			}
		})

		.get(function(req,res) {
			Prod.find({}, function(err,prods) {
				if (err) 
					res.status(500).json({message: err, status: false});
				else res.json({status: true, data: prods});
			});	
		});

	
	router.route('/prods/:prod_id')
		.put(function(req,res) {
			Prod.find({_id: req.params.prod_id}, function(err,prod) {
				if (err)
					res.status(500).json({message: err, status: false});
				else if (req.body.articoli && req.body.articoli.length>0) {
					console.log("Prods con "+req.body.articoli.length+"articoli\n");
					var prodId = prod.id;
					var articoli = req.body.articoli;
					var itemProducts = 0;
					articoli.forEach(function(art) {
						itemProducts++;	
						Prod.update({_id: req.params.prod_id},{$addToSet: {"articoliId": art._id}}, function(err) {
							if (err) res.status(500).json({message: 'Errore', status: false});
						});
						Article.update({_id: art.id},{$set: {"stato": "definito"}}, function(err) {
							if (err) res.status(500).json({message: 'Errore', status: false});
							else {
								if (itemProducts==articoli.length) {
									Prod.update({_id: req.params.prod_id},{$set: req.body.prod}, function(err,prod) {
										if (err)
											res.status(500).json({message: err, status: false});
										else res.json({message: 'Prod modificato con articoli', status: true, data: prod})
									});
								}
							}
						});						
					});
				} else res.json({message: 'Prod modificato con 0 articoli', status: true, data: prod});
			});
	})

	.get(function(req,res) {
		Prod.findById(req.params.prod_id, function(err,prod) {
			if (err)
				res.status(500).json({message: err, status: false});
			else if (prod.articoliId && prod.articoliId.length!=0) {
				Article.find({_id: {$in: prod.articoliId}}, function(err, articoli) {
					if (err)
						res.status(500).json({message: err, status: false});
					else {
						res.json({prod: prod, articoli: articoli, status: true});
					}
				});
			} else res.json({prod: prod, articoli: [], status: true});
		});
	})

	.delete(function(req,res) {
		Prod.findById(req.params.prod_id, function(err,prod) {
			if (err)
				res.status(500).json({message: err, status: false});
			else if (prod.articoliId && prod.articoliId.length!=0) {
				var itemProducts = 0;
				prod.articoliId.forEach(function(art) {
					Article.update({_id: art},{$set: {"stato": "libero"}},function(err) {
						if (err)
							res.status(500).json({message: err, status: false});
						else {
							itemProducts++;
							if (itemProducts==prod.articoliId.length) {
								prod.remove(function(err) {
									if (err)
										res.status(500).json({message: err, status: false});
									else {
										res.json({message: "Prod rimosso", status: true});
									}
								})
							}
						}
					});
				});
			} else prod.remove(function(err) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					res.json({message: "Prod rimosso", status: true});
				}
			})
		});
	})

	return router;
};