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
			$scope.nOrder = nOrder;
			$scope.productsOrder = products;
		})
		.error(function (data) {
			console.log('Error: ' + data);
		});
	}
	
	$scope.createOrder = function () {
		$scope.nOrder = $scope.order.numOrdine;
		$scope.productsOrder = [];
	}
	
	$scope.addProduct = function () {
		$scope.productsOrder.push($scope.product);
	}
	
	$scope.confirmOrder = function (){
		orderFactory.post($scope.order)
			.success(function (data) {
				var order_Id = data.message;
				console.log('Ordine Creato ', order_Id);
				for (product of $scope.productsOrder){
					productFactory.post(product, order_Id)
					.success(function (data) {
						console.log(data.message);
					})
					.error(function(data) {
						console.log('Error: ' + data.message);
					}); 
				}
				//settare la data all'ordine prima di pusharlo nello scope
				$scope.orders.push($scope.order);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	}
});