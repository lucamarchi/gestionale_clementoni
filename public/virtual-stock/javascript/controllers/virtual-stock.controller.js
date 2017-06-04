function VirtualStockController ($scope, ProductFactory,$location) {
    var ctrl = this;
    ctrl.stocks = [];
	
    ctrl.stockDeleteModalContent = {
        modalTitle: 'Cancellazione prodotto giacenza',
        modalClass: 'modal fade',
        modalId: 'stockdeletion',
        stock: {},
    }
    
    ctrl.selectVirtualStock = function (stock) {
        console.log(stock);
        ctrl.stockDeleteModalContent.stock = stock;
    }
    
	ctrl.getVirtualStocks = function () {
		ProductFactory.getProducts()
            .then (function (resp) {
                console.log(resp);
				ctrl.stocks = resp.data.data.products;
				console.log("STOCKS", ctrl.stocks);
			})
			.catch(function(err) {
				console.log(err);
			});
    };
	
	ctrl.getVirtualStocks();
    
    ctrl.deleteVirtualStock = function (stock) {
        //chiamata all api
        ctrl.stocks.splice(ctrl.stocks.indexOf(stock),1);    
    }
};

angular
    .module('store')
    .controller('VirtualStockController', ['$scope', 'ProductFactory','$location', VirtualStockController]);