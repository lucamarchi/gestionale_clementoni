var store = angular.module('store');

store.controller('carichiInController', function ($scope, orderFactory, productFactory) {

	$scope.orders = orderFactory.query();
	$scope.order = undefined;
	$scope.productsOrder = [];
	$scope.productsOrder2 = [];

	$scope.openProductsOrder = function (order) {
		$scope.order = order;
		var productIds = order.productIds;
		var products = [];
		for (ids of productIds) {
			productFactory.get({
				product:ids
				},
				function(resp){
					products.push(resp);
					console.log(resp);
				},
				function(err){
					console.log(err);
				}
			);
		}
		$scope.productsOrder = products;
		$scope.productsOrder2 = [];
	}
	
	$scope.createOrder = function () {
		$scope.order = undefined;
		$scope.productsOrder = [];
		$scope.productsOrder2 = [];
		console.log($scope.order);
	}
	
	$scope.openOrder = function (order){
		$scope.order = order;
	}
	
	$scope.createProduct = function () {
		$scope.product = undefined;	
	}
	
	$scope.addProduct = function () {
		$scope.productsOrder.push($scope.product);
		$scope.productsOrder2.push($scope.product);
	}
	
	$scope.updateOrder = function (order) {
		orderFactory.update({
			order:order._id
			},
			order,
			function(resp){
				console.log(resp);
			},
			function(err){
				console.log(err);
			}
		);
	}
		
	$scope.deleteOrder = function (id) {
		orderFactory.delete({
			order:id
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
		var orderId;
		if($scope.order._id == undefined) {
			orderFactory.save({
				},
				$scope.order,
				function(resp){
					orderId = resp.message;
					console.log(resp);
					for (product of $scope.productsOrder2){
						productFactory.save({
							product:orderId
							},
							product,
							function(resp){
								console.log(resp);
							},
							function(err){
								console.log(err);
							}
						)
					}
				},
				function(err){
					console.log(err);
				}
			)
		}
		else {
			orderId = $scope.order._id;
			for (product of $scope.productsOrder2){
				productFactory.save({
					product:orderId
					},
					product,
					function(resp){
						console.log(resp);
					},
					function(err){
						console.log(err);
					}
				)
			}
		} 
	}

});