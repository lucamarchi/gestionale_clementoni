angular
    .module('store')

    .directive('modalDirective', function() {
        return {
            restrict: 'E',
            bindToController:{
                modalContent: '=',
            },
            scope: {},
            transclude: {
                'openButton' : '?openButton',
                'actionButtons' : '?actionButtons',
            },
            templateUrl: 'public/components/directives/modal.html',
            controller: function () {
            },
            link: function ($scope, $element, $attrs, $ctrl) {
            },
            controllerAs: 'modalDirCtrl'
        };
    })