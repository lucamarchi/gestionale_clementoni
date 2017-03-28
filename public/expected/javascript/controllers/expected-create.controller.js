function ExpectedCreateController ($scope, $location, ExpectedFactory) {
    var ctrl = this;
   
    ctrl.currentPage = 1;
    ctrl.expected = {};
    ctrl.expecteds = [];
    
    ctrl.addExpected = function (expected) {
//		valuesProduct(expected);
		ctrl.expected.pesoSaldo = 100;
        ctrl.expecteds.push(ctrl.expected);
        ctrl.expected = {fornitore:expected.fornitore, dataPrevista:expected.dataPrevista};
		console.log(ctrl.expecteds);
	}
    
    ctrl.confirmExpectedOrder = function (expecteds) {
		ExpectedFactory.addExpecteds({expected:expecteds})
            .then(function(resp){
				console.log(resp);
                $location.path("/expected")
			},
			function (err){
				console.log(err);
			}
		);
	}
}

angular
    .module('store')
    .controller('ExpectedCreateController', ['$scope','$location','ExpectedFactory', ExpectedCreateController]);