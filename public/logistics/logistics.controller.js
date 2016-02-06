store.controller('logisticsController', function ($scope, logisticsFactory) {
	
	logisticsFactory.getAll(
		function (resp) {
			console.log("TUTTI GLI ARTICOLI CONFERMATI" , resp.data);
			$scope.articles = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);

	$scope.state = undefined;
	$scope.articlesState = [];
	$scope.articlesState2 = [];
	
	$scope.addArticle = function (article, index) {
		$scope.articlesState.push(article);
		$scope.articlesState2.push(article);
		var a = $scope.articles.splice(index,1);
		console.log("aaa",a);
	}



});

	