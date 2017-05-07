function OutboundCreateController (OutboundFactory, ProdStateFactory, $location) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.products = [];
    
    ctrl.outboundConfirmationModalContent = {
        modalTitle: 'Conferma creazione carico in uscita',
        modalBody: 'Confermare la creazione del carico in uscita?',
        modalId: 'outboundcreation',
        modalClass: 'modal fade',
    }
    
    
    
    ctrl.confirmOutbound = function (outbound) {
        console.log(outbound);
    }
}

angular
    .module('store')
    .controller('OutboundCreateController', ['OutboundFactory', 'ProdStateFactory', '$location', OutboundCreateController]);
