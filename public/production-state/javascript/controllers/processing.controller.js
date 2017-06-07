function ProcessingController($scope, features, ProcessingProgressFactory, ProductFactory, UtilityFactory, $location, $routeParams) {
    var ctrl = this;

    ctrl.processingList = [];

    ctrl.selectedMachinery = {};
    ctrl.selectedArticles = [];
    ctrl.selectedStocks = [];
    ctrl.producedProducts = [];

    ctrl.isMachinerySelected = function () {
        return Object.keys(ctrl.selectedMachinery).length != 0;
    };

    ctrl.machinerySelectionModalContent = {
        url: 'public/production-state/templates/machinery-selection.html',
        modalTitle: 'Seleziona macchinario',
        modalClass: 'modal fade',
        modalId: 'machineryselection',
        machineryList: undefined,
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

    ctrl.weighingStockModalContent = {
        modalClass: 'modal fade',
        modalTitle: 'Pesatura Stock',
        modalId: 'weighingstock',
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
            processing.producedProduct = undefined;
            processing.machinery = "";
            ctrl.processingList.push(processing);
        });
        console.log("processingList", ctrl.processingList);

    };

    ctrl.selectArticles();

    ctrl.showMachineryList = function () {
        if ((ctrl.selectedArticles && ctrl.selectedArticles.length) > 1) {
            ctrl.machinerySelectionModalContent.machineryList = {"slitter": "a"};
        }
        else if (ctrl.selectedStocks && ctrl.selectedStocks.length > 1) {
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari;
            delete ctrl.machinerySelectionModalContent.machineryList.slitter;
        }
        else {
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari;
        }
    };

    ctrl.selectMachinery = function (machineryName, machinerySigle) {
        ctrl.selectedMachinery = {[machineryName]: machinerySigle};
        /*ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.machinery = machinerySigle;
            return processing;
        });*/
        console.log("processingList", ctrl.processingList);
    };

    ctrl.showStockList = function () {
        if (!ctrl.stockSelectionModalContent.stockList) {
            ProductFactory.getProducts()
                .then(function (resp) {
                    console.log(resp);
                    ctrl.stockSelectionModalContent.stockList = resp.data.data.products;

                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        console.log("STOCKS", ctrl.stockSelectionModalContent.stockList);
    };

    $scope.$on('producedProductFormValid', function (event, data) {
        if (data) {
            ctrl.producedProductFormValid = data.$valid;
        }
    });

    ctrl.addStock = function (stock) {
        console.log(stock);
        if (ctrl.selectedMachinery.hasOwnProperty('slitter')) {
            ctrl.stockSelectionModalContent.stockList = ctrl.stockSelectionModalContent.stockList.concat(ctrl.selectedStocks);
            ctrl.selectedStocks = [];

        }
        ctrl.selectedStocks.push(stock);

        $('#' + ctrl.stockSelectionModalContent.modalId).modal('hide');
        var index = ctrl.stockSelectionModalContent.stockList.indexOf(stock);
        ctrl.stockSelectionModalContent.stockList.splice(index, 1);
        console.log("dopo ", ctrl.stockSelectionModalContent.stockList, ctrl.selectedStocks);
        /*ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.stocks = ctrl.selectedStocks;
            return processing;
        });*/

        console.log("processingList", ctrl.processingList);
    };

    ctrl.openProductForm = function (article) {
        var trovato = ctrl.processingList.findIndex(function (processing) {
            return processing.article == article;
        });
        if (trovato != -1) {
            ctrl.producedProductEntryModalContent.selectedArticle = article;
            if (ctrl.processingList[trovato].producedProduct) {
                ctrl.producedProductEntryModalContent.producedProduct = ctrl.processingList[trovato].producedProduct;
                console.log("if");
            }
            else {
                ctrl.producedProductEntryModalContent.producedProduct = {};
                UtilityFactory.producedProductFromStock(ctrl.producedProductEntryModalContent.producedProduct, ctrl.selectedStocks[0]);
            }
        }
    };

    ctrl.addProducedProduct = function (product, article) {
        product.pesoNetto = product.pesoIniziale;
        product.pesoLordo = product.pesoNetto;
        UtilityFactory.productValuesForType(ctrl.producedProductEntryModalContent.producedProduct, "pesoNetto", "spessoreEffettivo", "larghezzaEffettiva");
        console.log(product);

        var trovato = ctrl.processingList.findIndex(function (processing) {
            return processing.article == article;
        });
        if (trovato != -1) {
            ctrl.processingList[trovato].producedProduct = product;
            ctrl.producedProducts[trovato] = product;
        }
        console.log(ctrl.processingList);
    };

    ctrl.confirmProcessing = function () {
        var scartoMap = ProcessingProcessFactory.createScartoMap (ctrl.selectedStocks, ctrl.selectedMachinery, ctrl.producedProducts);
        
        ctrl.processingList = ctrl.processingList.map(function (processing) {
            processing.machinery = machinerySigle;
            processing.stocks = ctrl.selectedStocks;
            return processing;
        });

    }

}

angular
    .module('store')
    .controller('ProcessingController', ['$scope', 'features', 'ProcessingProgressFactory', 'ProductFactory', 'UtilityFactory', '$location', '$routeParams', ProcessingController]);