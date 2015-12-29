var express = require('express');
var request = require('request');
var URL_AGENTI = 'http://test.agenti.copal.it/api/clienti';

module.exports = function() {
	var router = express.Router();

	router.get('/cuts', function(req,res,timer) {
		request({
			url: URL_AGENTI,
			json: true,
		}, function(error, response, body) {
			if (error) {
				res.json({status: false, message: 'Agenti unreachable'});
			}
			else if (!error && response.statusCode==200) {
				res.json(body.data);
			}
		});
	});
	return router;
};