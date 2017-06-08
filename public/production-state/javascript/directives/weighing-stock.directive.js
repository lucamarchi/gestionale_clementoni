function weighingStock () {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/weighing-stock.html',
        scope: {},
        bindToController: {
            stockList: "=",
            machinery: "="
        },
        transclude: {
        },
        controller: function ($scope) {
        },
        controllerAs: 'weighingStockCtrl',
    }
}

angular
    .module('store')
    .directive('weighingStock', weighingStock);
