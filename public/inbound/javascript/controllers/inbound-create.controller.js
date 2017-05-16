function InboundCreateController ($scope, $location, InboundFactory, ExpectedFactory) {
    var ctrl = this;
   
    ctrl.inbound = {
        products : [],
        order : {},
        selectedExpecteds : [],
    }
    
    ctrl.inboundConfirmationModalContent = {
        modalTitle: 'Conferma carico in entrata',
        modalBody: 'Confermare la creazione del carico in entrata?',
        modalId: 'inboundconfirmation',
        modalClass: 'modal fade',
    }
    
    ctrl.confirmInboundOrder = function (inbound) {
        console.log("RICHIESTA", inbound);
		InboundFactory.addInbound({order: inbound.order, products:inbound.products, expecteds:inbound.selectedExpecteds})
            .then(function(resp){
				console.log(resp);
                $location.path("/inbound")
			})
			.catch(function (err){
				console.log(err);
			})
        console.log(inbound);
        $location.path("/inbound");
    };
    
}

angular
    .module('store')
    .controller('InboundCreateController', ['$scope','$location','InboundFactory', 'ExpectedFactory', InboundCreateController]);