function weighingStock () {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/weighing-stock.html',
        scope: {},
        bindToController: {
            stockList: "=",
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
