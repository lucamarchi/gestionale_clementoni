angular
    .module('store')

    .directive('expectedTable', function () {
        return {
            restrict: 'E',
            templateUrl:'public/expected/templates/expecteds-table.html',
            scope: {},
            require: '^^?inboundSet',
            transclude: {
                'button': '?tableButton',
                'pagination': '?tablePagination',
                'filters': '?tableFilter'
            },
            bindToController: {
                expectedList: "=",
                currentPage:"=",
                entryLimit: "=",
            },
            controller: function () {
            },
            link: function ($scope, $element, $attrs, $ctrl) {
                if ($ctrl) {
                    $scope.selectAction = $ctrl.selectExpected;
                    $scope.unlockProductForm = $ctrl.unlockForm;
                }
            },
            controllerAs: 'expTableCtrl',
        }
    })

    .directive('expectedForm', function () {
        return {    
            restrict: 'E',
            templateUrl:'public/expected/templates/expected-form.html',
            bindToController: {
                model:"=",
                insertAction:"&",
                completeAction:"&"
            },
            controller: function () {
            },
            controllerAs: 'expFormCtrl',
        }
    })