/**
 * Created by nexse on 17/05/2017.
 */

function inboundProductTable () {
    return {
        restrict: 'E',
        templateUrl:'public/inbound/templates/inbound-product-table.html',
        scope: {},
        bindToController: {
            inboundList: "=",
            currentPage:"=",
            entryLimit: "=",
            caption: "@",
        },
        transclude: {
            'buttons': '?buttons'
        },
        controller: function () {
        },
        controllerAs: 'inProdTableCtrl',
    };
}


angular
    .module('store')
    .directive('inboundProductTable', inboundProductTable);