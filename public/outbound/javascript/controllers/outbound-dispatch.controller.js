function OutboundDispatchController (OutboundFactory,ProductFactory, $location, $scope, $routeParams) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.article = {};
    ctrl.outbound.products = [];
    ctrl.freeProducts = [];
    
    ctrl.outboundDispatchModalContent = {
        modalTitle: 'Conferma evasione carico in uscita',
        modalBody: 'Confermare l\'evasione del carico in uscita? Non sarà possibile effettuare ulteriori modifiche al carico!!!',
        modalId: 'outboundcreation',
        modalClass: 'modal fade',
    }
    
    ctrl.getOutbound = function (id) {
        OutboundFactory.getOutbound(id)
        .then (function (resp) {
            console.log("DETTAGLI CARICO IN USCITA" , resp);
            ctrl.outbound.articles = resp.data.data.articles;
            ctrl.outbound.products = resp.data.data.products;
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    
    $scope.$on('outboundFormValid', function (event, data) {
        if (data) {
            ctrl.outboundFormValid = data.$valid;
        }
    })
    
    //cambiare con i prodotti liberi
    ctrl.getStocks = function () {
		ProductFactory.getProducts()
            .then (function (resp) {
                console.log("STOCK FREE ", resp);
				ctrl.freeProducts = resp.data.data.products;
			})
			.catch(function(err) {
				console.log(err);
			});
    };
    
    ctrl.getOutbound($routeParams.id); 
    ctrl.getStocks(); 
    
    ctrl.addSelectedProduct = function (product) {
		ctrl.outbound.products.push(product);
        index = ctrl.freeProducts.indexOf(product);
        console.log(product, index);
		ctrl.freeProducts.splice(index,1);
	};

	ctrl.removeSelectedProduct = function (product){
		ctrl.freeProducts.push(product);
        index = ctrl.outbound.products.indexOf(product);
		console.log(product, index);
        ctrl.outbound.products.splice(index,1);
	};
    
    ctrl.confirmOutboundDispatch = function (outbound) {
        console.log(outbound);    
    }
	
	
}

angular
    .module('store')
    .controller('OutboundDispatchController', ['OutboundFactory','ProductFactory','$location','$scope', '$routeParams', OutboundDispatchController]);
