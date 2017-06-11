function ProcessingFactory($http, myConfig) {

    var urlProcessing = myConfig.url + '/api/processes';
    var processingFactory = {};

    processingFactory.getArticleProcessing = function (articleId) {
        return $http.get(urlProcessing);
    };

    processingFactory.addProcessing = function (processing) {
        return $http.post(urlProcessing, processing);
    };


    return processingFactory;

}

angular
    .module('store')
    .factory('ProcessingFactory', ['$http', 'myConfig', ProcessingFactory]);