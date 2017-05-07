function ProdStateCreateController (ProdStateFactory, ProdOverviewFactory, $location) {
    var ctrl = this;
    ctrl.selectedArticles = [];
    ctrl.freeArticles = [];
    
    ctrl.getFreeArticles = function () {
        ProdStateFactory.getFreeArticles()
            .then (function (resp) {
                console.log(resp);
                ctrl.freeArticles = resp.data.articles;
                ctrl.entryLimit = 10;
                ctrl.currentPage = 1;
            })
            .catch(function(err) {
                console.log(err);
            })
    };
    
    
    ctrl.getFreeArticles();
    
    ctrl.addSelectedArticle = function (article) {
		ctrl.selectedArticles.push(article);
        index = ctrl.freeArticles.indexOf(article);
        console.log(article, index);
		ctrl.freeArticles.splice(index,1);
	};

	ctrl.removeSelectedArticle = function (article){
		ctrl.freeArticles.push(article);
        index = ctrl.selectedArticles.indexOf(article);
		console.log(article, index);
        ctrl.selectedArticles.splice(index,1);
	};
    
    ctrl.confirmProductionState = function (articles) {
		var prodState = {};
        prodState.prod = {};
		prodState.articoli = articles;
		console.log(prodState);
        ProdStateFactory.addProdState(prodState)
            .then (function (resp) {
                console.log(resp);
                $location.path("/productionState")
            })
            .catch(function(err) {
                console.log(err);
            })
    };
}

angular
    .module('store')
    .controller('ProdStateCreateController', ['ProdStateFactory','ProdOverviewFactory','$location', ProdStateCreateController]);
