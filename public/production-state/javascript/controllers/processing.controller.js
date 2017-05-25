function ProcessingController($scope, features, ProcessingProgressFactory, ProductFactory, $location, $routeParams) {
    var ctrl = this;

    ctrl.processingList = [];

    ctrl.selectedMachinery = {};
    ctrl.selectedArticles = [];
    ctrl.selectedStocks = [];
    ctrl.producedProducts = [];

    ctrl.machinerySelectionModalContent = {
        url: 'public/production-state/templates/machinery-selection.html',
        modalTitle: 'Seleziona macchinario',
        modalClass: 'modal fade',
        modalId: 'machineryselection',
        machineryList: features.macchinari,
    };

    ctrl.stockSelectionModalContent = {
        url: 'public/production-state/templates/stock-selection.html',
        modalTitle: 'Seleziona Stocks',
        modalClass: 'modal modal-xl fade',
        modalId: 'stockselection',
        stockList: undefined,
    };

    ctrl.producedProductEntryModalContent = {
        modalClass: 'modal modal-xl fade',
        modalTitle: 'Inserimento collo prodotto',
        modalId: 'producedproductentry',
        producedProduct: {},
    };

    ctrl.backProdState = function () {
        $location.path("/productionState/details/" + $routeParams.id);
    };

    $scope.$on('inboundProductFormValid', function (event, data) {
        if (data) {
            ctrl.producedProductFormValid = data.$valid;
        }
    });

    ctrl.selectArticles = function () {
        console.log(ProcessingProgressFactory.getArticles());
        var processing;
        ctrl.selectedArticles = ProcessingProgressFactory.getArticles();
        angular.forEach(ctrl.selectedArticles, function (article) {
            processing = {};
            processing.article = article;
            processing.stocks = [];
            processing.producedProduct = {};
            processing.machinery = "";
            ctrl.processingList.push(processing);
        });
        console.log("processingList", ctrl.processingList);

    };

    ctrl.selectArticles();

    ctrl.selectMachinery = function (machineryName, machinerySigle) {
        ctrl.selectedMachinery = {[machineryName]: machinerySigle};
        ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.machinery = machinerySigle;
            return processing;
        });
        console.log("processingList", ctrl.processingList);
    };

    ctrl.showStockList = function () {
        if (!ctrl.stockSelectionModalContent.stockList) {
            ProductFactory.getProducts()
                .then(function (resp) {
                    console.log(resp);
                    ctrl.stockSelectionModalContent.stockList = resp.data.data.products;
                    console.log("STOCKS", ctrl.stockSelectionModalContent.stockList);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    };

    ctrl.addStock = function (stock) {
        console.log(stock);
        ctrl.selectedStocks.push(stock);
        var index = ctrl.stockSelectionModalContent.stockList.indexOf(stock);
        ctrl.stockSelectionModalContent.stockList.splice(index, 1);
        ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.stocks = ctrl.selectedStocks;
            return processing;
        });
        console.log("processingList", ctrl.processingList);
    };

    ctrl.openProductForm = function () {
        console.log(ctrl.selectedArticles[0]);
        ctrl.producedProductEntryModalContent.producedProduct = Object.assign({}, ctrl.selectedArticles[0]);

    };

    ctrl.addProducedProduct = function (product) {
        console.log(product);
        ctrl.producedProducts = [];
        ctrl.producedProducts.push(product);
    }

}

angular
    .module('store')
    .controller('ProcessingController', ['$scope', 'features', 'ProcessingProgressFactory', 'ProductFactory', '$location', '$routeParams', ProcessingController])