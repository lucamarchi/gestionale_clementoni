function StockController ($scope, StockFactory,$location) {
    var ctrl = this;
    ctrl.stocks = [];
	
    ctrl.stockDeleteModalContent = {
        modalTitle: 'Cancellazione prodotto giacenza',
        modalClass: 'modal fade',
        modalId: 'stockdeletion',
        stock: {},
    }
    
    ctrl.selectStock = function (stock) {
        console.log(stock);
        ctrl.stockDeleteModalContent.stock = stock;
    }
    
	ctrl.getStocks = function () {
		StockFactory.getStocks()
            .then (function (resp) {
                console.log(resp);
				ctrl.stocks = resp.data.stocks;
				console.log("STOCKS", ctrl.stocks);
			})
			.catch(function(err) {
				console.log(err);
			});
    };
	
	ctrl.getStocks();
    
    ctrl.deleteStock = function (stock) {
        //chiamata all api
        ctrl.stocks.splice(ctrl.stocks.indexOf(stock),1);
        $location.path('/outbound');    
    }
};

angular
    .module('store')
    .controller('StockController', ['$scope', 'StockFactory','$location', StockController]);