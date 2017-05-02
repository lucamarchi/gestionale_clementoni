function inboundProductForm () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-product-form.html',
        bindToController: {
			model:"=",
        },
        transclude: {
            'actionButton': '?actionButton',
            'cancelButton': '?cancelButton'
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
        link: function ($scope, $element, $attrs, $ctrl) {
        },
        controllerAs: 'inboundProductFormCtrl',
    };
};

function inboundOrderForm () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-order-form.html',
		scope: {},
        bindToController: {
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
    .directive('inboundProductForm', inboundProductForm)
    .directive('inboundOrderForm', inboundOrderForm)
    