var store = angular.module('store');
store.controller('ordiniTaglioController', function ($scope, orderCutFactory) {
    
	$scope.cuts = orderCutFactory.query();
});