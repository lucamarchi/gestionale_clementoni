function InboundCreateController ($scope, $location, InboundFactory, ExpectedFactory) {
    var ctrl = this;
   
    ctrl.models = {
        inboundProducts : [],
        inboundOrder : {},
    }
    
    ctrl.confirmInboundOrder = function (inbound) {
//		InboundFactory.addInbound({order: inboundOrder, products:inboundProducts, expected:selectedExpecteds})
//            .then(function(resp){
//				console.log(resp);
//                $location.path("/inbound")
//			})
//			.catch(function (err){
//				console.log(err);
//			})
        console.log(inbound);
    };
    
    
}

angular
    .module('store')
    .controller('InboundCreateController', ['$scope','$location','InboundFactory', 'ExpectedFactory', InboundCreateController]);