function ArticleFactory ($http, myConfig) {
   
    var urlArticles = myConfig.url+'/api/articles';
    var urlArticle = myConfig.url+'/api/article';
    var urlArticlesProd = myConfig.url+'/api/articlesProd';
    var urlArticlesEvas = myConfig.url+'/api/articlesEvas';
    var urlProcessing = myConfig.url+'/api/processes';
    var articleFactory = {};

    articleFactory.getArticles = function () {
        return $http.get(urlArticles);
    };
    
    articleFactory.getProcessing = function(articleId) {
        return $http.get(urlProcessing+'/article/'+articleId);
    };
    
    articleFactory.getUnassignedToStateProdArticles = function () {
        return $http.get(urlArticlesProd+'/libero');
    };

    articleFactory.getUnassignedToOutboundArticles = function () {
        return $http.get(urlArticlesEvas+'/libero');
    };

    articleFactory.updateArticle = function (article) {
        return $http.put(urlArticles+'/'+article.article._id, article);
    };

    articleFactory.deleteArticle = function (articleId) {
        return $http.delete(urlArticle+'/'+articleId);
    };

    articleFactory.completeArticle = function (articleId) {
      return $http.put(urlArticle+"/complete/"+articleId);
    };

    return articleFactory;
}



angular
    .module('store')
    .factory('ArticleFactory', ['$http', 'myConfig', ArticleFactory])