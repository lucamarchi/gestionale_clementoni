var store = angular.module('store');
store.controller('ordiniTaglioController', function ($scope, cutFactory) {
    
	cutFactory.getAll(
		function (resp) {
			console.log(resp.data);
			$scope.cuts = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);
});