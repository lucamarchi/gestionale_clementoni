function ProductFactory($http, myConfig) {

    var urlBase = myConfig.url + '/api/products';
    var urlStock = myConfig.url + '/api/product/stock'
    var productFactory = {};

    productFactory.getProducts = function () {
        return $http.get(urlBase);
    };

    productFactory.getProduct = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    productFactory.addProduct = function (product) {
        return $http.post(urlBase, product);
    };

    productFactory.updateProduct = function (product) {
        return $http.put(urlBase + '/' + product._id, product)
    };

    productFactory.deleteProduct = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    productFactory.deleteStock = function (id) {
        return $http.delete(urlStock + '/'+id);
    };
    return productFactory;
};

angular
    .module('store')
    .factory('ProductFactory', ['$http', 'myConfig', ProductFactory]);