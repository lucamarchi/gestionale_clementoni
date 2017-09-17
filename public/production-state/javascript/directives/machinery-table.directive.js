
function machineryTable () {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/machinery-table.html',
        scope: {},
        bindToController: {
            machineryList: "=",
        },
        transclude: {
            buttonAction: '?buttonAction'
        },
        controller: function () {
        },
        controllerAs: 'machineryTableCtrl',
    }
}

angular
    .module('store')
    .directive('machineryTable', machineryTable);
