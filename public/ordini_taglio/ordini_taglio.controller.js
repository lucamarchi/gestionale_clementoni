var store = angular.module('store');
store.controller('ordiniTaglioController', function ($scope, orderCutFactory) {
    
	$scope.getCuts = function() { 
		orderCutFactory.get()
			.success(function (data) {
				$scope.cuts = data;
				console.log('Ordini di taglio');
			})
			.error(function (data) {
				console.log('Error: ' + data.message);
			});
	}
	
	$scope.getCuts();
});