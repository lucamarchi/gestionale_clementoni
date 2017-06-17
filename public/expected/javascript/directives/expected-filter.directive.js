/**
 * Created by francescodicara on 16/05/17.
 */

function expectedFilter() {
    return {
        restrict: 'E',
        templateUrl:'public/expected/templates/expected-filter.html',
        scope: {},
        bindToController: {
            model: "=",
        },
        controller: function () {
        },
        controllerAs: 'expectedFilterCtrl',
    }
}

angular
    .module('store')
    .directive('expectedFilter', expectedFilter)