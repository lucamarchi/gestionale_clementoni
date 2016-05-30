store.controller('productionController', ['$scope', 'articleFactory', 'stockFactory','processFactory','features', function ($scope, articleFactory, stockFactory, processFactory,features) {
	
	$scope.riepilogo = true;
	
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
	
	$scope.features = features;
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
				$scope.articleProcesses = resp.processes;
				console.log("TUTTE LE LAVORAZIONI", resp.processes);
			},
			function (err) {
				console.log(resp);
			}
		);
	}
	
	$scope.viewChildrenProcess = function (process) {
		processFactory.resourceChildren().get(
			{
				id:process._id
			},
			function (resp) {
				$scope.children = resp.figli;
				console.log("TUTTI I FIGLI DELLA LAVORAZIONE", resp);
			},
			function (err) {
				console.log(resp);
			}
		)
		
	}
	
	$scope.viewArticleCustomer = function (article) {
		articleFactory.resourceCustomer().get(
			{
				id:article.clienteCod
			},
			function (resp) {
				$scope.customer = resp.data;
				console.log("CLIENTE ARTICOLO", resp);
			},
			function (err) {
				console.log(resp);
			} 
		);
	}
}]);

	