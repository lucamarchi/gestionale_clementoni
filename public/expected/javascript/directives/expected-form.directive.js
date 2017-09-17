
function expectedForm() {
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
                        $scope.$emit('expectedFormValid', newVal);
                    }
                }
            );
        },
        controllerAs: 'expectedFormCtrl',
    }
};

angular
    .module('store')
    .directive('expectedForm', expectedForm);