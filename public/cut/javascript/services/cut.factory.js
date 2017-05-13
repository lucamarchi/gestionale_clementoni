//function CutFactory ($http, myConfig) {
//   
//    var urlBase = myConfig.url+'/api/cuts';
//    var urlBase2 = myConfig.url+'/api/cut'
//    var cutFactory = {};
//
//    cutFactory.getCuts = function () {
//        return $http.get(urlBase);
//    };
//
//    cutFactory.getCut = function (id) {
//        return $http.get(urlBase2+'/'+id);
//    };
//    
//    cutFactory.refreshCuts = function () {
//        return $http.get(urlBase+'/update');
//    };
//    
//    cutFactory.confirmCut = function (id) {
//        return $http.put(urlBase2+'/accepted/'+id);
//    };
//
//    return cutFactory;
//};
//
//angular
//    .module('store')
//    .factory('CutFactory', ['$http', 'myConfig', CutFactory]);