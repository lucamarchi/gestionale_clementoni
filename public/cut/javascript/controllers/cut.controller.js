function CutController (CutFactory) {
    var ctrl = this;

    ctrl.entryLimit = 10;
    ctrl.currentPage = 1;
    
    ctrl.refreshLoadingModalContent = {
        modalTitle: 'Scaricamento stock virtuale in corso',
        modalId: 'refreshloading',
        modalClass: 'modal fade',
    }
    
    ctrl.getCuts = function () {
        CutFactory.getCuts()
            .then (function (resp) {
                console.log(resp);
                ctrl.cuts = resp.data.data.cuts;
            })
            .catch(function(err) {
                console.log(err);
            })
    };
	
    ctrl.getCuts();
    
	ctrl.refreshCuts = function () {
        $('#'+ctrl.refreshLoadingModalContent.modalId).modal('show');
		CutFactory.refreshCuts()
            .then (function (resp) {
				console.log("REFRESH", resp);
				if (resp.data.data.cuts != undefined) {
					ctrl.cuts = ctrl.cuts.concat(resp.data.data.cuts);
				}

                // $('#'+ctrl.refreshLoadingModalContent.modalId).modal('hide');
			})
			.catch(function(err) {
				console.log(err);
			})
	};
}

angular
    .module('store')
    .controller('CutController', ['CutFactory', CutController])