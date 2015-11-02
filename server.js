var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Product = require('./app/models/product');
var Order = require('./app/models/order');
var controlPrd = require('./app/control/checkvalprd');
var controlOrd = require('./app/control/checkvalord');

mongoose.connect('mongodb://127.0.0.1:27017/db_clementoni');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req,res,next) {
	console.log('Starting...');
	next();
})

router.get('/', function(req,res) {
	res.json({message: 'Gestionale Clementoni API!'});
});

// AGGIUNTA DI UN PRODOTTO POST /api/products/:order_id

router.route('/products/:order_id')
	.post(function(req,res) {
		var check = controlPrd.check(req);
		console.log('Check status product %s',check + '\n');
		if (check && req.params.order_id!=null) {
			
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
			product.orderId = req.params.order_id;
			console.log(JSON.stringify(product,null,4) +'\n');
			product.save(function(err) {
				if (err)
					res.send(err);
			});
			Order.findById(req.params.order_id, function(err,order) {
					if (err) {
						console.log('Ordine non trovato \n');
						res.send.err;
					}
					else {
						order.productIds.push(product);
						order.save(function(err) {
							if (err) {
								console.log(JSON.stringify(order,null,4) +'\n');
								return res.send(err);}
						});
					}
				});
			res.json({message: 'Prodotto inserito nell ordine'});
			console.log('Prodotto inserito \n');
		} else res.status(500).json({message: 'Dato non valido,post'});
	});

// VISUALIZZAZIONE PRODOTTI GET /api/products

router.route('/products')
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
			else {
				console.log(JSON.stringify(product,null,4) +'\n');
				res.json(product)}
		});
	})
	.put(function(req,res) {
		Product.findById(req.params.product_id, function(err,product) {
			if (err)
				res.send(err)
				if (req.body.matricola)
					product.matricola = req.body.matricola;
				if (req.body.materiale)
					product.materiale = req.body.materiale;
				if (req.body.cop)
					product.cop = req.body.cop;
				if (req.body.quantita)
					product.quantita = req.body.quantita;
				if (req.body.dimensioni)
					product.dimensioni = req.body.dimensioni;
				if (req.body.pesokg)
					product.pesokg = req.body.pesokg;
				if (req.body.pesoton)
					product.pesoton = req.body.pesoton;
				if (req.body.qualita)
					product.qualita = req.body.qualita;
				if (req.body.colore)
					product.colore = req.body.colore;
				if (req.body.ral)
					product.ral = req.body.ral;
				if (req.body.note)
					product.note = req.body.note;
				if (req.body.finitura)
					product.finitura = req.body.finitura;
				product.save(function(err) {
							if (err) {
								console.log('Errore, dati non validi');
								res.send(err);
							}
							else {
								res.json({message: 'Prodotto modificato'});
								console.log(JSON.stringify(product,null,4) +'\n');}

						});
		});
	})
	.delete(function(req,res) {
		Product.remove({
			_id: req.params.product_id
		}, function(err,product) {
			if (err) {
				console.log('Errore');
				res.send(err);
			}
			else {
				res.json({message: 'Prodotto cancellato'});
				console.log(JSON.stringify(product,null,4) +'\n');}
		});
	});


// AGGIUNTA DI UN ORDINE POST /api/orders ED VISUALIZZAZIONE ORDINI GET /api/orders

router.route('/orders')
	.post(function(req,res) {
		var check = controlOrd.check(req);
		console.log('Check order status %s', check);
		if (check) {			
			var order = new Order();
			order.numOrdine = req.body.numOrdine;
			order.ddt = req.body.ddt;
			order.fornitore = req.body.fornitore;
			order.cTrasporto = req.body.cTrasporto;
			order.cOrdine = req.body.cOrdine;
			order.cTotale = req.body.cTotale;
			order.save(function(err) {
				if (err)
					res.send(err);
				else {
					console.log('Ordine inserito');
					console.log(JSON.stringify(order,null,4));
					res.json({message: JSON.stringify(order._id,null,4)});}
			});
		} else res.status(500).json({message: 'Dato non valido (ordine)'});
	})

	.get(function(req,res) {
		Order.find({}, function(err,orders) {
			if (err)
				res.send(err);
			console.log('GET number orders %s', orders.length + '\n');
			res.json(orders);
		});	
	});

// MODIFICA DI UN ORDINE PUT /api/ordine/:ordine_id, RIMOZIONE DI UN ORDINE DELETE /api/orders/:order_id E VISUALIZZAZIONE ORDINE GET /api/orders/:order_id

router.route('/orders/:order_id')
	.get(function(req,res) {
		Order.findById(req.params.order_id, function(err,order) {
			if (err)
				res.send(err);
			else {
				console.log(JSON.stringify(order,null,4) +'\n');
				res.json(order)}
		});
	})
	.put(function(req,res) {
		Order.findById(req.params.order_id, function(err,order) {
			if (err)
				res.send(err)
				if (req.body.numOrdine)
					order.numOrdine = req.body.numOrdine;
				if (req.body.ddt)
					order.ddt = req.body.ddt;
				if (req.body.fornitore)
					order.fornitore = req.body.fornitore;
				if (req.body.cTrasporto)
					order.cTrasporto = req.body.cTrasporto;
				if (req.body.cOrdine)
					order.cOrdine = req.body.cOrdine;
				if (req.body.cTotale)
					order.cTotale = req.body.cTotale;
			
				order.save(function(err) {
							if (err) {
								console.log('Errore, dati non validi (ordine,put');
								res.send(err);
							}
							else {
								res.json({message: 'Ordine modificato'});
								console.log(JSON.stringify(order,null,4) +'\n');}

						});
		});
	})
	.delete(function(req,res) {
		Order.remove({
			_id: req.params.order_id
		}, function(err,order) {
			if (err) {
				console.log('Errore');
				res.send(err);
			}
			else {
				res.json({message: 'Ordine cancellato'});
				console.log(JSON.stringify(order,null,4) +'\n');}
		});
	});



app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port + '\n');

