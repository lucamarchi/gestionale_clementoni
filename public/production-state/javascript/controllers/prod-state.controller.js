function ProdStateController (ProdStateFactory) {

    var ctrl = this;
    ctrl.prodStates = [];
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
    ctrl.getProdStates = function () {
        ProdStateFactory.getProdStates()
            .then (function (resp) {
                console.log(resp);
                ctrl.prodStates = resp.data.data.prods;
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    ctrl.getProdStates();
    
    
    
}

angular
    .module('store')
    .controller('ProdStateController', ['ProdStateFactory', ProdStateController]);