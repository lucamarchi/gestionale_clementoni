function ProdOverviewFactory ($http, myConfig) {
   
    var urlArticles = myConfig.url+'/api/articles';
    var urlStock = myConfig.url+'/api/stock';
    var urlCustomer = myConfig.url+'/api/customerCod';
    var urlProcessing = myConfig.url+'/api/processes';
    var articleFactory = {};

    articleFactory.getArticles = function () {
        return $http.get(urlArticles);
    };
    
    articleFactory.getCustomer = function (customerId) {
        return $http.get(urlCustomer+'/'+customerId);
    }
    
    articleFactory.getProcessing = function(articleId) {
        return $http.get(urlProcessing+'/article/'+articleId);
    }
    
    articleFactory.getStock = function (stockId) {
        return $http.get(urlStock+'/'+stockId);
    }
    
    return articleFactory;
};



angular
    .module('store')
    .factory('ProdOverviewFactory', ['$http', 'myConfig', ProdOverviewFactory])