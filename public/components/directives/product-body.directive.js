function productBodyDirective () {
    return {
        restrict: 'E',
        templateUrl: 'public/components/directives/product-body.html',
        scope: {},
        bindToController: {
            product: "=",
        },
        transclude: {
            'buttons': '?buttons'
        },
        controller: function ($scope) {
            var ctrl = this;
        },
        
        controllerAs: 'productBodyCtrl'
    }
}

angular
    .module('store')
    .directive('productBodyDirective', productBodyDirective)