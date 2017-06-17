function InboundDetailsController (InboundFactory, $routeParams,$location) {
    var ctrl = this;
    ctrl.inbound = {};
    ctrl.inbound.order = {};
    ctrl.inbound.products = [];
    ctrl.currentPage = 1;
    
    
    ctrl.getInbound = function (id) {
        InboundFactory.getInbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.inbound.order = resp.data.data.order;
            ctrl.inbound.products = resp.data.data.products;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
        
    ctrl.getInbound($routeParams.id);
    
    
}

angular
    .module('store')
    .controller('InboundDetailsController', ['InboundFactory', '$routeParams','$location', InboundDetailsController]);