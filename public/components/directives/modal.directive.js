angular
    .module('store')

    .directive('modalDirective', function() {
            return {
            restrict: 'E',
            bindToController:{
                modalContent: '=',
                buttonName: '@',
                buttonAction: '&',
                okAction: '&',
            },
            scope: {},
            templateUrl: 'public/components/directives/modal.html',
            transclude: true,
            controller: function () {
            },
            link: function ($scope, $element, $attrs, $ctrl) {
            },
            controllerAs: 'modalDirCtrl'
        };
    })