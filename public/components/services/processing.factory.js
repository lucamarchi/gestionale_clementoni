function ProcessingFactory () {
   
    var processing = {};
    
    processing.articles = [];
    processing.prodStateId = undefined;
    processing.stocks = [];
    
    processing.addArticles = function (article, prodStateId) {
        processing.articles.splice(0, processing.articles.length);
        processing.articles.push(article); 
        processing.prodStateId = prodStateId;
    }
    
    processing.getArticles = function () {
        return processing.articles;
    }
    
//    processing.addStocks = function (article) {
//        processing.stocks.push(article);
//    }
//    
//    processing.getStocks = function () {
//        return processing.stocks;
//    }
    
    processing.getProdStateId = function () {
        return processing.prodStateId;
    }
    
    return processing;
    
};



angular
    .module('store')
    .factory('ProcessingFactory', ProcessingFactory)