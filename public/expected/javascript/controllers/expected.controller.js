function ExpectedController ($scope, ExpectedFactory,features) {
	var ctrl = this;
    
    ctrl.currentPage = 1;
    ctrl.entryLimit = 10;
	
    ctrl.updateExpectedModalContent = {
        modalTitle: 'Modifica ordine al fornitore',
        modalId: 'expectedupdate',
        modalClass: 'modal modal-xl fade',
        expected: {},
        index: null,
    }
    
    ctrl.deleteExpectedModalContent = {
        body: 'Vuoi eliminare l\'ordine al fornitore selezionato?',
        modalTitle: 'Eliminazione ordine al fornitore',
        modalId: 'expecteddelete',
        modalClass: 'modal fade',
        expected: {},
    }
    
    ctrl.getExpecteds = function () {
        ExpectedFactory.getExpecteds()
            .then (function (resp) {
                ctrl.expecteds = resp.data.expected;
                console.log(resp);
            })
            .catch(function(err) {
                console.log(resp);
            });
    }
    
    ctrl.getExpecteds();
    
    ctrl.selectExpected = function (expected, index) {
        console.log(index);
        ctrl.updateExpectedModalContent.index = index;
        ctrl.deleteExpectedModalContent.index = index;
        var expectedCopy = Object.assign({},expected);
        ctrl.updateExpectedModalContent.expected = expectedCopy;
        ctrl.updateExpectedModalContent.expected.dataPrevista = new Date(expectedCopy.dataPrevista);
        ctrl.deleteExpectedModalContent.expected = expectedCopy;
        ctrl.deleteExpectedModalContent.expected.dataPrevista = new Date(expectedCopy.dataPrevista);
    }
    
    ctrl.updateExpected = function (expected, index) {
//        ExpectedFactory.updateExpected(expected)
//            .then (function (resp) {
//                
//                console.log(resp);
//            })
//            .catch(function(err) {
//                console.log(resp);
//            });
        
        console.log(expected, index);
        ctrl.expecteds[index] = expected;
        
    }
    
    ctrl.deleteExpected = function (expected, index) {
        //chiamata all'api e aggiungi lo splice dentro
        console.log(expected, index);
        ctrl.expecteds.splice(index,1);
    }
    
};

	
angular
    .module('store')
    .controller('ExpectedController', ['$scope', 'ExpectedFactory', 'features', ExpectedController]);