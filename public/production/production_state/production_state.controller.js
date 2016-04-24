store.controller('productionStateController', ['$scope', 'articleFactory', 'stockFactory', 'productionStateFactory', 'processFactory', 'UserService', function ($scope, articleFactory, stockFactory, productionStateFactory, processFactory, UserService) {
	$scope.state = {};
	$scope.article = {};
	var process = {};
	$scope.articles = [];
	$scope.articlesState = [];
	$scope.articlesState2 = [];
	$scope.isEnabled = false;
	$scope.isUpdate = false;
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
				console.log("COLLO SELEZIONATO", resp.data);
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
//		console.log("index push ", index);
	}

	$scope.deleteArticle = function (article, index){
		$scope.articles.push(article);
		$scope.articlesState.splice(index,1);
//		console.log("index pop ", index);
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
	
	$scope.startWork = function(article){
		process = {};
		$scope.article = article;
		if (article.stockId){
			stockFactory.resource().get(
				{id: article.stockId},
				function (resp) {
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
		$scope.isUpdate = false;
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
		console.log("Macchina selezionata", machinery);
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
		if($scope.article) {
			$scope.child.larghezza = $scope.article.larghezza 
			$scope.child.lunghezza = $scope.article.lunghezza;
		}
		else {
			$scope.child.larghezza = $scope.stock.larghezza;	
		}
		if ($scope.machinery != "f") {
			$scope.child.stabilimento = 1;
		}
		else {
			$scope.child.stabilimento = 2;
		}
	}
	
	$scope.addChild = function (child) {
		child.pesoNetto = child.pesoLordo - $scope.bancale;
		valuesProduct(child);
		$scope.children.push(child);
	}
	
	$scope.editCollo = function () {
		$scope.bancale = undefined;	
	}
	
	$scope.updateCollo = function (stock) {
		$scope.stock = stock;
		$scope.stock.pesoNetto = $scope.stock.pesoLordo - $scope.bancale;
		valuesProduct($scope.stock);
		$scope.isUpdate = true;
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
		processFactory.resource().save({},
			process,
			function(resp){
				console.log("CONFERMATA LAVORAZIONE", resp)
			},
			function (err){
				console.log(err);
			})
	}
	
	
	$scope.furtherWork = function() {
		process = {};
		$scope.article = undefined;
		$scope.child = undefined;
		$scope.children = [];
		$scope.bancale = undefined;
		$scope.scarto = 0;
		$scope.isUpdate = false;
	}
	
	$scope.prepareCompleteArticle = function (article) {
		$scope.article = article;
	}
	
	$scope.completeArticle = function(){
		var article = $scope.article;
		articleFactory.resourceComplete().update(
			{id: article._id},
			function (resp) {
				console.log("ARTICOLO COMPLETATO", resp)
				article.stato = "completato"
			},
			function(err) {
				console.log(err);
			}
		);
	}
}]);

	