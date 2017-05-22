/**
 * Created by nexse on 22/05/2017.
 */

function outboundTable (OutboundFactory, $location) {
    return {
        restrict: 'E',
        templateUrl:'public/outbound/templates/outbound-table.html',
        scope: {},
        bindToController: {
            outbounds: "=",
            currentPage: "=",
            entryLimit: "="
        },
        controller: function () {
            var ctrl = this;

            ctrl.showOutboundDetails = function (outboundId) {
                $location.path('/outbound/details/'+outboundId);
            };

            ctrl.showOutboundDispatch = function (outboundId) {
                $location.path('/outbound/dispatch/'+outboundId);
            };

            ctrl.showOutboundUpdate = function (outboundId) {
                $location.path('/outbound/update/'+outboundId);
            };
        },

        controllerAs: 'outboundTableCtrl',
    }
}

angular
    .module('store')
    .directive('outboundTable',['OutboundFactory', '$location', outboundTable]);