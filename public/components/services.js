var store = angular.module('store');

store.factory('productFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/products/:product',{product: "@product"}, {
		update:{method:'PUT'}
  	});
	return resource;
});

store.factory('orderFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/orders/:order',{order: "@order"}, {
		update:{method:'PUT'}
  	});
	return resource;
});

store.factory('orderCutFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/cuts/:cuts',{cut: "@cut"}, {
		update:{method:'PUT'}
  	});
	return resource;
});