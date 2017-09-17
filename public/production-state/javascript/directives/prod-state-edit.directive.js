
function prodStateEdit(ArticleFactory) {
    return {
        restrict: 'E',
        templateUrl: 'public/production-state/templates/prod-state-edit.html',
        scope: {},
        bindToController: {
            prodState: "=",
        },
        transclude: {
            'confirmButton': '?confirmButton'
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.freeArticles = [];

            $scope.$watchCollection(
                function () {
                    return ctrl.prodState;
                },
                function (newVal) {
                    if (newVal) {
                        ctrl.prodState = newVal;
                        console.log(newVal);
                    }
                }
            );

            ctrl.getUnassignedToStateProdArticles = function () {
                ArticleFactory.getUnassignedToStateProdArticles()
                    .then(function (resp) {
                        console.log(resp);
                        ctrl.freeArticles = resp.data.data.articles;
                        ctrl.entryLimit = 10;
                        ctrl.currentPage = 1;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            };

            ctrl.getUnassignedToStateProdArticles();

            ctrl.addSelectedArticle = function (article) {
                ctrl.prodState.articles.push(article);
                var index = ctrl.freeArticles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione == "libero") {
                    ctrl.prodState.addedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.prodState.removedArticles.indexOf(article);
                    if (articlePos != -1) {
                        ctrl.prodState.removedArticles.splice(articlePos, 1);
                    }
                }
                ctrl.freeArticles.splice(index, 1);
            };

            ctrl.removeSelectedArticle = function (article) {
                ctrl.freeArticles.push(article);
                var index = ctrl.prodState.articles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione !== "libero") {
                    ctrl.prodState.removedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.prodState.addedArticles.indexOf(article);
                    if (articlePos !== -1) {
                        ctrl.prodState.addedArticles.splice(articlePos, 1);
                    }
                }
                ctrl.prodState.articles.splice(index, 1);
            };

        },
        controllerAs: 'prodStateEditCtrl',
    }
}


angular
    .module('store')
    .directive('prodStateEdit', ['ArticleFactory', prodStateEdit]);