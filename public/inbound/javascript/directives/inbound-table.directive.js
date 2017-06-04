/**
 * Created by nexse on 17/05/2017.
 */

function inboundTable () {
    return {
        restrict: 'E',
        templateUrl:'public/inbound/templates/inbound-table.html',
        scope: {},
        transclude: {
            'pagination': '?tablePagination'
        },
        bindToController: {
            inboundList: "=",
            currentPage:"=",
            entryLimit: "=",
        },
        controller: function ($scope, $location, InboundFactory) {
            var ctrl = this;

            ctrl.deleteInboundModalContent = {
                body:'Vuoi eliminare il carico in entrata? L\'operazione non sara reversibile',
                modalTitle: 'Elimina Carico',
                modalId: 'deleteinbound',
                modalClass: 'modal fade',
                inbound: {},
            };

            ctrl.selectInbound = function (inbound) {
                console.log(inbound);
                ctrl.deleteInboundModalContent.inbound = inbound;
            };

            ctrl.showInboundDetails = function (inboundId) {
                $location.path('/inbound/details/'+inboundId);
            };

            ctrl.deleteInbound = function (inbound) {
               InboundFactory.deleteInbound(inbound._id)
               .then (function (resp) {
                   console.log("INBOUND ELIMINATO", resp);
                   ctrl.inboundList.splice(ctrl.inboundList.indexOf(inbound),1);
               })
               .catch(function(err) {
                   console.log(err);
               });
                ctrl.inboundList.splice(ctrl.inboundList.indexOf(inbound),1);
                console.log(inbound);
            }
        },
        controllerAs: 'inboundTableCtrl',
    };
};

angular
    .module('store')
    .directive('inboundTable', inboundTable)