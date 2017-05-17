/**
 * Created by nexse on 17/05/2017.
 */

function inboundOrderForm () {
    return {
        restrict: 'E',
        templateUrl:'public/inbound/templates/inbound-order-form.html',
        scope: {},
        bindToController: {
            model:"=",
        },

        controller: function ($scope) {
            var ctrl = this;

            $scope.$watchCollection(
                function () {
                    return ctrl.inOrderForm;
                },
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('orderFormValid', newVal);
                    }
                }
            );
        },


        controllerAs: 'inOrderFormCtrl',
    };
};

angular
    .module('store')
    .directive('inboundOrderForm', inboundOrderForm)