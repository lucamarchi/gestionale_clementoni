/**
 * Created by nexse on 17/05/2017.
 */

function inboundProductForm () {
    return {
        restrict: 'E',
        templateUrl:'public/inbound/templates/inbound-product-form.html',
        bindToController: {
            model:"="
        },
        scope: {},
        controller: function ($scope) {
            var ctrl = this;
            $scope.$watchCollection(
                function () {
                    return ctrl.inboundProductForm;
                },
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('inboundProductFormValid', newVal);
                    }
                }
            );
        },
        controllerAs: 'inboundProductFormCtrl',
    };
};

angular
    .module('store')
    .directive('inboundProductForm', inboundProductForm)