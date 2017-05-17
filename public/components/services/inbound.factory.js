function InboundFactory ($http, myConfig) {
   
    var urlOrders = myConfig.url+'/api/orders';
    var urlOrder = myConfig.url+'/api/order';
    var inboundFactory = {};

    inboundFactory.getInbounds = function () {
        return $http.get(urlOrders);
    };
    
    inboundFactory.getInbound = function (id) {
        return $http.get(urlOrder+'/'+id);
    };
    
    inboundFactory.addInbound = function (inbound) {
        return $http.post(urlOrder, inbound);
    };

    inboundFactory.updateInbound = function (inbound) {
        return $http.put(urlOrder+'/'+inbound.order._id, inbound)
    };

    inboundFactory.deleteInbound = function (id) {
        return $http.delete(urlOrders+'/'+id);
    };
    return inboundFactory;
};

angular
    .module('store')
    .factory('InboundFactory', ['$http', 'myConfig', InboundFactory]);