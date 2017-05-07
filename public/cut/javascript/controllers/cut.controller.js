function CutController (CutFactory) {
    var ctrl = this;
    
    ctrl.refreshLoadingModalContent = {
        modalTitle: 'Scaricamento stock virtuale in corso',
        modalId: 'refreshloading',
        modalClass: 'modal fade',
    }
    
    ctrl.getCuts = function () {
        CutFactory.getCuts()
            .then (function (resp) {
                console.log(resp);
                ctrl.cuts = resp.data.cuts;
                ctrl.entryLimit = 10;
                ctrl.currentPage = 1;
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
				if (resp.cuts != undefined) {
					ctrl.cuts = ctrl.cuts.concat(resp.data.cuts);
				}
                $('#'+ctrl.refreshLoadingModalContent.modalId).modal('hide');
			})
			.catch(function(err) {
				console.log(err);
			})
	};
}

angular
    .module('store')
    .controller('CutController', ['CutFactory', CutController])