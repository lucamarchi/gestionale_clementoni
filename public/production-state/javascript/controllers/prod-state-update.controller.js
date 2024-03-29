function ProdStateUpdateController(ProdStateFactory, $location, $routeParams) {
    var ctrl = this;
    ctrl.prodState = {};
    ctrl.prodState.articles = [];
    ctrl.prodState.prod = {};
    ctrl.prodState.addedArticles = [];
    ctrl.prodState.removedArticles = [];

    ctrl.prodStateConfirmationModalContent = {
        modalTitle: 'Conferma Stato Produzione',
        modalBody: 'Confermare le modifiche allo stato produzione?',
        modalId: 'prodstateupdating',
        modalClass: 'modal fade',
    }

    ctrl.getProdState = function (id) {
        ProdStateFactory.getProdState(id)
            .then(function (resp) {
                console.log("ARTICOLI STATO PRODUZIONE", resp);
                ctrl.prodState.prod = resp.data.data.prod;
                ctrl.prodState.articles = resp.data.data.articles;
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    ctrl.getProdState($routeParams.id);

    ctrl.updateProdState = function (prodState) {
        console.log(prodState);
        ProdStateFactory.updateProdState(
            prodState.prod._id,
            {
                prod: prodState.prod,
                articlesToAdd: prodState.addedArticles,
                articlesToRemove: prodState.removedArticles
            })
            .then(function (resp) {
                console.log(resp);
                $location.path("/productionState")
            })
            .catch(function (err) {
                console.log(err);
            });
    };
}

angular
    .module('store')
    .controller('ProdStateUpdateController', ['ProdStateFactory', '$location', '$routeParams', ProdStateUpdateController]);
