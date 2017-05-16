angular
    .module('store')

    .directive('expectedTable', function () {
        return {
            restrict: 'E',
            templateUrl:'public/expected/templates/expecteds-table.html',
            scope: {},
            transclude: {
                'tableButton': '?tableButton',
                'pagination': '?tablePagination',
                'filters': '?tableFilter'
            },
            bindToController: {
                expectedList: "=",
                currentPage:"=",
                entryLimit: "=",
            },
            controller: function ($scope) {
            },
            link: function ($scope, $element, $attrs) {
            },
            controllerAs: 'expTableCtrl',
        }
    })

    .directive('expectedForm', function () {
        return {    
            restrict: 'E',
            templateUrl:'public/expected/templates/expected-form.html',
            scope: {},
            transclude: {
                'formButton': '?formButton',
            },
            bindToController: {
                model: "=",
            },
            controller: function ($scope) {
                var ctrl = this;
                $scope.$watchCollection(
                    function () {
                        return ctrl.expectedForm;
                    }, 
                    function (newVal) {
                        if (newVal) {
                            console.log(newVal);
                            $scope.$emit('expectedFormValid', newVal);
                        }
                    }
                );
            },
            controllerAs: 'expFormCtrl',
        }
    })

    .directive('expectedFilters', function () {
        return {    
            restrict: 'E',
            templateUrl:'public/expected/templates/expected-filters.html',
            scope: {},
            bindToController: {
                model: "=",
            },
            controller: function () {
            },
            controllerAs: 'expFilterCtrl',
        }
    })