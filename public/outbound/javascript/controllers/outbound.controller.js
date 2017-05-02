function OutboundController (OutboundFactory) {
    var ctrl = this;
    ctrl.outbounds = [];
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
    ctrl.getOutbounds = function () {
        OutboundFactory.getOutbounds()
            .then (function (resp) {
                console.log(resp);
                ctrl.outbounds = resp.data.releases;
            })
            .catch(function(err) {
                console.log(err);
            })
    };

    ctrl.getOutbounds();
    
    
}

angular
    .module('store')
    .controller('OutboundController', ['OutboundFactory', OutboundController])