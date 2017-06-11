function StockController ($scope, ProductFactory,$location) {
    var ctrl = this;
    ctrl.stocks = [];
    ctrl.currentPage = 1;
    ctrl.entryLimit = 1;
	
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
	
	ctrl.getStocks();
    
    ctrl.deleteStock = function (stock) {
        //chiamata all api
        ctrl.stocks.splice(ctrl.stocks.indexOf(stock),1);    
    }
};

angular
    .module('store')
    .controller('StockController', ['$scope', 'ProductFactory','$location', StockController]);