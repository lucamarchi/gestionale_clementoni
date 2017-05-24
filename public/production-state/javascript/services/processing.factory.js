function ProcessingFactory ($cookies) {

    var processing = {};

    processing.startProcessing = function (articles) {
        console.log("aaaaa", $cookies.getAll());
        $cookies.putObject("articles", articles);
        return
    };
    
    processing.getArticles = function () {
        return $cookies.getObject("articles");
    };

    /*processing.getProdStateId = function () {
        return processing.prodStateId;
    };*/

    return processing;
}



angular
    .module('store')
    .service('ProcessingFactory', ['$cookies',ProcessingFactory]);