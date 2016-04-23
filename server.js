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

var db_name = "plimco";
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    console.log('mongo cè');
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}
mongoose.connect(mongodb_connection_string);

mongoose.connection.on('error', function(error) {
	console.log("Mongoose connection error", error);
});
mongoose.connection.on('open', function(){
	console.log("Mongoose connected to the database");
});

app.get('/', function(req, res, next) {
    var options = {
        root: __dirname
    };
    res.sendFile('index.html', options, function(err){});
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('morgan')("dev"));
app.set('superSecret', config.secret);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(function(req,res,next) {
	next();
});

app.use('/api', require(path.join(__dirname, "routes", "default.js"))());

app.use('/api', function(req,res,next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log("Token is: "+token);
	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err,decoded) {
			if (err) {
				return res.status(401).json({success: false, message: 'Failed to authenticate token'});
			} else {
				console.log("Token verify")
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
app.use('/api', require(path.join(__dirname, "routes", "prods.js"))());
app.use('/api', require(path.join(__dirname, "routes", "articles.js"))());
app.use('/api', require(path.join(__dirname, "routes", "processes.js"))());
app.use('/api', require(path.join(__dirname, "routes", "customers.js"))());

app.use('/api', router);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
	console.log( "Listening on " + server_ip_address + ", server_port " + server_port)
});

console.log("Starting server on localhost:" + server_port + '\n');