function inboundTable () {
	return {
		restrict: 'E',
		templateUrl:'public/inbound/templates/inbounds-table.html',
		scope: {},
        transclude: {
                'pagination': '?tablePagination'
        },
        bindToController: {
			inboundList: "=",
            currentPage:"=",
            entryLimit: "=",
        },
        controller: function ($scope, InboundFactory) {
            var ctrl = this;
            ctrl.inboundModalContent = {
                url:'public/inbound/templates/inbound-products.html',
                modalTitle: '',
                modalId: 'inboundproducts',
                inboundProducts: [],
                currentPage: 1,
            }
            
            ctrl.getInbound = function (id) {
                InboundFactory.getInbound(id)
                .then (function (resp) {
                    console.log("TUTTI I PRODOTTI DEL CARICO" , resp);
                    ctrl.inboundModalContent.inboundProducts = resp.data.products;
                    ctrl.inboundModalContent.modalTitle = 'Prodotti del carico '+resp.data.order.ddt;
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
            ctrl.deleteInbound = function (inbound) {
                InboundFactory.deleteInbound(inbound._id)
                .then (function (resp) {
                    console.log("INBOUND ELIMINATO", resp);
                    ctrl.inboundList.splice(ctrl.inboundList.indexOf(inbound),1);
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        },
        controllerAs: 'inTableCtrl',
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
            'buttons': '?buttonsEdit'
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