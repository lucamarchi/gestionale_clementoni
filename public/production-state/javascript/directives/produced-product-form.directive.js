/**
 * Created by nexse on 17/05/2017.
 */

function producedProductForm () {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/produced-product-form.html',
        bindToController: {
            model:"="
        },
        scope: {},
        controller: function ($scope) {
            var ctrl = this;
            $scope.$watchCollection(
                function () {
                    return ctrl.producedProductForm;
                },
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('producedProductFormValid', newVal);
                    }
                }
            );
        },
        controllerAs: 'producedProductFormCtrl',
    };
}

angular
    .module('store')
    .directive('producedProductForm', producedProductForm);