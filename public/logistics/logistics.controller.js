store.controller('logisticsController', function ($scope, logisticsFactory) {
	
	$scope.state = undefined;
	$scope.articles = [];
	$scope.articlesState = [];
	$scope.articlesState2 = [];
	
	logisticsFactory.getAll(
		function (resp) {
			console.log("TUTTI GLI ARTICOLI CONFERMATI" , resp.data);
			$scope.articles = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);

	$scope.addArticle = function (article, index) {
		$scope.articlesState.push(article);
//		$scope.articlesState2.push(article);
		$scope.articles.splice(index,1);
		console.log("index push ", index);
	}

	$scope.deleteArticle = function (article, index){
		$scope.articles.push(article);
		$scope.articlesState.splice(index,1);
		console.log("index pop ", index);
	}
	
});

	