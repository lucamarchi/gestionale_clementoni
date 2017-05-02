function OutboundDespatchController (OutboundFactory, StockFactory, $location, $scope) {
    var ctrl = this;
    ctrl.outbound = {};
    ctrl.outbound.order = {};
    ctrl.outbound.products = [];
    ctrl.freeProducts = [];
    
    $scope.$on('outboundFormValid', function (event, data) {
        if (data) {
            ctrl.outboundFormValid = data.$valid;
        }
    })
    
    ctrl.getStocks = function () {
		StockFactory.getStocks()
            .then (function (resp) {
                console.log(resp);
				ctrl.freeProducts = resp.data.stocks;
				console.log("STOCKS", ctrl.stocks);
			})
			.catch(function(err) {
				console.log(err);
			});
    };
    
    
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
	
	ctrl.getStocks();
}

angular
    .module('store')
    .controller('OutboundDespatchController', ['OutboundFactory', 'StockFactory', '$location','$scope', OutboundDespatchController]);
