function OutboundUpdateController (OutboundFactory, ProdStateFactory, $location, $routeParams) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.products = [];
    
    ctrl.getOutbound = function (id) {
        OutboundFactory.getOutbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.outbound.articles = resp.data.articles;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
        
    ctrl.getOutbound($routeParams.id);
}

angular
    .module('store')
    .controller('OutboundUpdateController', ['OutboundFactory', 'ProdStateFactory', '$location','$routeParams', OutboundUpdateController]);
