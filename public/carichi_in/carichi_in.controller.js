var store = angular.module('store');

store.controller('carichiInController', function ($scope, orderFactory, productFactory) {

	$scope.getOrders = function () {
		orderFactory.get()
			.success(function (data) {
				$scope.orders = data;
				console.log('Lista Ordini');
			})
			.error(function (data) {
				console.log('Error: ' + data.message);
			});
	}
	
	$scope.getOrders();
	 
	$scope.openOrder = function (order) {
		$scope.order = order;
		var productIds = order.productIds;
		var products = [];
		for (ids of productIds) {
			productFactory.getProduct(ids)
				.success(function(data) {
					if (data != undefined) {
						products.push(data);
					}
				})
				.error(function(data) { 
					console.log('Error' +data.message);
				})
		}
		$scope.productsOrder = products;
		$scope.productsOrder2 = [];
		console.log($scope.order);
	}
	
	$scope.createOrder = function () {
		$scope.order = undefined;
		$scope.productsOrder = [];
		$scope.productsOrder2 = [];
		console.log($scope.order);
	}
	
	
	$scope.createProduct = function () {
		$scope.product = undefined;	
	}
	
	$scope.addProduct = function () {
		$scope.productsOrder.push($scope.product);
		$scope.productsOrder2.push($scope.product);
	}
	
	$scope.confirmOrder = function () {
		var orderId;
		if($scope.order._id == undefined) {
			orderFactory.post($scope.order)
				.success(function (data) {
					orderId = data.message;
					console.log('Ordine Creato ', orderId);
					for (product of $scope.productsOrder2){
						productFactory.post(product, orderId)
						.success(function (data) {
							console.log(data.message);
						})
						.error(function(data) {
							console.log('Error: ' + data.message);
						}); 
					}
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		}
		else {		
			orderId = $scope.order._id;
			for (product of $scope.productsOrder2){
				productFactory.post(product, orderId)
					.success(function (data) {
						console.log(data.message);
					})
					.error(function(data) {
						console.log('Error: ' + data.message);
					}); 
			}
		}
	}
});