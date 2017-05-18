function CutDetailsController (CutFactory, $routeParams,$location) {
    var ctrl = this;
    ctrl.cut = {};
    ctrl.cut.order = {};
    ctrl.cut.customer = {};
    ctrl.cut.articles = [];
    ctrl.currentPage = 1;
    
    
    ctrl.getCut = function (id) {
        CutFactory.getCut(id)
            .then (function (resp) {
                console.log("TUTTI GLI ARTICOLI DELL'ORDINE" , resp);
                ctrl.cut.order = resp.data.data.cut;
                ctrl.cut.articles = resp.data.data.articles;
                ctrl.cut.customer = resp.data.data.customer;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
            
        
    ctrl.getCut($routeParams.id);
    
    
}

angular
    .module('store')
    .controller('CutDetailsController', ['CutFactory', '$routeParams','$location', CutDetailsController]);