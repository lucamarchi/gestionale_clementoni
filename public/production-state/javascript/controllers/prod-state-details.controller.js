function ProdStateDetailsController (ProdStateFactory, ProcessingFactory, $routeParams,$location) {

    var ctrl = this;
    ctrl.prodState = {};
    ctrl.prodState.prod = {};
    ctrl.prodState.articles = [];
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
    
    ctrl.startProcessing = function (article) {
        ProcessingFactory.addArticles(article, $routeParams.id);
        $location.path("/productionState/processing/"+article._id);    
    }
    
    
}

angular
    .module('store')
    .controller('ProdStateDetailsController', ['ProdStateFactory','ProcessingFactory','$routeParams','$location', ProdStateDetailsController])