function CutController (CutFactory) {
    var ctrl = this;
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
		CutFactory.refreshCuts()
            .then (function (resp) {
				console.log("REFRESH", resp);
				if (resp.cuts != undefined) {
					ctrl.cuts = ctrl.cuts.concat(resp.data.cuts);
				}
			})
			.catch(function(err) {
				console.log(err);
			})
	};
}

angular
    .module('store')
    .controller('CutController', ['CutFactory', CutController])