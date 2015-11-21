var store = angular.module('store');

//MAGAZZINO.HTML
store.controller('magazzinoController', function ($scope, productFactory) {
    
		productFactory.get()
        	.success(function (data) {
            	$scope.products = data;
            	console.log('Magazzino');
        	})
        	.error(function (data) {
            	console.log('Error: ' + data.message);
        	});
});

//CARICHIIN.HTML
store.controller('carichiInController', function ($scope, orderFactory) {
        orderFactory.get()
            .success(function (data) {
                $scope.orders = data;
                console.log('Lista Ordini');
            })
            .error(function (data) {
                console.log('Error: ' + data.message);
            });
});


//NEWORDER.HTML
store.controller('orderController', function ($scope, $rootScope, orderFactory) {
	console.log('Crea Ordine');
	$scope.createOrder = function () {	
		$rootScope.order = $scope.order;
		$rootScope.products = [];
	}
});
    
//ORDERPRODUCTS.HTML
store.controller('orderProductsController', function ($scope,$rootScope, $state, $stateParams, orderFactory, productFactory) {
	var productIds;
	var products;
	if ($stateParams.orderId != undefined) {
		$scope.nOrdine = $stateParams.nOrdine;
		orderFactory.getOrder($stateParams.orderId)
			.success(function(data) {
				if(data != undefined) {
					productIds = data.productIds;
					var products = [];
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
					$scope.productsOrder = products;
					console.log("PRODUCTSORDER ", $scope.productsOrder);
					console.log("PRODUCTSORDER ", products);
				}
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	}
	else {
		$scope.order = $rootScope.order;
		$scope.nOrdine = $rootScope.order.numOrdine;
		$scope.productsOrder = $rootScope.products;
	}
	
	$scope.confirmOrder = function (){
		orderFactory.post($scope.order)
			.success(function (data) {
				var order_Id = data.message;
				console.log('Ordine Creato ', order_Id);
				for (product of $scope.productsOrder){
					console.log('Prodotto', product);
					productFactory.post(product, order_Id)
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
	console.log("ID ORDINE ", $stateParams.orderId);
	console.log("NUMERO ORDINE ", $scope.nOrdine);
});


//NEWPRODUCT.HTML
store.controller('productController', function ($scope, $rootScope, productFactory) {
	console.log('Aggiungi Prodotto ordine');
	$scope.addProduct = function () {
		$rootScope.products.push($scope.product);
	}
})