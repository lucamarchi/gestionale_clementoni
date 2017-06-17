function OutboundDetailsController (OutboundFactory, ProdStateFactory, $routeParams,$location) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.products = [];
    ctrl.currentPage = 1;
    
    
    ctrl.getOutbound = function (id) {
        OutboundFactory.getOutbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.outbound.order = resp.data.data.release;
            ctrl.outbound.articles = resp.data.data.articles;
            ctrl.outbound.products = resp.data.data.products;
        })
        .catch(function(err) {
            console.log(err);
        });
    };
        
    ctrl.getOutbound($routeParams.id);
    
    
}

angular
    .module('store')
    .controller('OutboundDetailsController', ['OutboundFactory', 'ProdStateFactory', '$routeParams','$location', OutboundDetailsController]);