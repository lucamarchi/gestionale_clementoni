var store = angular.module('store');

store.controller('carichiInController', ['$scope', 'orderFactory', 'productFactory','expectedFactory','features', function ($scope, orderFactory, productFactory, expectedFactory,features) {
	
	orderFactory.getAll(
		function (resp) {
			console.log("TUTTI I CARICHI IN ENTRATA" , resp.orders);
			$scope.orders = resp.orders;
			$scope.totalItems = $scope.orders.length;
			$scope.entryLimit = 10;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.expecteds = [];
	$scope.order = undefined;
	$scope.productsOrder = [];
	$scope.productsOrder2 = [];
	$scope.selectExpecteds = [];
	$scope.features = features;
	var product2expected = [];
	
	$scope.openProductsOrder = function (order) {
		$scope.productsOrder2 = [];
		$scope.expecteds = [];
		product2expected = [];
		$scope.selectExpecteds = [];
		orderFactory.get(
			{
				id: order._id
			},
			function (resp) {
				console.log("ORDINE E PRODOTTI" , resp);
				resp.order.dataDdt = new Date(resp.order.dataDdt);
				$scope.order = resp.order;
				$scope.productsOrder = resp.products;
			},
			function (err) {
				console.log (err);
			}
		);
	}	

	$scope.createOrder = function () {
		$scope.order = undefined;
		$scope.productsOrder = [];
		$scope.productsOrder2 = [];
		$scope.selectExpecteds = [];
		$scope.expecteds = [];
		product2expected = [];
	}
	
	$scope.openOrder = function (order){
		order.dataDdt = new Date(order.dataDdt);
		$scope.order = order;
		$scope.productsOrder2 = [];
		$scope.selectedExpecteds = [];
		$scope.expecteds = [];
	}
	
	$scope.viewExpecteds = function (){
		if ($scope.expecteds.length == 0) {
			expectedFactory.getAll(
				function (resp) {
					console.log("TUTTI I CARICHI IN ATTESA" , resp.expected);
					$scope.expecteds = resp.expected;
				},
				function(err) {
					console.log(resp);
				}
			);
		}
	}
	
	$scope.selectExpected = function (expected) {
		$scope.expected = expected;
		$scope.product = {};
		$scope.product.materiale = $scope.expected.materiale;
		$scope.product.qualita = $scope.expected.qualita;
		$scope.product.finitura = $scope.expected.finitura;
		$scope.product.tipo = $scope.expected.tipo;
		$scope.product.spessore = $scope.expected.spessore;
		$scope.product.classeLarghezza = $scope.expected.larghezza;
		console.log(expected);
	}
	
	$scope.createProduct = function () {
		$scope.product = undefined;	
		$scope.expected = undefined;
	}

	$scope.addProduct = function () {
		if ($scope.expected) {
			var element = {};
			$scope.product.pesoLordo = $scope.product.pesoNetto;
			$scope.expected.pesoNetto-=$scope.product.pesoNetto;
			valuesProduct($scope.product);
			console.log($scope.product);
			if ($scope.selectExpecteds.indexOf($scope.expected) == -1) { 
				$scope.selectExpecteds.push($scope.expecteds[$scope.expecteds.indexOf($scope.expected)]);
			}		
			element.prodPeso = $scope.product.pesoLordo;
			element.expInd = $scope.selectExpecteds.indexOf($scope.expected); 
			product2expected.push(element);
			console.log("P2E", product2expected);
		}
		$scope.productsOrder.push($scope.product);
		$scope.productsOrder2.push($scope.product);
	}
	
	
	$scope.deleteProduct = function (product, index) {
		if (product._id) {
			productFactory.delete(
				{	
					id:product._id
				},
				function(resp){
					console.log("prodotto", product);
					console.log("PRODOTTO CANCELLATO INDICE ", index);
					console.log(resp)
					$scope.productsOrder.splice(index,1);
				},
				function(err){
					console.log(err);
				}
			);
		}
		else {
			var prodPeso = product2expected[$scope.productsOrder2.indexOf(product)].prodPeso;
			var expInd = product2expected[$scope.productsOrder2.indexOf(product)].expInd;
			$scope.selectExpecteds[expInd].pesoNetto += product.pesoNetto;
			product2expected.splice($scope.productsOrder2.indexOf(product),1);
			console.log(product2expected);
			$scope.productsOrder.splice(index,1);
			$scope.productsOrder2.splice(index,1);
		}
	}
	
	$scope.updateOrder = function (order) {
		var products = $scope.productsOrder2;
		var expected = $scope.selectExpecteds;
		orderFactory.update(
			{
				id: order._id
			},
			{order, products, expected},
			function(resp){
				console.log("ORDINE AGGIORNATO" , resp);
			},
			function(err){
				console.log(err);
			}
		);
	}
		
	$scope.deleteOrder = function (order, index) {
		orderFactory.delete(
			{
				id:order._id
			},
			function(resp){
				console.log("ORDINE CANCELLATO INDICE "+index);
				console.log(resp);
				$scope.orders.splice(index,1);
			},
			function(err){
				console.log(err);
			}
		);
	}
	
	
	
	$scope.openProduct = function (product) {
		$scope.product = product;
	}
	
	$scope.updateProduct = function () {
		$scope.product.pesoLordo = $scope.product.pesoNetto;
		valuesProduct($scope.product);
		var product = $scope.product;
		console.log(product);
		if (product._id){
			productFactory.update(
				{
					id: product._id
				},
				{product},
				function(resp){
					console.log("PRODOTTO AGGIORNATO" , resp);

				},
				function(err){
					console.log(err);
				}
			);
		}
	}
	
	$scope.confirmOrder = function () {
		var order = $scope.order;
		var products = $scope.productsOrder2;
		var expected = $scope.selectExpecteds;
		console.log("Cosa ti mando: ", order, products, expected);
		orderFactory.save({},
			{order, products, expected},
			function(resp){
				console.log("ORDINE CONFERMATO ", resp);
				$scope.orders.push(resp.order);
			},
			function (err){
				console.log(err);
			}
		);
	}
	
	$scope.prepareDeleteProduct = function (product, index){
		$scope.order = undefined;
		$scope.product = product;
		$scope.index = index;
	}
	
	$scope.prepareDeleteOrder = function (order, index){
		$scope.product = undefined;
		order.dataDdt = new Date(order.dataDdt);
		$scope.order = order;
		$scope.index = index;
	}
}]);