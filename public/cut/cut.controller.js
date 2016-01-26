var store = angular.module('store');
store.controller('cutController', function ($scope, cutFactory) {
    
	cutFactory.getAll(
		function (resp) {
			$scope.cuts = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);

	$scope.openCut = function (cut){
		$scope.cut = cut;
		$scope.articlesCut = cut.articoli;
	}
});

	