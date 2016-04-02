store.controller('productionStateController', ['$scope', 'articleFactory', 'stockFactory', 'productionStateFactory', 'processFactory', 'UserService', function ($scope, articleFactory, stockFactory, productionStateFactory, processFactory, UserService) {
	$scope.state = {};
	$scope.article = {};
	var process = {};
	$scope.articles = [];
	$scope.articlesState = [];
	$scope.articlesState2 = [];
	$scope.isEnabled = false;
	$scope.workInProgress = false;
	$scope.monster = [];
	
	productionStateFactory.getAll(
		function (resp) {
			console.log("TUTTI GLI STATI PRODUZIONE" , resp.data);
			$scope.states = resp.data;
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.openProductionState = function (state) {
		$scope.isEnabled = false;
		$scope.articlesState2 = [];
		productionStateFactory.get(
			{
				id: state._id
			},
			function (resp) {
				console.log("STATE E ARTICLES" , resp);
				$scope.state = resp.prod;
				$scope.articlesState = resp.articoli;
			},
			function (err) {
				console.log (err);
			}
		);
	}	
	
	$scope.openListStocks = function(article){
		$scope.article = article;
		stockFactory.resource().getAll(
			function (resp) {
				$scope.products = resp.data;
			},
			function(err) {
				console.log(err);
			}
		);
	}
	
	$scope.selectStock = function (stock){
		var article = $scope.article;
		articleFactory.resourceStock().update(
			{id: article._id},
			{stock},
			function (resp) {
				console.log(resp);
				article.stockId = stock._id;
			},
			function(err) {
				console.log(err);
			}
		);
	}
	
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
	
	$scope.newProductionState = function () {
		$scope.articlesState = [];
//		$scope.articlesState2 = [];
		$scope.isEnabled = true;
		articleFactory.resourceState().get (
			{
				state: "libero"
			},
			function (resp) {
				console.log("TUTTI GLI ARTICOLI LIBERI" , resp.data);
				$scope.articles = resp.data;
			},
			function(err) {
				console.log(resp);
			}
		);
	}
	
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
	
	$scope.confirmProductionState = function () {
		var prod = {};
		var articoli = $scope.articlesState;
		console.log("State ",prod, "	Article ",articoli);
		productionStateFactory.save({},
			{prod, articoli},
			function(resp){
				console.log("STATO PRODUZIONE CONFERMATO" , resp);
				$scope.states.push(resp.data);
			},
			function (err){
				console.log(err);
			}
		);
	}
	
	//1
	$scope.startWork = function(article){
		process = {};
		$scope.article = article;
		if (article.stockId){
			stockFactory.resource().get(
				{id: article.stockId},
				function (resp) {
					console.log(resp);
					$scope.stock = Object.assign({},resp.data);
					$scope.stockOld = Object.assign({},resp.data);
				},
				function(err) {
					console.log(err);
				}
			);	
		}
		else {
			$scope.stock = undefined;
			$scope.stockOld = undefined;
		}
		$scope.child = undefined;
		$scope.children = [];
		$scope.machinery = undefined;
		$scope.bancale = undefined;
		$scope.scarto = 0;
		$scope.workInProgress = true;
	}
	
	$scope.openListColli = function(){
		stockFactory.resource().getAll(
			function (resp) {
				$scope.products = resp.data;
			},
			function(err) {
				console.log(err);
			}
		);
	}
	
	$scope.selectCollo = function (stock) {
		$scope.stock = Object.assign({}, stock);
		$scope.stockOld = Object.assign({}, stock);
		console.log("Stock selezionato", stock);
	}
	
	$scope.selectMachinery = function (machinery) {
		$scope.machinery = machinery;
		console.log("macchina", machinery);
	}
	
	$scope.createChildren = function () {
		$scope.child = {};
		$scope.bancale = undefined;
		$scope.child.materiale = $scope.stock.materiale;
		$scope.child.qualita = $scope.stock.qualita;
		$scope.child.scelta = $scope.stock.scelta;
		$scope.child.finitura = $scope.stock.finitura;
		$scope.child.colore = $scope.stock.colore;
		$scope.child.spessore = $scope.stock.spessore;
		$scope.child.larghezza = $scope.article.larghezza;
		$scope.child.lunghezza = $scope.article.lunghezza;
		if ($scope.machinery != "f") {
			$scope.child.stabilimento = 1;
		}
		else {
			$scope.child.stabilimento = 2;
		}
	}
	
	$scope.addChild = function (child) {
		child.peso = child.peso - $scope.bancale;
		valuesProduct(child);
		$scope.children.push(child);
		console.log("Realizzato", child);
	}
	
	$scope.updateCollo = function (stock) {
		$scope.stock = stock;
		console.log("stock aggiornato", stock);
		console.log("stock iniziale", $scope.stockOld);
	}
	
	$scope.confirmWork = function(){
		var stockOld = $scope.stockOld;
		process.article = $scope.article;
		process.stock = $scope.stock;
		process.macchina = $scope.machinery.sigle;
		process.figli = $scope.children;
		process.scarto = calculateScarto(stockOld, process.stock, process.figli);
		process.operatore = UserService.getUser();
		console.log("process", process);
		processFactory.save({},
			process,
			function(resp){
				console.log(resp)
			},
			function (err){
				console.log(err);
			})
	}
	
	$scope.prepareCompleteArticle = function (article) {
		$scope.article = article;
	}
	
	$scope.completeArticle = function(){
		var article = $scope.article;
		articleFactory.resourceComplete().update(
			{id: article._id},
			function (resp) {
				console.log(resp)
				article.stato = "completato"
			},
			function(err) {
				console.log(err);
			}
		);
	}
}]);

	