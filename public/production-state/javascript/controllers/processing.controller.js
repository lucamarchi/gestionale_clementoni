function ProcessingController($scope, features, ProcessingProgressFactory, ProcessingFactory, ProductFactory, UtilityFactory, UserService, $location, $routeParams) {
    var ctrl = this;

    ctrl.processingList = [];

    ctrl.selectedMachinery = [];
    ctrl.selectedArticles = [];
    ctrl.selectedStocks = [];
    ctrl.producedProducts = [];

    ctrl.isMachinerySelected = function () {
        return ctrl.selectedMachinery.length != 0;
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
        producedProduct: undefined,
        selectedArticle: undefined,
    };

    ctrl.weighingStockModalContent = {
        modalClass: 'modal fade',
        modalTitle: 'Pesatura Stock',
        modalId: 'weighingstock',
    };

    ctrl.isolateProcessingModalContent = {
        modalBody: "Creare nastro/pacco a magazzino?",
        modalClass: 'modal fade',
        modalTitle: 'Pesatura Stock',
        modalId: 'isolateprocessing',
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
    $scope.$on('weighingStockFormValid', function (event, data) {
        if (data) {
            ctrl.weighingStockFormValid = data.$valid;
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
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari.filter(function (machine) {
                return machine.name == "slitter";
            })
        }
        else if (ctrl.selectedStocks && ctrl.selectedStocks.length > 1) {
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari.filter(function (machine) {
                return machine.name != "slitter";
            })
        }
        else {
            ctrl.machinerySelectionModalContent.machineryList = features.macchinari;
        }
        console.log(ctrl.machinerySelectionModalContent.machineryList);
    };

    ctrl.selectMachinery = function (machinery) {
        console.log("machinery", machinery);
        ctrl.selectedMachinery = [];
        ctrl.selectedMachinery.push(machinery);
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
        if (ctrl.selectedMachinery[0].sigle == 'a') {
            ctrl.stockSelectionModalContent.stockList = ctrl.stockSelectionModalContent.stockList.concat(ctrl.selectedStocks);
            ctrl.selectedStocks = [];
        }
        ctrl.selectedStocks.push(stock);

        $('#' + ctrl.stockSelectionModalContent.modalId).modal('hide');
        var index = ctrl.stockSelectionModalContent.stockList.indexOf(stock);
        ctrl.stockSelectionModalContent.stockList.splice(index, 1);

    };

    ctrl.openProductForm = function (article) {
        if (article) {
            var trovato = ctrl.processingList.findIndex(function (processing) {
                return processing.article == article;
            });
            if (trovato != -1) {
                ctrl.producedProductEntryModalContent.selectedArticle = article;
                if (ctrl.processingList[trovato].producedProduct) {
                    ctrl.producedProductEntryModalContent.producedProduct = ctrl.processingList[trovato].producedProduct;
                }
                else {
                    ctrl.producedProductEntryModalContent.producedProduct = {};
                    UtilityFactory.producedProductFromStock(ctrl.producedProductEntryModalContent.producedProduct, ctrl.selectedStocks[0]);
                }
            }
        }
        else {
            ctrl.producedProductEntryModalContent.selectedArticle = undefined;
            ctrl.producedProductEntryModalContent.producedProduct = {};
            UtilityFactory.producedProductFromStock(ctrl.producedProductEntryModalContent.producedProduct, ctrl.selectedStocks[0]);
        }
        $('#' + ctrl.producedProductEntryModalContent.modalId).modal('show');
    };

    ctrl.addProducedProduct = function (product, article) {
        product.pesoNetto = product.pesoIniziale;
        product.pesoLordo = product.pesoNetto;
        UtilityFactory.productValuesForType(product,
            "pesoNetto", "spessoreEffettivo", "larghezzaEffettiva");
        console.log(product);
        if (article) {
            var trovato = ctrl.processingList.findIndex(function (processing) {
                return processing.article == article;
            });
            if (trovato != -1) {
                ctrl.processingList[trovato].producedProduct = product;
                ctrl.producedProducts[trovato] = product;
            }
        }
        else {
            var processing = {};
            processing.article = undefined;
            processing.stocks = [];
            processing.producedProduct = product;
            processing.machinery = "";
            ctrl.processingList.push(processing);
            ctrl.producedProducts.push(product);
        }
        console.log(ctrl.processingList);
    };

    ctrl.isComplete = function () {
        return ctrl.isMachinerySelected()
            && ctrl.selectedStocks.length != 0
            && (ctrl.selectedArticles.length <= ctrl.producedProducts.length);
    };

    ctrl.createIsolatedProduct = function (choose) {
        if (choose == true) {
            ctrl.openProductForm();
        }
        else {
            $('#' + ctrl.weighingStockModalContent.modalId).modal('show');

        }

    };

    ctrl.confirmProcessing = function () {
        if (ctrl.selectedMachinery[0].sigle == "a") {
            $('#' + ctrl.isolateProcessingModalContent.modalId).modal('show');
        }
        else {
            $('#' + ctrl.weighingStockModalContent.modalId).modal('show');
        }

    };

    ctrl.completeProcessing = function () {
        var operatore = UserService.getUser().username;
        ProcessingProgressFactory.createProcessing(ctrl.selectedStocks, ctrl.selectedMachinery[0].sigle, ctrl.producedProducts, ctrl.processingList, operatore);
        console.log(ctrl.processingList);
        ProcessingFactory.addProcessing({processes : ctrl.processingList})
            .then(function (resp) {
                console.log(resp);
                $location.path("/productionState/details/" + $routeParams.id);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}

angular
    .module('store')
    .controller('ProcessingController', ['$scope', 'features', 'ProcessingProgressFactory', 'ProcessingFactory', 'ProductFactory', 'UtilityFactory', 'UserService', '$location', '$routeParams', ProcessingController]);