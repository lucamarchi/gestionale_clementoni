/**
 * Created by francescodicara on 19/05/17.
 */

function prodStateEdit (ArticleFactory) {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/prod-state-edit.html',
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
                    .then (function (resp) {
                        console.log(resp);
                        ctrl.freeArticles = resp.data.data.articles;
                        ctrl.entryLimit = 10;
                        ctrl.currentPage = 1;
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            };

            ctrl.getUnassignedToStateProdArticles();

            ctrl.addSelectedArticle = function (article) {
                ctrl.selectedArticles.push(article);
                var index = ctrl.freeArticles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione == "libero") {
                    ctrl.addedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.removedArticles.indexOf(article);
                    if (articlePos != -1){
                        ctrl.removedArticles.splice(articlePos,1);
                    }
                }
                ctrl.freeArticles.splice(index,1);
            };

            ctrl.removeSelectedArticle = function (article){
                ctrl.freeArticles.push(article);
                var index = ctrl.selectedArticles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione !== "libero") {
                    ctrl.removedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.addedArticles.indexOf(article);
                    if (articlePos !== -1){
                        ctrl.addedArticles.splice(articlePos,1);
                    }
                }
                ctrl.selectedArticles.splice(index,1);
            };
        },
        controllerAs: 'prodStateEditCtrl',
    }
}


angular
    .module('store')
    .directive('prodStateEdit', ['ArticleFactory', prodStateEdit]);