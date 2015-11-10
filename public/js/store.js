var store = angular.module('store');

store.factory('productFactory', function ($http) {
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/products');
        },
        post : function (product, orderId) {
            return $http.post('http://localhost:8080/api/products/' + orderId, product);
        },
        delete : function (id) {
            return $http.delete('http://localhost:8080/api/products/' + id);
        }
    };
});

store.factory('orderFactory', function ($http){
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/orders');
        },

        getOrder: function(id) {
            return $http.get('http://localhost:8080/api/orders/' + id);
        },
        post : function (order) {
            return $http.post('http://localhost:8080/api/orders/', order);
        },
        delete : function (id) {
            return $http.delete('http://localhost:8080/api/orders/' + id);
        }
    };
});

store.controller('indexController', function ($scope, productFactory,orderFactory) {
    $scope.getProducts = function() {
		productFactory.get()
        	.success(function (data) {
            	$scope.products = data;
            	console.log('Magazzino');
        	})
        	.error(function (data) {
            	console.log('Error: ' + data.message);
        	});
	}
	
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

});

store.controller('productController', function ($scope, productFactory) {
    $scope.getProducts = function() {
		productFactory.get()
			.success(function (data) {
				$scope.products = data;
				console.log('Magazzino');
			})
			.error(function (data) {
				console.log('Error: ' + data.message);
			});
	}
	
    $scope.createProduct = function () {
       productFactory.post($scope.product, $scope.product.orderId)
      		.success(function (data) {
            	$scope.product = {};
            	console.log('Prodotto Aggiunto ');
            })
            .error(function(data) {
            	console.log('Error: ' + data.message);
            }); 
    }
});

store.controller('orderController', function ($scope, orderFactory) {
    
    $scope.getOrders = function () {
        orderFactory.get()
            .success(function (data) {
                $scope.orders = data;
                console.log('Lista Ordini');
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

    $scope.productsList = function (id,nOrdine) {
        orderFactory.getOrder(id)
            .success(function(data) {
                $scope.nOrdine = nOrdine;
                $scope.productIds = data.productIds;
                console.log("ID ORDINE ", id);
                console.log("NUMERO ORDINE ", $scope.nOrdine);
                console.log("PRODUCTSIDS ",	$scope.productIds);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
    


    $scope.createOrder = function () {
        if ($scope.order != undefined) {
            if ($scope.order.numOrdine != null && $scope.order.ddt != null && $scope.order.fornitore != null) {
                orderFactory.post($scope.order)
					.success(function (data) {
						$scope.order = {};
						console.log('Ordine Creato');
						console.log(data);
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
            }else{
                	alert("Compilare tutti i campi");
            }
        }
    }
});

