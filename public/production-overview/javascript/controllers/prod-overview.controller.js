function ProdOverviewController (ArticleFactory) {
    var ctrl = this;
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
    
    ctrl.getArticles = function () {
        ArticleFactory.getArticles()
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
    .controller('ProdOverviewController', ['ArticleFactory', ProdOverviewController])