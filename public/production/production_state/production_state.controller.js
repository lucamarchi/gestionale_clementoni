store.controller('productionStateController', ['$scope', 'articleFactory', 'stockFactory', 'productionStateFactory', 'processFactory', 'UserService', function ($scope, articleFactory, stockFactory, productionStateFactory, processFactory, UserService) {
	$scope.riepilogo = false;
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
		$scope.workInProgress = false;
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
				$scope.articleProcesses = resp.processes;
				console.log("TUTTE LE LAVORAZIONI", resp);
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
				console.log("CLIENTE ARTICOLO", resp.data);
			},
			function (err) {
				console.log(resp);
			} 
		);
	}
	
	$scope.newProductionState = function () {
		$scope.state = {};
		$scope.articlesState = [];
		$scope.articlesState2 = [];
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
	
	$scope.editProductionState = function (state, articles) {
		console.log("state ", state, " articles ",articles);
		$scope.state = state;
		$scope.articlesState = articles;
		$scope.articlesState2 = [];
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
		$scope.articlesState2.push(article);
		$scope.articles.splice(index,1);
//		console.log("index push ", index);
	}

	$scope.deleteArticle = function (article, index){
		$scope.articles.push(article);
		$scope.articlesState.splice(index,1);
		$scope.articlesState2.splice(index,1);
//		console.log("index pop ", index);
	}
	
	$scope.confirmProductionState = function () {
		var prod = $scope.state;
		var articoli = $scope.articlesState2;
		console.log("State ",prod, "	Article ",articoli);
		if (prod == {} || prod._id == undefined) {
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
		} else {
			productionStateFactory.update(
				{
					id: prod._id
				},
				{prod, articoli},
				function(resp){
					console.log("STATO PRODUZIONE AGGIORNATO" , resp);
				},
				function (err){
					console.log(err);
				}
			);
		}
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
		$scope.workInProgress = true;
		$scope.isUpdate = false;
		$scope.scartoTot = [];
	}
	
	$scope.openListStock2 = function(){
		stockFactory.resource().getAll(
			function (resp) {
				$scope.products = resp.data;
			},
			function(err) {
				console.log(err);
			}
		);
	}
	
	$scope.selectStock2 = function (stock) {
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
		if($scope.machinery.sigle != "a") {
			$scope.scarto = undefined;
		}
		else {
			$scope.scarto = 0;
		}
		$scope.child.materiale = $scope.stock.materiale;
		$scope.child.qualita = $scope.stock.qualita;
		$scope.child.scelta = $scope.stock.scelta;
		$scope.child.finitura = $scope.stock.finitura;
		$scope.child.coloreRal = $scope.stock.coloreRal;
		$scope.child.superficie = $scope.stock.superficie;
		$scope.child.spessore = $scope.stock.spessore;
		if($scope.article) {
			$scope.child.larghezza = $scope.article.larghezza;
			$scope.child.lunghezza = $scope.article.lunghezza;
		}
		if ($scope.machinery.sigle != "f") {
			$scope.child.stabilimento = 1;
		}
		else {
			$scope.child.stabilimento = 2;
		}
	}
	
	$scope.addChild = function (child, scarto) {
		child.pesoNetto = child.pesoLordo - $scope.bancale;
		valuesProduct(child);
		$scope.children.push(child);
		if ($scope.machinery.sigle != "a") {
			$scope.scartoTot.push($scope.scarto);
		}
		console.log("figli ", $scope.children, "scarti ", $scope.scartoTot);
	}
	
	$scope.deleteChild = function (child, index) {
		$scope.children.splice(index,1);
		$scope.scartoTot.splice(index,1);
		console.log("figli ", $scope.children, "scarti ", $scope.scartoTot);
	}
	
	$scope.updateStock = function (stock) {
		$scope.stock = stock;
		$scope.stock.pesoNetto = $scope.stock.pesoLordo;
		valuesProduct($scope.stock);
		$scope.isUpdate = true;
	}
	
	
	$scope.confirmWork = function(){
		var stockOld = $scope.stockOld;
		process.article = $scope.article;
		process.stock = $scope.stock;
		process.macchina = $scope.machinery.sigle;
		process.figli = $scope.children;
		if (process.macchina == "a") {
			process.scarto = calculateScarto(stockOld, process.stock, process.figli);	
		}
		else {
			process.scarto = $scope.scartoTot.reduce(function(previousValue, currentValue, currentIndex, array) {
  				return previousValue + currentValue;
			});
		}
		process.operatore = UserService.getUser().username;	
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
		$scope.scartoTot = [];
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

	