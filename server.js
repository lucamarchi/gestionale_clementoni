var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Product = require('./app/models/product');
var Order = require('./app/models/order');
var control = require('./app/control/checkval');

mongoose.connect('mongodb://127.0.0.1:27017/db_clementoni');

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
		var check = control.check(req);
		if (check) {
			
			var product = new Product();
			product.matricola = req.body.matricola;
			product.materiale = req.body.materiale;
			product.cop = req.body.cop;
			product.quantita = req.body.quantita;
			product.dimensioni = req.body.dimensioni;
			product.pesokg = req.body.pesokg;
			product.pesoton = req.body.pesoton;
			product.qualita = req.body.qualita;
			product.colore = req.body.colore;
			product.ral = req.body.ral;
			product.note = req.body.note;
			product.finitura = req.body.finitura;

			product.save(function(err) {
				if (err)
					res.send(err);
				
				res.json({message: 'Prodotto creato'});
			});
		} else res.status(500).json({message: 'Dato non valido'});
	})

	.get(function(req,res) {
		Product.find({}, function(err,products) {
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
			
				product.matricola = req.body.matricola;
				product.materiale = req.body.materiale;
				product.cop = req.body.cop;
				product.quantita = req.body.quantita;
				product.dimensioni = req.body.dimensioni;
				product.pesokg = req.body.pesokg;
				product.pesoton = req.body.pesoton;
				product.qualita = req.body.qualita;
				product.colore = req.body.colore;
				product.ral = req.body.ral;
				product.note = req.body.note;
				product.finitura = req.body.finitura;
				
				var check = control.check(req);
				if (check) {						
						product.save(function(err) {
							if (err)
								res.send(err);
							res.json({message: 'Prodotto modificato'});
						});
				} else res.status(500).json({message: 'Dato non valido'});
		});
	})
	.delete(function(req,res) {
		Product.remove({
			_id: req.params.product_id
		}, function(err,product) {
			if (err)
				res.send(err);
			res.json({message: 'Prodotto cancellato'});
		});
	});

// AGGIUNTA DI UN ORDINE POST /api/orders ED VISUALIZZAZIONE ORDINI GET /api/orders


router.route('/orders')
	.post(function(req,res) {
		
			
			var order = new Order();
			order.numOrdine = req.body.numOrdine;
			order.ddt = req.body.ddt;
			order.fornitore = req.body.fornitore;
			order.cTrasporto = req.body.cTrasporto;
			order.cOrdine = req.body.cOrdine;
			order.cTotale = req.body.cTotale;
			for (i in req.body.products)
				order.products.push(i);
			order.save(function(err) {
				if (err)
					res.send(err);
				
				res.json({message: 'Ordine creato'});
			});
		
	})

	.get(function(req,res) {
		Order.find({}, function(err,orders) {
			if (err)
				res.send(err);
			res.json(orders);
		});	
	});



app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);

