//function ProductFactory ($http, myConfig) {
//   
//    var urlBase = myConfig.url+'/api/products';
//    var productFactory = {};
//
//    productFactory.getProducts = function () {
//        return $http.get(urlBase);
//    };
//    
//    productFactory.getProduct = function (id) {
//        return $http.get(urlBase+'/'+id);
//    };
//    
//    productFactory.addProduct = function (product) {
//        return $http.post(urlBase, product);
//    };
//
//    productFactory.updateProduct = function (product) {
//        return $http.put(urlBase+'/'+product._id, product)
//    };
//
//    productFactory.deleteProduct = function (id) {
//        return $http.delete(urlBase+'/'+id);
//    };
//    return productFactory;
//};
//
//angular
//    .module('store')
//    .factory('ProductFactory', ['$http', 'myConfig', ProductFactory]);