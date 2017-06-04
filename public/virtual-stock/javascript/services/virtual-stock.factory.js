function VirtualStockFactory ($http, myConfig, features) {

   var urlBase = myConfig.url+'/api/virtual';
   var virtualStockFactory = {};

   virtualStockFactory.getVirtualStock = function () {
       return $http.get(urlBase);
   };

   return virtualStockFactory;
};	

angular
   .module('store')
   .factory('VirtualStockFactory', ['$http', 'myConfig', 'features', VirtualStockFactory]);