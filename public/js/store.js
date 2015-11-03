var store = angular.module('store');

store.factory('productFactory', function ($http) {
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/products');
        },
        post : function (product) {
            return $http.post('http://localhost:8080/api/products/', product);
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
            console.log(data.message);
        })
        .error(function (data) {
            console.log('Error: ' + data.message);
        });

    $scope.createProduct = function () {
        productFactory.post($scope.product)
            .success(function (data) {
            $scope.product = {};
            console.log('YEAH');
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
            console.log('YEAH ');
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    $scope.createOrder = function () {
        orderFactory.post($scope.order)
            .success(function (data) {
                $scope.order = {};
                console.log('YEAH');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            }); 
    };
});


/*store.controller("panelController", ['$scope', function($scope){
$scope.tab = 1

$scope.selectTab = function(setTab) {
  $scope.tab = setTab;
};

$scope.isSelected = function(checkTab){
  return $scope.tab === checkTab;
};
}]);*/

