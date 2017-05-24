function ProdStateDetailsController (ProdStateFactory, ProcessingProgressFactory, $routeParams,$location) {

    var ctrl = this;
    ctrl.prodState = {};
    ctrl.prodState.prod = {};
    ctrl.prodState.articles = [];
    ctrl.workingArticles = [];
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
    
    ctrl.getProdState = function (id) {
        ProdStateFactory.getProdState(id)
        .then (function (resp) {
            console.log("ARTICOLI STATO PRODUZIONE" , resp);
            ctrl.prodState.prod = resp.data.data.prod;
            ctrl.prodState.articles = resp.data.data.articles;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
	
    ctrl.getProdState($routeParams.id);

    ctrl.addWorkingArticle = function (article) {
        ctrl.workingArticles.push(article);
        var index = ctrl.prodState.articles.indexOf(article);
        console.log(article, index);
        ctrl.prodState.articles.splice(index,1);
    };

    ctrl.removeWorkingArticle = function (article){
        ctrl.prodState.articles.push(article);
        var index = ctrl.workingArticles.indexOf(article);
        console.log(article, index);
        ctrl.workingArticles.splice(index,1);
    };

    ctrl.startProcessing = function (articles) {
        ProcessingProgressFactory.startProcessing(articles);
        $location.path("/productionState/processing/"+$routeParams.id);
    }
    
    
}

angular
    .module('store')
    .controller('ProdStateDetailsController', ['ProdStateFactory','ProcessingProgressFactory','$routeParams','$location', ProdStateDetailsController]);