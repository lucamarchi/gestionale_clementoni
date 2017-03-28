function ExpectedController ($scope, ExpectedFactory,features) {
	var ctrl = this;
    
    ctrl.currentPage = 1;
    ctrl.entryLimit = 20;
	ctrl.getExpecteds = function () {
        ExpectedFactory.getExpecteds()
            .then (function (resp) {
                ctrl.expecteds = resp.data.expected;
            })
            .catch(function(err) {
                console.log(resp);
            });
    }
    
    ctrl.getExpecteds();
};

	
angular
    .module('store')
    .controller('ExpectedController', ['$scope', 'ExpectedFactory', 'features', ExpectedController]);