var store = angular.module('store');
store.controller('cutController', function ($scope, cutFactory, $window) {
    
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
	
	$scope.confirmCut = function (cut) {
		var user = $window.sessionStorage.user;
		console.log(user);
		cutFactory.update( 
			{id : cut._id},
			{operator : user},
			function(resp) {
				console.log(resp);
			},
			function(err) {
				console.log(err);
			}
		);
	}
});

	