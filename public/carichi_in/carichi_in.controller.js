var store = angular.module('store');

store.controller('carichiInController', function ($scope, orderFactory, productFactory) {
	
	orderFactory.getAll(
		function (resp) {
			console.log(resp.data);
			$scope.orders = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.order = undefined;
	$scope.productsOrder = [];
	$scope.productsOrder2 = [];

	
	$scope.openProductsOrder = function (order) {
		$scope.productsOrder2 = [];
		orderFactory.get(
			{
				id: order._id
			},
			function (resp) {
				console.log(resp);
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
		console.log($scope.order);
	}
	
	$scope.openOrder = function (order){
		$scope.order = order;
		$scope.productsOrder2 = [];
		
	}
	
	$scope.createProduct = function () {
		$scope.product = undefined;	
	}

	$scope.addProduct = function () {
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
				console.log(resp);
			},
			function(err){
				console.log(err);
			}
		);
	}
		
	$scope.deleteOrder = function (order) {
		orderFactory.delete(
			{
				id:order._id
			},
			function(resp){
				console.log(resp);
			},
			function(err){
				console.log(err);
			}
		);
	}
	
	$scope.deleteProduct = function (product) {
		productFactory.delete(
			{	
				id:product._id
			},
			function(resp){
				console.log(resp);
			},
			function(err){
				console.log(err);
			}
		);
	}
	
	$scope.confirmOrder = function () {
		var order = $scope.order;
		var products = $scope.productsOrder2;
		orderFactory.save({},
			{order, products},
			function(resp){
				console.log(resp);
			},
			function (err){
				console.log(err);
			}
		);
	}
});