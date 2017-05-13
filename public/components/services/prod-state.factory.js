function ProdStateFactory ($http, myConfig) {
   
    var urlProds = myConfig.url+'/api/prods';
   
    var prodStateFactory = {};

    prodStateFactory.getProdStates = function () {
        return $http.get(urlProds);
    };
    
    prodStateFactory.getProdState = function (id) {
        return $http.get(urlProds+'/'+id);
    };
    
    prodStateFactory.addProdState = function (prodState) {
        return $http.post(urlProds, prodState);
    };
    
    return prodStateFactory;
};



angular
    .module('store')
    .factory('ProdStateFactory', ['$http', 'myConfig', ProdStateFactory])