function stockFilter() {
    return {
        restrict: 'E',
        templateUrl:'public/stock/templates/stock-filter.html',
        scope: {},
        bindToController: {
            model: "=",
        },
        controller: function ($scope, features) {
            var ctrl = this;
            ctrl.features = features;

            ctrl.includeVal = function(val, array) {
                var i = array.indexOf(val);
                if (i > -1) {
                    array.splice(i, 1);
                } else {
                    array.push(val);
                }
                console.log(array);
            }

        },
        controllerAs: 'stockFilterCtrl',
    }
}

angular
    .module('store')
    .directive('stockFilter', stockFilter);