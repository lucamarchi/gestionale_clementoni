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
	
	$scope.viewStock = function (article) {
		stockFactory.resource().get(
			{id: article.stockId},
			function (resp) {
				console.log(resp);
				$scope.stock = resp.data;
			},
			function(err) {
				console.log(err);
			}
		);
	}
});

	