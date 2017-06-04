function OutboundFactory ($http, myConfig) {
   
    var urlOutbounds = myConfig.url+'/api/releases';
    var urlOutbound = myConfig.url+'/api/release';
   
    var outboundFactory = {};

    outboundFactory.getOutbounds = function () {
        return $http.get(urlOutbounds);
    };
    
    outboundFactory.getOutbound = function (outboundId) {
        return $http.get(urlOutbound+'/'+outboundId);
    };

    outboundFactory.addOutbound = function (outbound) {
        return $http.post(urlOutbound, outbound);
    };


    return outboundFactory;
};



angular
    .module('store')
    .factory('OutboundFactory', ['$http','myConfig', OutboundFactory])