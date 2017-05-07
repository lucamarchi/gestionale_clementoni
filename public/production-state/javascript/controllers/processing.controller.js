function ProcessingController ($scope, features, ProcessingFactory, StockFactory, $location) {
    var ctrl = this;
    
    ctrl.selectedMachinery = {};
    ctrl.selectedArticles = [];
    ctrl.selectedStocks = [];
    ctrl.producedProducts = [];
    
    ctrl.machinerySelectionModalContent = {
        url:'public/production-state/templates/machinery-selection.html',
        modalTitle: 'Seleziona macchinario',
        modalClass: 'modal fade',
        modalId: 'machineryselection',
        machineryList: features.macchinari,
    }
    
    ctrl.stockSelectionModalContent = {
        url:'public/production-state/templates/stock-selection.html',
        modalTitle: 'Seleziona Stocks',
        modalClass: 'modal modal-xl fade',
        modalId: 'stockselection',
        stockList: [],
    }
    
    ctrl.producedProductEntryModalContent = {
        modalClass: 'modal modal-xl fade',
        modalTitle: 'Inserimento collo prodotto',
        modalId: 'producedproductentry',
        producedProduct: {},
    }
      
    ctrl.backProdState = function () {
        var prodStateId = ProcessingFactory.getProdStateId();
        $location.path("/productionState/info/"+prodStateId);
    }
    
    $scope.$on('inboundProductFormValid', function (event, data) {
        if (data) {
            ctrl.producedProductFormValid = data.$valid;
        }
    })
    
    ctrl.selectArticle = function () {
        console.log(ProcessingFactory.getArticles());
        ctrl.selectedArticles = ProcessingFactory.getArticles();   
//        if (ctrl.selectedArticles.length == 0) {
//            $location.path("/productionState");
//        }
//        else {
//            console.log(ctrl.selectedArticles[0].stock);
//            ctrl.selectedStocks.push(ctrl.selectedArticles[0].stock);
//        }
    }
    
    ctrl.selectArticle();
    
    ctrl.selectMachinery = function (machineryName, machinerySigle) {
        var machinery = {[machineryName]: machinerySigle};
        ctrl.selectedMachinery = machinery;
    }
    
    ctrl.showStockList = function () {
        StockFactory.getStocks()
            .then (function (resp) {
                console.log(resp);
                ctrl.stockSelectionModalContent.stockList = resp.data.stocks;
				console.log("STOCKS", ctrl.stocks);
			})
			.catch(function(err) {
				console.log(err);
			});
    } 
    
    ctrl.addStock = function(stock) {
        console.log(stock);
        ctrl.selectedStocks.push(stock);
    }
    
    ctrl.openProductForm = function () {
        console.log(ctrl.selectedArticles[0]);
        ctrl.producedProductEntryModalContent.producedProduct = Object.assign({},ctrl.selectedArticles[0]);
        
    }
    
    ctrl.addProducedProduct = function(product) {
        console.log(product);
        ctrl.producedProducts = [];
        ctrl.producedProducts.push(product);
    }
    
}

angular
    .module('store')
    .controller('ProcessingController',['$scope','features','ProcessingFactory','StockFactory','$location', ProcessingController])