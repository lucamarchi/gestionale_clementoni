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
	
//	articleFactory.resource().get (
//			function (resp) {
//				console.log("TUTTI GLI ARTICOLI LIBERI" , resp.articles);
//				$scope.articles = resp.articles;
//				$scope.monster = releaseFactory.createMapArticles($scope.articles);
//			},
//			function(err) {
//				console.log(resp);
//			}
//	);
		
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
				$scope.regionArray = findDistinctRegion(resp.articles);
				$scope.provinciaArray = findDistinctProvincia(resp.articles);
				$scope.monster = releaseFactory.createMapArticles($scope.articles);
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
	
	$scope.addArticle2 = function (article, index1,index2, index3) {
		console.log(index1, index2, index3);
		$scope.releaseArticles.push(article);
//		console.log("lunghezza1 ", $scope.monster.length);
//		console.log("lunghezza2 ", $scope.monster[index1].value.length);
//		console.log("lunghezza3 ", $scope.monster[index1].value[index2].value.length);
		$scope.monster[index1].value[index2].value.splice(index3,1);
//		if ($scope.monster[index1].value[index2].value.length == 0){
//			console.log("A");
//			$scope.monster[index1].value.splice(index2,1);
//		}
//		if($scope.monster[index1].value.length == 0){
//			console.log("B");
//			$scope.monster.splice(index1,1);
//		}
//		console.log("lunghezza1 ", $scope.monster.length);
//		console.log("lunghezza2 ", $scope.monster[index1].value.length);
//		console.log("lunghezza3 ", $scope.monster[index1].value[index2].value.length);
	}

	$scope.deleteArticle2 = function (article, index){
		$scope.releaseArticles.splice(index,1);
		var mappa = $scope.monster;
		for (var i = 0; i < mappa.length; i++) {
			if (mappa[i].key == article.region){
				for (var j = 0; j < mappa[i].value.length; j++) {
					if (mappa[i].value[j].key == article.provincia){
						$scope.monster[i].value[j].value.push(article);
					}
				}
			}
		}
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
				console.log("CONFERMATA CREAZIONE CARICO IN USCITA", resp);
				$scope.releases.push(resp.release);
			},
			function (err){
				console.log(err);
			})
	}

	$scope.regionIncludes = [];

	$scope.includeRegion = function(region) {
		var i = $.inArray(region, $scope.regionIncludes);
		if (i > -1) {
			$scope.regionIncludes.splice(i, 1);
		} else {
			$scope.regionIncludes.push(region);
		}
	}

	$scope.regionFilter = function(r2a) {
		if ($scope.regionIncludes.length > 0) {
			if ($.inArray(r2a.key, $scope.regionIncludes) < 0)
				return;
		}
		return r2a;
	}
	
	$scope.provinciaIncludes = [];
    
    $scope.includeProvincia = function(provincia) {
        var i = $.inArray(provincia, $scope.provinciaIncludes);
        if (i > -1) {
            $scope.provinciaIncludes.splice(i, 1);
        } else {
            $scope.provinciaIncludes.push(provincia);
        }
    }
    
    $scope.provinciaFilter = function(p2a) {
        if ($scope.provinciaIncludes.length > 0) {
            if ($.inArray(p2a.key, $scope.provinciaIncludes) < 0)
                return;
        }
        return p2a;
    }
}]);