function ProdOverviewController (ProdOverviewFactory) {
    var ctrl = this;
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
    
    ctrl.getArticles = function () {
        ProdOverviewFactory.getArticles()
            .then (function (resp) {
                console.log(resp);
                ctrl.articles = resp.data.articles;
            })
            .catch(function(err) {
                console.log(err);
            })
    };
	
    ctrl.getArticles();
}

angular
    .module('store')
    .controller('ProdOverviewController', ['ProdOverviewFactory', ProdOverviewController])