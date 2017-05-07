function ProdStateUpdateController (ProdStateFactory, ProdOverviewFactory, $location, $routeParams) {
    var ctrl = this;
    ctrl.prodStateArticles = [];
    
    ctrl.prodStateConfirmationModalContent = {
        modalTitle: 'Conferma Stato Produzione',
        modalBody: 'Confermare le modifiche allo stato produzione?',
        modalId: 'prodstateupdating',
        modalClass: 'modal fade',
    }
    
    ctrl.getProdState = function (id) {
        ProdStateFactory.getProdState(id)
        .then (function (resp) {
            console.log("ARTICOLI STATO PRODUZIONE" , resp);
            ctrl.prodState = resp.data.prod;
            ctrl.prodStateArticles = resp.data.articoli;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    
    ctrl.getProdState($routeParams.id);
    
    ctrl.updateProductionState = function (articles) {
//		var prodState = {};
//        prodState.prod = {};
//		prodState.articoli = articles;
//		console.log(prodState);
//        ProdStateFactory.addProdState(prodState)
//            .then (function (resp) {
//                console.log(resp);
//                $location.path("/productionState")
//            })
//            .catch(function(err) {
//                console.log(err);
//            })
        
        console.log(articles);
    };
}

angular
    .module('store')
    .controller('ProdStateUpdateController', ['ProdStateFactory','ProdOverviewFactory','$location','$routeParams', ProdStateUpdateController]);
