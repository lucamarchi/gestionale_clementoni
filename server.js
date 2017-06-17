var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var config_database = require('./server/configs/database');
var config_token = require('./server/configs/token');

var mongodb_connection_string = config_database.url + config_database.db_name;

if(process.env.OPENSHIFT_MONGODB_DB_URL) {
    console.log('Database connected');
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + config_database.db_name;
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
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use(function(req,res,next) {
	next();
});

require('./server/routes.js')(app, express);
app.set('superSecret', config_token.secret);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
	console.log( "Listening on " + server_ip_address + ", server_port " + server_port)
});

console.log("Starting server on localhost:" + server_port + '\n');