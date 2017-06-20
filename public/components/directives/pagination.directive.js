angular
    .module('store')

    .component('pagination', {
        restrict: 'E',
        template: [
            '<div uib-pagination total-items="$ctrl.totalItems" ng-model="$ctrl.currentPage" max-size="$ctrl.maxSize" class="pagination" items-per-page="$ctrl.entryLimit" boundary-links="true" force-ellipses="true">',
            '</div>'
        ].join(''),
        bindings: {
            totalItems: "=",
            entryLimit: "=",
            currentPage: "="
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.maxSize = 10;
        },
    })

    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    });