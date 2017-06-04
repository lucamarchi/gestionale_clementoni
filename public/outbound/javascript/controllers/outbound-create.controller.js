function OutboundCreateController(OutboundFactory, $location) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.addedArticles = [];
    ctrl.outbound.products = [];

    ctrl.outboundConfirmationModalContent = {
        modalTitle: 'Conferma creazione carico in uscita',
        modalBody: 'Confermare la creazione del carico in uscita?',
        modalId: 'outboundcreation',
        modalClass: 'modal fade',
    }


    ctrl.confirmOutbound = function (outbound) {
        console.log("request", outbound);
        OutboundFactory.addOutbound({release: outbound.order, articles: outbound.addedArticles, products: outbound.products})
            .then(function (resp) {
                console.log("CONFIRM ORDER ", resp);
                $location.path("/outbound")
            })
            .catch(function (err) {
                console.log(err);
            })

    }
}

angular
    .module('store')
    .controller('OutboundCreateController', ['OutboundFactory', '$location', OutboundCreateController]);
