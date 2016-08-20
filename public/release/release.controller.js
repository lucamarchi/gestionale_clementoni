var store = angular.module('store');

store.controller('releaseController', ['$scope','releaseFactory','articleFactory','stockFactory','features', function ($scope, releaseFactory, articleFactory, stockFactory, features) {
	
	$scope.features = features;
	
	releaseFactory.resourceGroup().getAll(
		function (resp) {
			console.log("TUTTI I CARICHI IN USCITA" , resp.releases);
			$scope.releases = resp.releases;
			$scope.totalItems = $scope.releases.length;
			$scope.entryLimit = 10;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.releaseDetails = function (release) {
		releaseFactory.resource().get(
			{id: release._id},
				function (resp) {
					console.log(resp)
					$scope.releaseArticles = resp.articles;
					$scope.releaseStocks = resp.products;
				},
				function(err) {
					console.log(err);
				}
		);
	}
	
	$scope.createRelease = function () {
		$scope.release = {};
		$scope.releaseArticles = [];
		$scope.releaseStocks = [];
		$scope.creationInProgress = true;
	}
	
	$scope.selectArticles = function () {
		$scope.releaseArticles = [];
		articleFactory.resource().get (
			function (resp) {
				console.log("TUTTI GLI ARTICOLI LIBERI" , resp.articles);
				$scope.articles = resp.articles;
			},
			function(err) {
				console.log(resp);
			}
		);
	}
	
	
	$scope.addArticle = function (article, index) {
		$scope.releaseArticles.push(article);
		$scope.articles.splice(index,1);
	}

	$scope.deleteArticle = function (article, index){
		$scope.articles.push(article);
		$scope.releaseArticles.splice(index,1);
	}
	
	$scope.selectStocks = function () {
		$scope.releaseStocks = [];
		console.log("ARTICOLI IN USCITA ", $scope.releaseArticles);
		stockFactory.resource().get (
			function (resp) {
				console.log("TUTTI GLI STOCKS ", resp.stocks);
				$scope.stocks = resp.stocks;
			},
			function(err) {
				console.log(resp);
			}
		);
	}
	
	$scope.addStock = function (stock, index) {
		$scope.releaseStocks.push(stock);
		$scope.stocks.splice(index,1);
	}

	$scope.deleteStock = function (stock, index){
		$scope.stocks.push(stock);
		$scope.releaseStocks.splice(index,1);
	}
	
	$scope.prepareDeleteRelease = function (release, index){
		release.dataCreazione = new Date(release.dataCreazione);
		$scope.release = release;
		$scope.index = index;
	}
	
	$scope.deleteRelease = function (release, index) {
		releaseFactory.resource().delete(
			{
				id:release._id
			},
			function(resp){
				console.log("RELEASE CANCELLATO INDICE "+index);
				console.log(resp);
				$scope.releases.splice(index,1);
			},
			function(err){
				console.log(err);
			}
		);
	}
	
	$scope.confirmRelease = function () {
		var release = $scope.release;
		var articles = $scope.releaseArticles;
		var stocks = $scope.releaseStocks;
		releaseFactory.resource().save({},
			{release,articles,stocks},
			function(resp){
				console.log("CONFERMATA CREAZIONE CARICO IN USCITA", resp)
			},
			function (err){
				console.log(err);
			})
	}
}]);