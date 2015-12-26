var store = angular.module('store');
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