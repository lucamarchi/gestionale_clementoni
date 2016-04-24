store.controller('productionController', ['$scope', 'articleFactory', 'stockFactory','processFactory', function ($scope, articleFactory, stockFactory, processFactory) {
	
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
	
	$scope.viewArticleProcesses = function (article) {
		processFactory.resourceArticle().get(
			{
				id:article._id	
			},
			function (resp) {
				$scope.articleProcesses = resp.data;
				console.log("TUTTE LE LAVORAZIONI", resp.data);
			},
			function (err) {
				console.log(resp);
			}
		);
	}
	
	$scope.viewArticleCustomer = function (article) {
		articleFactory.resourceCustomer().get(
			{
				id:article.clienteCod
			},
			function (resp) {
				$scope.customer = resp.data;
				console.log("CLIENTE ARTICOLO", resp.data);
			},
			function (err) {
				console.log(resp);
			} 
		);
	}
}]);

	