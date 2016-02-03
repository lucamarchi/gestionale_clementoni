var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var path = require('path');
var config = require('./config');
var router = express.Router();
var morgan = require('morgan');	

mongoose.connect(config.URIDB);
mongoose.connection.on('error', function() {
	console.log("Mongoose connection error");
});
mongoose.connection.on('open', function(){
	console.log("Mongoose connected to the database");
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('morgan')("dev"));
app.set('superSecret', config.secret);

var port = process.env.PORT || 8080;

router.use(function(req,res,next) {
	next();
});

app.use('/api', require(path.join(__dirname, "routes", "default.js"))());

app.use(function(req,res,next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err,decoded) {
			if (err) {
				return res.status(401).json({success: false, message: 'Failed to authenticate token'});
			} else {
				req.decoded = decoded;
				next();
			}
		});	
	} else {
		return res.status(403).json({
			success: false,
			message: 'No token'
		});
	}
});

app.use('/api', require(path.join(__dirname, "routes", "products.js"))());
app.use('/api', require(path.join(__dirname, "routes", "orders.js"))());
app.use('/api', require(path.join(__dirname, "routes", "stocks.js"))());
app.use('/api', require(path.join(__dirname, "routes", "cuts.js"))());
app.use('/api', router);

app.listen(port);
console.log("Starting server on localhost:" + port + '\n');

