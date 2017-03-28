function CutFactory ($http, myConfig) {
   
    var urlBase = myConfig.url+'/api/cuts';
    var cutFactory = {};

    cutFactory.getCuts = function () {
        return $http.get(urlBase);
    };

    cutFactory.getCut = function (id) {
        return $http.get(urlBase+'/'+id);
    };
    
    cutFactory.refreshCuts = function () {
        return $http.post(urlBase+'/update');
    };
    
    cutFactory.confirmCut = function (id) {
        return $http.put(urlBase+'/'+id);
    };

    return cutFactory;
};

angular
    .module('store')
    .factory('CutFactory', ['$http', 'myConfig', CutFactory]);