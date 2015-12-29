var store = angular.module('store');
store.controller('magazzinoController', function ($scope, productFactory) {
    
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
	
	$scope.getProducts();
});