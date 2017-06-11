function OutboundUpdateController (OutboundFactory, ProdStateFactory, $location, $routeParams) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.addedArticles = [];
    ctrl.outbound.removedArticles = [];
    ctrl.outbound.products = [];
    
    ctrl.outboundConfirmationModalContent = {
        modalTitle: 'Conferma modifiche carico in uscita',
        modalBody: 'Confermare le modifiche del carico in uscita?',
        modalId: 'outboundupdating',
        modalClass: 'modal fade',
    }
    
    ctrl.getOutbound = function (id) {
        OutboundFactory.getOutbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.outbound.articles = resp.data.data.articles;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
        
    ctrl.getOutbound($routeParams.id);
    
    ctrl.updateOutbound = function (outbound) {
        console.log(outbound);
    }
}

angular
    .module('store')
    .controller('OutboundUpdateController', ['OutboundFactory', 'ProdStateFactory', '$location','$routeParams', OutboundUpdateController]);
