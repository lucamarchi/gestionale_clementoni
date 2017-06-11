function prodStateArticleTable(features) {
    return {
        restrict: 'E',
        templateUrl: 'public/production-state/templates/prod-state-article-table.html',
        scope: {},
        bindToController: {
            articleList: "=",
        },
        transclude: {
            buttonAction: "buttonAction"
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.features = features;

            console.log("aaaaa", ctrl.articleList);
            $scope.$watchCollection(
                function () {
                    return ctrl.articleList;
                },
                function (newVal) {

                    if (newVal) {
                        ctrl.articleMap = ctrl.createArticleMap(newVal);
                    }
                }
            );

            ctrl.createArticleMap = function (articles) {
                var typeArray = features.tipi;
                var articleMap = [];
                var typeArticles;
                for (type of typeArray) {
                    var weight = 0;
                    var linearMeters = 0;
                    typeArticles = articles.filter(function (el) {
                        return (el.tipo == type);
                    });
                    if (typeArticles.length != 0) {
                        angular.forEach(typeArticles, function (el) {
                            weight += el.pesoAttuale;
                            if (el.quantita != 0) {
                                linearMeters += el.quantita * el.lunghezza;
                            }
                        });
                        articleMap.push({key: type, weight: weight, linearMeters:linearMeters, value: typeArticles});
                    }
                }
                console.log(articleMap);
                return articleMap;
            };
        },
        controllerAs: 'prodStateArticleTableCtrl',
    }
}

angular
    .module('store')
    .directive('prodStateArticleTable', ['features', prodStateArticleTable]);


