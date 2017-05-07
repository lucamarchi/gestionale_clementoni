function OutboundCreateController (OutboundFactory, ProdStateFactory, $location) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.articles = [];
    ctrl.outbound.products = [];
}

angular
    .module('store')
    .controller('OutboundCreateController', ['OutboundFactory', 'ProdStateFactory', '$location', OutboundCreateController]);
