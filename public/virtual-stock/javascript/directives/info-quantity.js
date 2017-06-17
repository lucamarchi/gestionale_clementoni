function infoQuantity () {
    return {
        restrict: 'E',
        templateUrl:'public/virtual-stock/templates/info-quantity.html',
        scope: {},
        bindToController: {
            quantityMap: "=",
            keyHeader: "=",
            valueHeader: "="
        },
        transclude: {
        },
        controller: function () {
            var ctrl = this;
            console.log("saasdadsa")


        },
        controllerAs: 'infoQuantityCtrl',
    }
}

angular
    .module('store')
    .directive('infoQuantity', infoQuantity);