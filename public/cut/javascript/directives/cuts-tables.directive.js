function cutsTable () {
	return {
		restrict: 'E',
		templateUrl:'public/cut/templates/cuts-table.html',
		scope: {},
        bindToController: {
			cutList: "=",
            currentPage:"=",
            entryLimit: "=",
        },
        controller: function ($scope, CutFactory) {
            var ctrl = this;
            ctrl.cutModalContent = {
                url:'public/cut/templates/cut-products.html',
                modalTitle: '',
                modalId: 'cutproducts',
                cutProducts: [],
                currentPage: 1,
            }
            
            ctrl.getCut = function (id) {
                CutFactory.getCut(id)
                .then (function (resp) {
                    console.log("TUTTI I PRODOTTI DEL CARICO" , resp);
                    ctrl.cutModalContent.cutProducts = resp.data.products;
                    ctrl.cutModalContent.modalTitle = 'Prodotti del carico '+resp.data.order.ddt;
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        },
        controllerAs: 'cutsTableCtrl',
    };
};

angular
    .module('store')
    .directive('cutsTable', cutsTable)
    