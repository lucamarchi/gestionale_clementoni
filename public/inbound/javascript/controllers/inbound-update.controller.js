function InboundUpdateController ($scope, $location, InboundFactory, ExpectedFactory, ProductFactory, $routeParams) {
    var ctrl = this;
   
    ctrl.models = {
        inboundProducts : [],
        inboundOrder : {},
    }
    
    ctrl.getInboundProducts = function (id) {
        InboundFactory.getInbound(id)
        .then (function (resp) {
            console.log("TUTTI I PRODOTTI DEL CARICO" , resp);
            ctrl.models.inboundProducts = resp.data.products;
            ctrl.models.inboundOrder.fornitore = resp.data.order.fornitore;
            ctrl.models.inboundOrder.ddt = resp.data.order.ddt;
            ctrl.models.inboundOrder.dataDdt = new Date(resp.data.order.dataDdt);
            ctrl.models.inboundOrder._id = resp.data.order._id;
//            ctrl.models.inboundOrder = resp.data.order;
            
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    
    ctrl.getInboundProducts($routeParams.id)
    
    ctrl.updateInboundOrder = function (inboundOrder, addedProducts, deletedProducts, updatedProducts, selectedExpecteds) {
		InboundFactory.updateInbound({order: inboundOrder, products:addedProducts, expected:selectedExpecteds})
            .then(function(resp){
				console.log(resp);
                for (product of deletedProducts) {
                    ProductFactory.deleteProduct(product._id)
                        .then(function(resp){
				            console.log(resp);
                        })
                        .catch(function (err){
				            console.log(err);
                        })
                }
                for (product of deletedProducts) {
                    ProductFactory.updateProduct({product:product})
                        .then(function(resp){
				            console.log(resp);
                        })
                        .catch(function (err){
				            console.log(err);
                        })
                }
                $location.path("/inbound")
			})
			.catch(function (err){
				console.log(err);
			})
    };
}



angular
    .module('store')
    .controller('InboundUpdateController', ['$scope','$location','InboundFactory', 'ExpectedFactory','ProductFactory','$routeParams', InboundUpdateController]);