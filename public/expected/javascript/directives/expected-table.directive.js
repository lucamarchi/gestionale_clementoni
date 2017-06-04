/**
 * Created by francescodicara on 16/05/17.
 */

function expectedTable() {
    return {
        restrict: 'E',
        templateUrl:'public/expected/templates/expecteds-table.html',
        scope: {},
        transclude: {
            'tableButton': '?tableButton',
            'pagination': '?tablePagination',
            'filters': '?tableFilter'
        },
        bindToController: {
            expectedList: "=",
            currentPage:"=",
            entryLimit: "=",
        },
        controller: function ($scope) {
        },
        link: function ($scope, $element, $attrs) {
        },
        controllerAs: 'expectedTableCtrl',
    }
};

angular
    .module('store')
    .directive('expectedTable', expectedTable);