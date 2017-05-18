/**
 * Created by nexse on 18/05/2017.
 */

function customerTable () {
    return {
        restrict: 'E',
        templateUrl:'public/cut/templates/customer-table.html',
        scope: {},
        bindToController: {
            customer: "="
        },
        controller: function ($scope) {
        },
        controllerAs: 'customerTableCtrl',
    };
};

angular
    .module('store')
    .directive('customerTable', customerTable)