var express = require('express');
	
module.exports = function() {

	var router = express.Router();
	var Article = require('./../app/models/article');
		
	router.route('/articles')
		.get(function(req,res) {
			Article.find({}, function(err,articles) {
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

		
	return router;

};