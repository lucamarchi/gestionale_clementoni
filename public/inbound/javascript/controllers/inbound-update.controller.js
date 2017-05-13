function InboundUpdateController ($scope, $location, InboundFactory, ExpectedFactory, ProductFactory, $routeParams) {
    var ctrl = this;
   
    ctrl.inbound = {
        products : [],
        order : {},
    }
    
    ctrl.inboundConfirmationModalContent = {
        modalTitle: 'Modifica carico in entrata',
        modalBody: 'Confermare le modifiche al carico in entrata?',
        modalId: 'inboundconfirmation',
        modalClass: 'modal fade',
    }
    
    ctrl.getInbound = function (id) {
        InboundFactory.getInbound(id)
        .then (function (resp) {
            console.log("TUTTI I PRODOTTI DEL CARICO" , resp);
            ctrl.inbound.products = resp.data.products;
            ctrl.inbound.order.fornitore = resp.data.order.fornitore;
            ctrl.inbound.order.ddt = resp.data.order.ddt;
            ctrl.inbound.order.dataDdt = new Date(resp.data.order.dataDdt);
            ctrl.inbound.order._id = resp.data.order._id;
//            ctrl.models.inboundOrder = resp.data.order;
            
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    
    ctrl.getInbound($routeParams.id)
    
    ctrl.updateInboundOrder = function (inbound) {
		console.log(inbound);
        $location.path("/inbound");
        
        
        
//        InboundFactory.updateInbound({order: inbound.order, products: inbound.addedProducts, expected: inbound.selectedExpecteds})
//            .then(function(resp){
//				console.log(resp);
//                for (product of inbound.deletedProducts) {
//                    ProductFactory.deleteProduct(product._id)
//                        .then(function(resp){
//				            console.log(resp);
//                        })
//                        .catch(function (err){
//				            console.log(err);
//                        })
//                }
//                for (product of inbound.modifiedProducts) {
//                    ProductFactory.updateProduct(product)
//                        .then(function(resp){
//				            console.log(resp);
//                        })
//                        .catch(function (err){
//				            console.log(err);
//                        })
//                }
//                $location.path("/inbound")
//			})
//			.catch(function (err){
//				console.log(err);
//			})
    };
}



angular
    .module('store')
    .controller('InboundUpdateController', ['$scope','$location','InboundFactory', 'ExpectedFactory','ProductFactory','$routeParams', InboundUpdateController]);