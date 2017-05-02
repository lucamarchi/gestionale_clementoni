function inboundTable () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-table.html',
		scope: {},
        transclude: {
            'pagination': '?tablePagination'
        },
        bindToController: {
			inboundList: "=",
            currentPage:"=",
            entryLimit: "=",
        },
        controller: function ($scope, $location, InboundFactory) {
            var ctrl = this;
    
            ctrl.deleteInboundModalContent = {
                body:'Vuoi eliminare il carico in entrata? L\'operazione non sarà reversibile',
                modalTitle: 'Elimina Carico',
                modalId: 'deleteinbound',
                modalClass: 'modal fade',
                inbound: {},
            }
            
            ctrl.selectInbound = function (inbound) {
                console.log(inbound);
                ctrl.deleteInboundModalContent.inbound = inbound;
            }
            
            ctrl.showInboundDetails = function (inboundId) {
                $location.path('/inbound/details/'+inboundId);    
            }
            
            ctrl.deleteInbound = function (inbound) {
//                InboundFactory.deleteInbound(inbound._id)
//                .then (function (resp) {
//                    console.log("INBOUND ELIMINATO", resp);
//                    ctrl.inboundList.splice(ctrl.inboundList.indexOf(inbound),1);
//                })
//                .catch(function(err) {
//                    console.log(err);
//                });
                console.log(inbound);
            }
        },
        controllerAs: 'inboundTableCtrl',
    };
};

function inboundProductsTable () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbound-products-table.html',
		scope: {},
        bindToController: {
			inboundList: "="
        },
        transclude: {
            'buttons': '?buttons'
        },
        controller: function () {
        },
        controllerAs: 'inProdTableCtrl',
    };
};


angular
    .module('store')
    .directive('inboundTable', inboundTable)
    .directive('inboundProductsTable', inboundProductsTable)