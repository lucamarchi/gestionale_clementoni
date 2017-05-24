function ProcessingProgressFactory ($cookies) {

    var processing = {};

    processing.startProcessing = function (articles) {
        console.log("aaaaa", $cookies.getAll());
        $cookies.putObject("articles", articles);
        return
    };
    
    processing.getArticles = function () {
        return $cookies.getObject("articles");
    };

    return processing;
}



angular
    .module('store')
    .service('ProcessingProgressFactory', ['$cookies',ProcessingProgressFactory]);