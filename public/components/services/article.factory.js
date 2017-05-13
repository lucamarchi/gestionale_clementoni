function ArticleFactory ($http, myConfig) {
   
    var urlArticles = myConfig.url+'/api/articles';
    var urlArticlesProd = myConfig.url+'/api/articlesProd';
    var urlStock = myConfig.url+'/api/stock';
    var urlCustomer = myConfig.url+'/api/customerCod';
    var urlProcessing = myConfig.url+'/api/processes';
    var articleFactory = {};

    articleFactory.getArticles = function () {
        return $http.get(urlArticles);
    };
    
    articleFactory.getProcessing = function(articleId) {
        return $http.get(urlProcessing+'/article/'+articleId);
    }
    
    articleFactory.getFreeArticles = function () {
        return $http.get(urlArticlesProd+'/libero');
    };
    
    
    
    return articleFactory;
};



angular
    .module('store')
    .factory('ArticleFactory', ['$http', 'myConfig', ArticleFactory])