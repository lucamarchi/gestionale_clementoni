var store = angular.module('store');

store.controller('carichiInController', function ($scope, orderFactory, productFactory) {
	orderFactory.get()
		.success(function (data) {
			$scope.orders = data;
			console.log('Lista Ordini');
		})
		.error(function (data) {
			console.log('Error: ' + data.message);
		});

	$scope.openOrder = function (orderId) {
		$scope.order = undefined;
		var productIds, products, nOrder;
		orderFactory.getOrder(orderId)
		.success(function(data) {
			if(data != undefined) {
				productIds = data.productIds;
				nOrder = data.numOrdine;
				products = [];
				for (ids of productIds) {
					productFactory.getProduct(ids)
					.success(function(data) {
						if (data != undefined){
							products.push(data);
						}
					})
					.error(function(data) { 
						console.log('Error' +data.message);
					})
				}
			}
			$scope.orderId = orderId;
			$scope.nOrder = nOrder;
			$scope.productsOrder = products;
			$scope.productsOrder2 = [];
			console.log($scope.order);
		})
		.error(function (data) {
			console.log('Error: ' + data);
		});
	}
	
	$scope.createOrder = function () {
		console.log($scope.order);
		$scope.orderId = undefined;
		$scope.nOrder = $scope.order.numOrdine;
		$scope.productsOrder = [];
		$scope.productsOrder2 = [];
	}
	
	$scope.addProduct = function () {
		$scope.productsOrder.push($scope.product);
		$scope.productsOrder2.push($scope.product);
		delete $scope.product;
	}
	
	$scope.confirmOrder = function () {
		var orderId;
		if($scope.order != undefined) {
			orderFactory.post($scope.order)
				.success(function (data) {
					orderId = data.message;
					console.log('Ordine Creato ', orderId);
					for (product of $scope.productsOrder){
						productFactory.post(product, orderId)
							.success(function (data) {
								console.log(data.message);
							})
							.error(function(data) {
								console.log('Error: ' + data.message);
							}); 
					}
					//settare la data e all'ordine prima di pusharlo nello scope
					$scope.order._id = data.message;
					$scope.orders.push($scope.order);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		}
		else {
			orderId = $scope.orderId;
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