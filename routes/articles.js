var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Article = require('./../app/models/article');
	var Customer = require('./../app/models/customer');
		
	router.route('/articles')
		.get(function(req,res) {
			Article.find({stato: {$exists: true}}, function(err,articles) {
				if (err)
					res.status(500).json({message: err, status: false});
				res.json({data: articles, status: true});
			});	
		});

	router.route('/articles/:status')
		.get(function(req,res) {
			Article.find({stato: req.params.status}, function(err,product) {
				if (err)
					res.status(500).json({message: err, status: false});
				else res.json({data: product, status: true});
			});
		});

	router.route('/articles/stock/:article_id')
		.put(function(req,res) {
			Article.update({_id: req.params.article_id},{$set: {"stockId": req.body.stock._id}}, function(err,article) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					res.json({data: article, status: true});
				}
			});
		});

	router.route('/articles/complete/:article_id')
		.put(function(req,res) {
			Article.update({_id: req.params.article_id},{$set: {"stato": "completato"}},{$unset: {"stockId": ""}},function(err) {
				if (err)
					res.status(500).json({message: err, status: false});
				else {
					res.json({message: "Article completato", status: true});
				}
			});
		});
		
	return router;

};