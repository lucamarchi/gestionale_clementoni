var store = angular.module('store');

store.controller('carichiInController', ['$scope', 'orderFactory', 'productFactory','features', function ($scope, orderFactory, productFactory, features) {
	
	orderFactory.getAll(
		function (resp) {
			console.log("TUTTI I CARICHI IN ENTRATA" , resp.data);
			$scope.orders = resp.data;
			$scope.totalItems = $scope.orders.length;
			$scope.entryLimit = 10;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.order = undefined;
	$scope.productsOrder = [];
	$scope.productsOrder2 = [];
	$scope.features = features;
	console.log($scope.features);

	
	$scope.openProductsOrder = function (order) {
		$scope.productsOrder2 = [];
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
	}
	
	$scope.openOrder = function (order){
		order.dataDdt = new Date(order.dataDdt);
		$scope.order = order;
		$scope.productsOrder2 = [];
	}
	
	$scope.createProduct = function () {
		$scope.product = undefined;	
	}

	$scope.addProduct = function () {
		$scope.product.pesoLordo = $scope.product.pesoNetto;
		valuesProduct($scope.product);
		console.log($scope.product);
		$scope.productsOrder.push($scope.product);
		$scope.productsOrder2.push($scope.product);
	}
	
	$scope.updateOrder = function (order) {
		var products = $scope.productsOrder2;
		orderFactory.update(
			{
				id: order._id
			},
			{order, products},
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
			$scope.productsOrder.splice(index,1);
			$scope.productsOrder2.splice(index,1);
			
		}
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
		orderFactory.save({},
			{order, products},
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