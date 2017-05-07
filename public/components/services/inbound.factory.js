//function InboundFactory ($http, myConfig) {
//   
//    var urlBase = myConfig.url+'/api/orders';
//    var inboundFactory = {};
//
//    inboundFactory.getInbounds = function () {
//        return $http.get(urlBase);
//    };
//    
//    inboundFactory.getInbound = function (id) {
//        return $http.get(urlBase+'/'+id);
//    };
//    
//    inboundFactory.addInbound = function (inbound) {
//        return $http.post(urlBase, inbound);
//    };
//
//    inboundFactory.updateInbound = function (inbound) {
//        return $http.put(urlBase+'/'+inbound.order._id, inbound)
//    };
//
//    inboundFactory.deleteInbound = function (id) {
//        return $http.delete(urlBase+'/'+id);
//    };
//    return inboundFactory;
//};
//
//angular
//    .module('store')
//    .factory('InboundFactory', ['$http', 'myConfig', InboundFactory]);