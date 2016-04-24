var express = require('express');

module.exports = function() {
	var router = express.Router();
	var User = require('./../app/models/user');
	var jwt = require('jsonwebtoken');
	var config = require('./../config');

	router.post('/setup', function(req,res) {
		var user = new User()
		user.username = req.body.username;
		user.password = user.generateHash(req.body.password)
		user.role = 'user'
		user.save(function(err) {
			if (err)
				res.status(500).json({status: false, message: 'Errore: ' + err});
			console.log("User saved!");
			res.json({status: true, message: 'User created'});
		});
	});

	router.post('/authenticate', function(req,res) {
		User.findOne({
			username: req.body.username,
		}, function(err,user) {
			if (err)
				res.status(500).json({status: false, message: 'Errore: '+ err});
			if (!user) {
				console.log("User not found")
				res.status(401).json({status: false, message: 'Authentication failed, user not found'});
			} else if (user) {
				if (user.comparePassword(req.body.password)) {
            		console.log("User authenticated: "+ user.comparePassword(req.body.password));
            		var token = jwt.sign({user: user}, config.secret, {expiresIn: '24h'});
            		console.log('Token ok: '+token);
					res.json({
						status: true,
						token: token,
						message: 'Token generated'
					});
				} else {
					console.log("User not authenticated ");
            		res.status(401).json({status: false, message: 'Password not valid'});
				}
        	}
		});
	});

	router.post('/verify', function(req,res) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, config.secret, function(err,decoded) {
				if (err) {
					return res.json({status: false, message: 'Failed to authenticate token'});
				} else {
					return res.json({status: true, message: 'Token valid'});
				}
			});	
		} else {
			return res.status(403).json({
				status: false,
				message: 'No token'
			});
		}
	});

	return router;
};