function OutboundFactory ($http, myConfig) {
   
    var urlReleases = myConfig.url+'/api/releases';
    var urlRelease = myConfig.url+'/api/release';
   
    var outboundFactory = {};

    outboundFactory.getOutbounds = function () {
        return $http.get(urlReleases);
    };
    
    outboundFactory.getOutbound = function (inboundId) {
        return $http.get(urlRelease+'/'+inboundId);
    };
//    
//    prodStateFactory.getProdState = function (id) {
//        return $http.get(urlProds+'/'+id);
//    };
//    
//    prodStateFactory.addProdState = function (prodState) {
//        return $http.post(urlProds, prodState);
//    };
    
    return outboundFactory;
};



angular
    .module('store')
    .factory('OutboundFactory', ['$http','myConfig', OutboundFactory])