function CutFactory ($http, myConfig) {
   
    var urlCuts = myConfig.url+'/api/cuts';
    var urlCut = myConfig.url+'/api/cut'
    var cutFactory = {};

    cutFactory.getCuts = function () {
        return $http.get(urlCuts);
    };

    cutFactory.getCut = function (id) {
        return $http.get(urlCut+'/'+id);
    };
    
    cutFactory.refreshCuts = function () {
        return $http.get(urlCuts+'/update');
    };

    cutFactory.deleteCut = function (id) {
        return $http.delete(urlCut+'/'+id);
    }

    cutFactory.confirmCut = function (id) {
        return $http.put(urlCut+'/accepted/'+id);
    };

    return cutFactory;
};

angular
    .module('store')
    .factory('CutFactory', ['$http', 'myConfig', CutFactory]);