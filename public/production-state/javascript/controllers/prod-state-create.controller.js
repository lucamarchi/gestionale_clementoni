function ProdStateCreateController(ProdStateFactory, $location) {
    var ctrl = this;
    ctrl.prodState = {};
    ctrl.prodState.articles = [];
    ctrl.prodState.prod = {};
    ctrl.prodState.addedArticles = [];

    ctrl.prodStateConfirmationModalContent = {
        modalTitle: 'Conferma Stato Produzione',
        modalBody: 'Confermare la creazione dello stato produzione?',
        modalId: 'prodstatecreation',
        modalClass: 'modal fade',
    }

    ctrl.confirmProductionState = function (prodState) {
        console.log(prodState);
        ProdStateFactory.addProdState({prod: prodState.prod, articoli: prodState.addedArticles})
            .then(function (resp) {
                console.log("CONFIRM PROD STATE ", resp);
                $location.path("/productionState");
            })
            .catch(function (err) {
                console.log(err);
            })
    };
}

angular
    .module('store')
    .controller('ProdStateCreateController', ['ProdStateFactory', '$location', ProdStateCreateController]);
