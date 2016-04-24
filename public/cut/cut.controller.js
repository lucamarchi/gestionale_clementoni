var store = angular.module('store');
store.controller('cutController', ['$scope', 'cutFactory', 'refreshFactory', 'UserService', function ($scope, cutFactory, refreshFactory, UserService) {
    
	cutFactory.getAll(
		function (resp) {
			$scope.cuts = resp.data;
			console.log("TUTTI GLI ORDINI DI TAGLIO ",resp.data);
			$scope.totalItems = $scope.cuts.length;
			$scope.entryLimit = 50;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
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
	
	$scope.openArticlesCut = function (cut){
		cutFactory.get(
			{
				id: cut._id
			},
			function (resp) {
				console.log("TAGLIO E ARTICOLI" , resp);
				$scope.cut = resp.cut;
				$scope.articlesCut = resp.articoli;
				$scope.customer = resp.customer;
			},
			function (err) {
				console.log (err);
			}
		);
	};
	
	$scope.confirmCut = function (cut) {
		var user = UserService.getUser();
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
}]);

	