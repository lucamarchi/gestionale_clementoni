/**
 * Created by nexse on 22/05/2017.
 */

function outboundForm () {
    return {
        restrict: 'E',
        templateUrl:'public/outbound/templates/outbound-form.html',
        scope: {},
        bindToController: {
            model: "=",
        },

        controller: function ($scope) {
            var ctrl = this;

            $scope.$watchCollection(
                function () {
                    return ctrl.outboundForm;
                },
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('outboundFormValid', ctrl.outboundForm);
                    }
                }
            );
        },


        controllerAs: 'outboundFormCtrl',
    };
}

angular
    .module('store')
    .directive('outboundForm', outboundForm);