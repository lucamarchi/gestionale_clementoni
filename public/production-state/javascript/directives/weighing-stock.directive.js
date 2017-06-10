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
            var ctrl = this;
            $scope.$watchCollection(
                function () {
                    return ctrl.weighingStockForm;
                },
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('weighingStockFormValid', newVal);
                    }
                }
            );
        },
        controllerAs: 'weighingStockCtrl',
    }
}

angular
    .module('store')
    .directive('weighingStock', weighingStock);
