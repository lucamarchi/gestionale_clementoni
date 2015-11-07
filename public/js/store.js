var store = angular.module('store');

store.factory('productFactory', function ($http) {
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/products');
        },
        post : function (product,orderId) {
            return $http.post('http://localhost:8080/api/products/:orderId', product, orderId);
        },
        delete : function (id) {
            return $http.delete('http://localhost:8080/api/products/' + id);
        }
    };
});

store.controller('productController', function ($scope, productFactory) {
    $scope.product = {orderId : "563655bb04d67032fff2c969"};
    productFactory.get()
        .success(function (data) {
            $scope.products = data;
            console.log('Lista prodotti ordine');
        })
        .error(function (data) {
            console.log('Error: ' + data.message);
        });

    $scope.createProduct = function () {
        $scope.orderId = "563655bb04d67032fff2c969";
        productFactory.post($scope.product, $scope.orderId)
            .success(function (data) {
            $scope.product = {};
            console.log('Prodotto Aggiunto ');
            })
            .error(function(data) {
            console.log('Error: ' + data);
            }); 
    }
});

store.factory('orderFactory', function($http){
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/orders');
        },
        post : function (order) {
            return $http.post('http://localhost:8080/api/orders/', order);
        },
        delete : function (id) {
            return $http.delete('http://localhost:8080/api/orders/' + id);
        }
    };
});


store.controller('orderController', function ($scope, orderFactory) {
    $scope.order = {};
    orderFactory.get()
        .success(function (data) {
            $scope.orders = data;
            console.log('Lista Ordini');
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

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

