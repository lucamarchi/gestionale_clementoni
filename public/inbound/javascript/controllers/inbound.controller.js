 function InboundController ($scope, InboundFactory, ExpectedFactory, features) {
	var ctrl = this;
	
    ctrl.inboundModalContent = {
        url:'public/inbound/templates/inbound-expected-selection.html',
        modalTitle: 'Prodotti del carico',
        modalId: 'expectedselection',
        buttonName: 'Inserisci da prodotto ordinato',
        expecteds: [],
    } 
    
    ctrl.getInbounds = function() {
        InboundFactory.getInbounds()
            .then (function (resp) {
                console.log("TUTTI I CARICHI IN ENTRATA" , resp);
                ctrl.inbounds = resp.data.orders;
                ctrl.entryLimit = 10;
                ctrl.currentPage = 1;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
	
    ctrl.getInbounds(); 
     
 }
//	ctrl.expecteds = [];
//	ctrl.order = undefined;
//	ctrl.productsOrder = [];
//	ctrl.productsOrder2 = [];
//	ctrl.selectExpecteds = [];
//	ctrl.features = features;
//	var product2expected = [];
//};
//	ctrl.openProductsOrder = function (order) {
//		ctrl.productsOrder2 = [];
//		ctrl.expecteds = [];
//		product2expected = [];
//		ctrl.selectExpecteds = [];
//		orderFactory.get(
//			{
//				id: order._id
//			},
//			function (resp) {
//				console.log("ORDINE E PRODOTTI" , resp);
//				resp.order.dataDdt = new Date(resp.order.dataDdt);
//				ctrl.order = resp.order;
//				ctrl.productsOrder = resp.products;
//			},
//			function (err) {
//				console.log (err);
//			}
//		);
//	}	
//
//	ctrl.createOrder = function () {
//		ctrl.order = undefined;
//		ctrl.productsOrder = [];
//		ctrl.productsOrder2 = [];
//		ctrl.selectExpecteds = [];
//		ctrl.expecteds = [];
//		product2expected = [];
//	}
//	
//	ctrl.openOrder = function (order){
//		order.dataDdt = new Date(order.dataDdt);
//		ctrl.order = order;
//		ctrl.productsOrder2 = [];
//		ctrl.selectedExpecteds = [];
//		ctrl.expecteds = [];
//	}
//	
//	ctrl.viewExpecteds = function (){
//		if (ctrl.expecteds.length == 0) {
//			expectedFactory.getAll(
//				function (resp) {
//					console.log("TUTTI I CARICHI IN ATTESA" , resp.expected);
//					ctrl.expecteds = resp.expected;
//				},
//				function(err) {
//					console.log(resp);
//				}
//			);
//		}
//	}
//	
//	ctrl.selectExpected = function (expected) {
//		ctrl.expected = expected;
//		ctrl.product = {};
//		ctrl.product.materiale = ctrl.expected.materiale;
//		ctrl.product.qualita = ctrl.expected.qualita;
//		ctrl.product.finitura = ctrl.expected.finitura;
//		ctrl.product.tipo = ctrl.expected.tipo;
//		ctrl.product.spessore = ctrl.expected.spessore;
//		ctrl.product.classeLarghezza = ctrl.expected.larghezza;
//		console.log(expected);
//	}
//	
//	ctrl.createProduct = function () {
//		ctrl.product = undefined;	
//		ctrl.expected = undefined;
//	}
//
//	ctrl.addProduct = function () {
//		if (ctrl.expected) {
//			var element = {};
//			ctrl.product.pesoLordo = ctrl.product.pesoNetto;
//			ctrl.expected.pesoNetto-=ctrl.product.pesoNetto;
//			valuesProduct(ctrl.product);
//			console.log(ctrl.product);
//			if (ctrl.selectExpecteds.indexOf(ctrl.expected) == -1) { 
//				ctrl.selectExpecteds.push(ctrl.expecteds[ctrl.expecteds.indexOf(ctrl.expected)]);
//			}		
//			element.prodPeso = ctrl.product.pesoLordo;
//			element.expInd = ctrl.selectExpecteds.indexOf(ctrl.expected); 
//			product2expected.push(element);
//			console.log("P2E", product2expected);
//		}
//		ctrl.productsOrder.push(ctrl.product);
//		ctrl.productsOrder2.push(ctrl.product);
//	}
//	
//	
//	ctrl.deleteProduct = function (product, index) {
//		if (product._id) {
//			productFactory.delete(
//				{	
//					id:product._id
//				},
//				function(resp){
//					console.log("prodotto", product);
//					console.log("PRODOTTO CANCELLATO INDICE ", index);
//					console.log(resp)
//					ctrl.productsOrder.splice(index,1);
//				},
//				function(err){
//					console.log(err);
//				}
//			);
//		}
//		else {
//			var prodPeso = product2expected[ctrl.productsOrder2.indexOf(product)].prodPeso;
//			var expInd = product2expected[ctrl.productsOrder2.indexOf(product)].expInd;
//			ctrl.selectExpecteds[expInd].pesoNetto += product.pesoNetto;
//			product2expected.splice(ctrl.productsOrder2.indexOf(product),1);
//			console.log(product2expected);
//			ctrl.productsOrder.splice(index,1);
//			ctrl.productsOrder2.splice(index,1);
//		}
//	}
//	
//	ctrl.updateOrder = function (order) {
//		var products = ctrl.productsOrder2;
//		var expected = ctrl.selectExpecteds;
//		orderFactory.update(
//			{
//				id: order._id
//			},
//			{order, products, expected},
//			function(resp){
//				console.log("ORDINE AGGIORNATO" , resp);
//			},
//			function(err){
//				console.log(err);
//			}
//		);
//	}
//		
//	ctrl.deleteOrder = function (order, index) {
//		orderFactory.delete(
//			{
//				id:order._id
//			},
//			function(resp){
//				console.log("ORDINE CANCELLATO INDICE "+index);
//				console.log(resp);
//				ctrl.orders.splice(index,1);
//			},
//			function(err){
//				console.log(err);
//			}
//		);
//	}
//	
//	
//	
//	ctrl.openProduct = function (product) {
//		ctrl.product = product;
//	}
//	
//	ctrl.updateProduct = function () {
//		ctrl.product.pesoLordo = ctrl.product.pesoNetto;
//		valuesProduct(ctrl.product);
//		var product = ctrl.product;
//		console.log(product);
//		if (product._id){
//			productFactory.update(
//				{
//					id: product._id
//				},
//				{product},
//				function(resp){
//					console.log("PRODOTTO AGGIORNATO" , resp);
//
//				},
//				function(err){
//					console.log(err);
//				}
//			);
//		}
//	}
//	
//	ctrl.confirmOrder = function () {
//		var order = ctrl.order;
//		var products = ctrl.productsOrder2;
//		var expected = ctrl.selectExpecteds;
//		console.log("Cosa ti mando: ", order, products, expected);
//		orderFactory.save({},
//			{order, products, expected},
//			function(resp){
//				console.log("ORDINE CONFERMATO ", resp);
//				ctrl.orders.push(resp.order);
//			},
//			function (err){
//				console.log(err);
//			}
//		);
//	}
//	
//	ctrl.prepareDeleteProduct = function (product, index){
//		ctrl.order = undefined;
//		ctrl.product = product;
//		ctrl.index = index;
//	}
//	
//	ctrl.prepareDeleteOrder = function (order, index){
//		ctrl.product = undefined;
//		order.dataDdt = new Date(order.dataDdt);
//		ctrl.order = order;
//		ctrl.index = index;
//	}
//}]);

angular.module('store')
    .controller('InboundController', ['$scope', 'InboundFactory','ExpectedFactory','features', InboundController]);