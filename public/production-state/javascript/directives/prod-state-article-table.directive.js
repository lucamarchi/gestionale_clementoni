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
                var weight = 0;
                for (type of typeArray) {
                    typeArticles = articles.filter(function (el) {
                        return (el.tipo == type);
                    });
                    if (typeArticles.length != 0) {
                        angular.forEach(typeArticles, function (el) {
                            weight += el.pesoAttuale;
                        });
                        articleMap.push({key: type, weight: weight, value: typeArticles});
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


