function OutboundDetailsController (OutboundFactory, ProdStateFactory, $routeParams,$location) {
    var ctrl = this;
    ctrl.outboundArticles = [];
    ctrl.outboundProducts = [];
    ctrl.outbound = {};
    ctrl.currentPage = 1;
    
    
    ctrl.getOutbound = function (id) {
        OutboundFactory.getOutbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.outbound = resp.data.release;
            ctrl.outboundArticles = resp.data.articles;
            ctrl.outboundProducts = resp.data.products;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
        
    ctrl.getOutbound($routeParams.id);
    
    
}

angular
    .module('store')
    .controller('OutboundDetailsController', ['OutboundFactory', 'ProdStateFactory', '$routeParams','$location', OutboundDetailsController]);