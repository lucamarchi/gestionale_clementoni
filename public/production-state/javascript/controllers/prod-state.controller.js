function ProdStateController (ProdStateFactory) {
    var ctrl = this;
    ctrl.prodStates = [];
    ctrl.getProdStates = function () {
        ProdStateFactory.getProdStates()
            .then (function (resp) {
                console.log(resp);
                ctrl.prodStates = resp.data.prods;
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    ctrl.getProdStates();
    
    
}

angular
    .module('store')
    .controller('ProdStateController', ['ProdStateFactory', ProdStateController])