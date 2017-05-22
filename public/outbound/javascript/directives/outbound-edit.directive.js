/**
 * Created by nexse on 22/05/2017.
 */

function outboundEdit (OutboundFactory, ArticleFactory, UtilityFactory) {
    return {
        restrict: 'E',
        templateUrl:'public/outbound/templates/outbound-edit.html',
        scope: {},
        bindToController: {
            outbound: "=",
        },
        transclude: {
            'confirmButton': '?confirmButton'
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.currentPage = 1;
            ctrl.freeArticles = [];


            $scope.$watchCollection(
                function () {
                    return ctrl.outbound;
                },
                function (newVal) {
                    console.log(newVal," aaaaaaa");
                    if (newVal) {
                        ctrl.outbound = newVal;
                    }
                }
            );

            ctrl.getUnassignedToOutboundArticles = function () {
                ArticleFactory.getUnassignedToOutboundArticles()
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

            ctrl.getUnassignedToOutboundArticles();

            ctrl.addSelectedArticle = function (article) {
                UtilityFactory.calculateArticleQuantity(article, 'weightSelected', 'spessore', 'larghezza');
                ctrl.outbound.articles.push(article);
                index = ctrl.freeArticles.indexOf(article);
                console.log(article, index);
                if (article.statoEvasione == "libero") {
                    ctrl.outbound.addedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.removedArticles.indexOf(article);
                    if (articlePos != -1){
                        ctrl.outbound.removedArticles.splice(articlePos,1);
                    }
                }
                ctrl.freeArticles.splice(index,1);
            };

            ctrl.removeSelectedArticle = function (article){
                ctrl.freeArticles.push(article);
                index = ctrl.outbound.articles.indexOf(article);
                console.log(article, index);
                if (article.statoEvasione != "libero") {
                    ctrl.outbound.removedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.outbound.addedArticles.indexOf(article);
                    if (articlePos != -1){
                        ctrl.outbound.addedArticles.splice(articlePos,1);
                    }
                }
                ctrl.outbound.articles.splice(index,1);
            };

            $scope.$on('addArticle', function(event, data) {
                ctrl.addSelectedArticle (data);
            });

            $scope.$on('removeArticle', function(event, data) {
                ctrl.removeSelectedArticle (data);
            });

        },

        controllerAs: 'outboundEditCtrl',
    }
}

angular
    .module('store')
    .directive('outboundEdit',['OutboundFactory','ArticleFactory', 'UtilityFactory', outboundEdit]);
