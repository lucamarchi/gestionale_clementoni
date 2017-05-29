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
        machineryList: {},
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
        selectedArticle: {},
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
        console.log("asdasadsasdad", ctrl.selectedArticles);
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

    ctrl.showMachineryList = function () {
        if (ctrl.selectedArticles && ctrl.selectedArticles.length > 1) {
            ctrl.machinerySelectionModalContent.machineryList = {"slitter": "a"};
        }
        else {
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari;
        }
    };

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

    $scope.$on('producedProductFormValid', function (event, data) {
        if (data) {
            ctrl.producedProductFormValid = data.$valid;
        }
    });

    ctrl.addStock = function (stock) {
        console.log(stock);
        if (ctrl.selectedMachinery.hasOwnProperty('slitter')) {
            ctrl.selectedStocks = [];
        }
        ctrl.selectedStocks.push(stock);
        $('#' + ctrl.stockSelectionModalContent.modalId).modal('hide');
        var index = ctrl.stockSelectionModalContent.stockList.indexOf(stock);
        ctrl.stockSelectionModalContent.stockList.splice(index, 1);
        ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.stocks = ctrl.selectedStocks;
            return processing;
        });
        console.log("processingList", ctrl.processingList);
    };

    ctrl.openProductForm = function (article) {
        ctrl.producedProductEntryModalContent.selectedArticle = article;
        ctrl.producedProductEntryModalContent.producedProduct.materiale = ctrl.selectedStocks[0].materiale;
        ctrl.producedProductEntryModalContent.producedProduct.tipo = ctrl.selectedStocks[0].tipo;
        if (ctrl.selectedStocks[0].qualita) {
            ctrl.producedProductEntryModalContent.producedProduct.qualita = ctrl.selectedStocks[0].qualita;
        }
        ctrl.producedProductEntryModalContent.producedProduct.spessoreNominale = ctrl.selectedStocks[0].spessoreNominale.toString();
        ctrl.producedProductEntryModalContent.producedProduct.spessoreEffettivo = ctrl.selectedStocks[0].spessoreEffettivo;
        ctrl.producedProductEntryModalContent.producedProduct.larghezzaNominale = ctrl.selectedStocks[0].larghezzaNominale.toString();
        ctrl.producedProductEntryModalContent.producedProduct.larghezzaEffettiva = ctrl.selectedStocks[0].larghezzaEffettiva;
        if (ctrl.selectedStocks[0].superficie) {
            ctrl.producedProductEntryModalContent.producedProduct.superficie = ctrl.selectedStocks[0].superficie;
        }
        if (ctrl.selectedStocks[0].finitura) {
            ctrl.producedProductEntryModalContent.producedProduct.finitura = ctrl.selectedStocks[0].finitura;
        }
        if (ctrl.selectedStocks[0].colore) {
            ctrl.producedProductEntryModalContent.producedProduct.colore = ctrl.selectedStocks[0].colore;
        }
        ctrl.producedProductEntryModalContent.producedProduct.scelta = ctrl.selectedStocks[0].scelta;
    };

    ctrl.addProducedProduct = function (product, article) {
        console.log(product);
        ctrl.producedProducts.push(product);
        var trovato = ctrl.processingList.findIndex(function (processing) {
            processing.article == article;
        })
        if (trovato != -1) {
            ctrl.processingList[trovato].producedProduct = product;
        }
        console.log(ctrl.processingList);
    };

}

angular
    .module('store')
    .controller('ProcessingController', ['$scope', 'features', 'ProcessingProgressFactory', 'ProductFactory', '$location', '$routeParams', ProcessingController])