function prodStateArticleTable(features) {
    return {
        restrict: 'E',
        templateUrl: 'public/prodState/templates/prod-state-article-table.html',
        scope: {},
        bindToController: {
            articleList: "=",
        },
        transclude: {},
        controller: function ($scope) {
            var ctrl = this;
            ctrl.features = features;

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
                var weight = 0;
                for (type of typeArray) {
                    typeArticles = articles.filter(function (el) {
                        return (el.tipo == type);
                    });
                    if (typeArticles.length != 0) {
                        angular.forEach(typeArticles, function (el) {
                            weight += el.peso;
                        });
                        articleMap.push({key: type, weight: weight, value: temp});
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


