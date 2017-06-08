function ProcessingProgressFactory($cookies) {

    var processing = {};

    processing.startProcessing = function (articles) {
        console.log("aaaaa", $cookies.getAll());
        $cookies.putObject("articles", articles);
    };

    processing.getArticles = function () {
        return $cookies.getObject("articles");
    };

    processing.createScartoMap = function (stockList, machinerySigle, producedProducts, processingList) {
        var scartoTemp;
        var scartoMap = {};
        var scarto = 0;
        var stockId;
        var producedWeight = producedProducts.reduce(function (a, b) {
            return a.pesoLordo + b.pesoLordo;
        });
        if (machinerySigle == "a") {
            scarto = stockList[0].pesoLordo - stockList[0].nuovoPesoLordo - producedWeight;
            stockId = stockList[0]._id;
            scartoMap[stockId] = scarto;
            stockList[0].pesoLordo = stockList[0].nuovoPesoLordo;
            stockList[0].pesoNetto = stockList[0].pesoLordo; //controllare
            delete stockList[0].nuovoPesoLordo;
            delete stockList[0].nuovoScarto;
            angular.forEach(processingList, function (processing) {
                scartoTemp = (scartoMap[stockId] * processing.producedProduct.pesoNetto) / producedWeight;
                processing.scarto = {[stockId] : scartoTemp};
                processing.machinery = machinerySigle;
                processing.stocks = stockList;
            })
        }
        else {
            angular.forEach(stockList, function (stock) {
                scarto = stock.nuovoScarto;
                stockId = stock._id;
                scartoMap[stockId] = scarto;
                stock.pesoLordo = stock.nuovoPesoLordo;
                stock.pesoNetto = stock.pesoLordo; //controllare
                delete stock.nuovoPesoLordo;
                delete stock.nuovoScarto;
            });
            processingList[0].scarto = scartoMap;
            processingList[0].machinery = machinerySigle;
            processingList[0].stocks = stockList;
        }
        console.log(processingList);
    };

    return processing;
}


angular
    .module('store')
    .service('ProcessingProgressFactory', ['$cookies', ProcessingProgressFactory]);