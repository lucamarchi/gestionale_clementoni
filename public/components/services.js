var store = angular.module('store');

//FACTORY
store.factory('productFactory', function ($http) {
    return {
        get : function () {
            return $http.get('http://localhost:8080/api/products');
        },
		
		getProduct: function(id) {
            return $http.get('http://localhost:8080/api/products/' + id);
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