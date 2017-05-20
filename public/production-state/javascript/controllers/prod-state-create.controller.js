function ProdStateCreateController (ProdStateFactory, $location) {
    var ctrl = this;
    ctrl.prodState = {};
    ctrl.prodState.articles = [];
    ctrl.prodState.prod = {};
    ctrl.prodState.addedArticles;

    ctrl.prodStateConfirmationModalContent = {
        modalTitle: 'Conferma Stato Produzione',
        modalBody: 'Confermare la creazione dello stato produzione?',
        modalId: 'prodstatecreation',
        modalClass: 'modal fade',
    }
    
    ctrl.confirmProductionState = function (articles) {
        console.log(articles);
    };
}

angular
    .module('store')
    .controller('ProdStateCreateController', ['ProdStateFactory', '$location', ProdStateCreateController]);
