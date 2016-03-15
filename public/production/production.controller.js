store.controller('productionController', function ($scope, articleFactory, stockFactory) {
	
	articleFactory.resourceState().getAll(
		function (resp) {
			console.log("TUTTI GLI ARTICOLI CONFERMATI" , resp.data);
			$scope.articles = resp.data;
			$scope.totalItems = $scope.articles.length;
			$scope.entryLimit = 100;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
		},
		function(err) {
			console.log(resp);
		}
	);
});

	