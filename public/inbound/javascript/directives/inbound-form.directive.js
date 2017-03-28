function inboundProductForm () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-product-form.html',
        transclude: {
            'actionButton': '?actionButton'
        },
		scope: {},
        require: ["^^inboundSet", "inboundProductForm"],
        link: function ($scope, $element, $attrs, $ctrl) {
            $scope.addProduct = $ctrl[0].addInboundProduct;
            $scope.updateProduct = $ctrl[0].updateInboundProduct;
            $scope.unlockedForm = $ctrl[0].unlockedForm;
            $scope.cancel = $ctrl[0].lockForm;
            $scope.$watchCollection(
                function () {
                    return $ctrl[1].inProdForm;
                }, 
                function (newVal) {
                    if (newVal) {
                        $scope.valid = newVal.$valid;
                        console.log($scope.valid);
                    }
                }
            );
        },
        bindToController: {
			model:"=",
        },
        controller: function ($scope) {
        },
        
        controllerAs: 'inProdFormCtrl',
    };
};

function inboundOrderForm () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-order-form.html',
		scope: {},
        require: ["inboundOrderForm", "^^inboundSet"],
        bindToController: {
			model:"=",
        },
        link: function ($scope, $element, $attrs, $ctrl) {
            var myController = $ctrl[0];
            var fatherController = $ctrl[1];
            fatherController.register(myController);
        },
        controller: function () {
        },
        controllerAs: 'inOrderFormCtrl',
    };
};




angular
    .module('store')
    .directive('inboundProductForm', inboundProductForm)
    .directive('inboundOrderForm', inboundOrderForm)
    