//function CustomerFactory ($http, myConfig) {
//   
//    var urlCustomer = myConfig.url+'/api/customerCod';
//    var customerFactory = {};
//    
//    customerFactory.getCustomer = function (customerId) {
//        return $http.get(urlCustomer+'/'+customerId);
//    }
//    
//    return customerFactory;
//};
//
//
//
//angular
//    .module('store')
//    .factory('CustomerFactory', ['$http', 'myConfig', CustomerFactory])