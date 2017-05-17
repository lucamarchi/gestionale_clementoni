 function InboundController ($scope, InboundFactory, ExpectedFactory, features) {
	var ctrl = this;
	    
    ctrl.getInbounds = function() {
        InboundFactory.getInbounds()
            .then (function (resp) {
                console.log("TUTTI I CARICHI IN ENTRATA" , resp);
                ctrl.inbounds = resp.data.data.orders;
                ctrl.entryLimit = 10;
                ctrl.currentPage = 1;
            })
            .catch(function(err) {
                console.log(err);
            });
    };
	
    ctrl.getInbounds();
 }

angular.module('store')
    .controller('InboundController', ['$scope', 'InboundFactory','ExpectedFactory','features', InboundController]);