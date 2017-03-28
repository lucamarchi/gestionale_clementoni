function CutController (CutFactory) {
    var ctrl = this;
    ctrl.getCuts = function () {
        CutFactory.getCuts()
            .then (function (resp) {
                console.log(resp);
                ctrl.cuts = resp.data.cuts;
                ctrl.entryLimit = 20;
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
					ctrl.cuts = ctrl.cuts.concat(resp.cuts);
				}
			})
			.catch(function(err) {
				console.log(err);
			})
	};
	
	ctrl.getCut = function (id){
		CutFactory.getCut(id)
			.then(function (resp) {
				console.log("TAGLIO E ARTICOLI" , resp);
				ctrl.cut = resp.cut;
				ctrl.articlesCut = resp.articles;
				ctrl.customer = resp.customer;
			})
			.catch(function (err) {
				console.log (err);
			})
	};
	
	ctrl.confirmCut = function (cut) {
		CutFactory.confirmCut(id)
			.then(function(resp) {
				console.log(resp);
				cut.accepted = true;
			})
			.catch(function(err) {
				console.log(err);
			})
	}
}

angular
    .module('store')
    .controller('CutController', ['CutFactory', CutController])