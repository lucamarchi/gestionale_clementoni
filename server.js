var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Product = require('./app/models/product');

mongoose.connect('mongodb://127.0.0.1:27017/my_database');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req,res,next) {
	console.log('Something is happening.');
	next();
})

router.get('/', function(req,res) {
	res.json({message: 'Welcome to my API!'});
});

// AGGIUNTA DI UN PRODOTTO POST /api/products ED VISUALIZZAZIONE PRODOTTI GET /api/products

router.route('/products')
	.post(function(req,res) {
		var product = new Product();
		product.name = req.body.name;

		product.save(function(err) {
			if (err)
				res.send(err);
			
			res.json({message: 'Product created!'});
		});
	})
	.get(function(req,res) {
		Product.find(function(err,products) {
			if (err)
				res.send(err);
			res.json(products);
		});	
	});

// MODIFICA DI UN PRODOTTO PUT /api/products/:product_id, RIMOZIONE DI UN PRODOTTO DELETE /api/products/:product_id E VISUALIZZAZIONE PRODOTTO GET /api/products/:product_id

router.route('/products/:product_id')
	.get(function(req,res) {
		Product.findById(req.params.product_id, function(err,product) {
			if (err)
				res.send(err);
			res.json(product)
		});
	})
	.put(function(req,res) {
		Product.findById(req.params.product_id, function(err,product) {
			if (err)
				res.send(err)

			product.name = req.body.name;

			product.save(function(err) {
				if (err)
					res.send(err);
				res.json({message: 'Product updated!'});
			});
		});
	})
	.delete(function(req,res) {
		Product.remove({
			_id: req.params.product_id
		}, function(err,product) {
			if (err)
				res.send(err);
			res.json({message: 'Product removed!'});
		});
	});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);

