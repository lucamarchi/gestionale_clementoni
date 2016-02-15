var store = angular.module('store');
store.controller('cutController', function ($scope, cutFactory, refreshFactory, $window) {
    
	cutFactory.getAll(
		function (resp) {
			$scope.cuts = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.refresh = function (){
		refreshFactory.refresh(
			function (resp) {
				if (resp.data != undefined) {
					$scope.cuts = $scope.cuts.concat(resp.data);
				}
			},
			function(err) {
				console.log(resp);
			}
		);
	};
	
	$scope.openCut = function (cut){
		$scope.cut = cut;
		$scope.articlesCut = cut.articoli;
	};
	
	$scope.confirmCut = function (cut) {
		var user = $window.sessionStorage.user;
		console.log(user);
		cutFactory.update( 
			{id : cut._id},
			{operator : user},
			function(resp) {
				console.log(resp);
				cut.operator = user;
				cut.accepted = true;
			},
			function(err) {
				console.log(err);
			}
		);
	}
});

	