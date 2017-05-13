function ProdStateCreateController (ProdStateFactory, $location) {
    var ctrl = this;
    ctrl.prodStateArticles = [];

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
