function ExpectedCreateController ($scope, $location, ExpectedFactory, UtilityFactory) {
    var ctrl = this;
   
    ctrl.currentPage = 1;
    ctrl.expecteds = [];
    ctrl.unlockedForm = 0;
    
    ctrl.editExpectedModalContent = {
        modalTitle: '',
        modalId: 'expectededit',
        modalClass: 'modal modal-xl fade',
        expected: {},
        index: null,
    };
    
    ctrl.confirmExpectedModalContent = {
        modalTitle: 'Conferma creazione ordine al fornitore',
        modalBody: 'Confermare la creazione dell\'ordine?',
        modalId: 'expectedconfirmation',
        modalClass: 'modal fade',
        index: null,
    };
    
    $scope.$on('expectedFormValid', function (event, data) {
        if (data) {
            ctrl.expectedFormValid = data.$valid;
        }
    });
    
    ctrl.newExpected = function () {
        ctrl.editExpectedModalContent.modalTitle = 'Inserisci nuovo ordine al fornitore';
        ctrl.editExpectedModalContent.expected = {};
        ctrl.unlockedForm = 1;
    };
    
    ctrl.selectExpected = function (expected, index) {
        console.log(expected,index);
        ctrl.editExpectedModalContent.index = index;
        ctrl.editExpectedModalContent.modalTitle = 'Modifica ordine al fornitore';
        var expectedCopy = Object.assign({},expected);
        ctrl.editExpectedModalContent.expected = expectedCopy;
        ctrl.editExpectedModalContent.expected.dataPrevista = new Date(expectedCopy.dataPrevista);
        ctrl.unlockedForm = 2;
    };
    
    
    ctrl.addExpected = function (expected) {
		expected.pesoSaldo = expected.pesoOrdinato;
        expected.pesoConsegnato = 0;
        UtilityFactory.productValuesForType(expected, "pesoOrdinato", "spessore", "larghezza");
        ctrl.expecteds.push(expected);
		console.log(ctrl.expecteds);
	};
    
    ctrl.updateExpected = function (expected, index) {
        console.log(expected);
        ctrl.expecteds[index] = expected;
    };
    
    ctrl.deleteExpected = function (expected, index) {
        console.log(expected);
        ctrl.expecteds.splice(index,1);
    };
    
    ctrl.confirmExpectedOrder = function (expecteds) {
		ExpectedFactory.addExpecteds({expected:expecteds})
            .then(function(resp) {
                console.log(expecteds);
				console.log(resp);
                $location.path("/expected")
			})
			.catch(function(err){
				console.log(err);
			})
    }
}

angular
    .module('store')
    .controller('ExpectedCreateController', ['$scope','$location','ExpectedFactory','UtilityFactory', ExpectedCreateController]);