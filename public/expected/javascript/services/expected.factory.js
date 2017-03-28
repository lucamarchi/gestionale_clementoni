function ExpectedFactory ($http, myConfig) {
   
    var urlBase = myConfig.url+'/api/expecteds/';
    var expectedFactory = {};

    expectedFactory.getExpecteds = function () {
        return $http.get(urlBase);
    };

    expectedFactory.addExpecteds = function (expecteds) {
        return $http.post(urlBase, expecteds);
    };

   
    return expectedFactory;
};

angular
    .module('store')
    .factory('ExpectedFactory', ['$http', 'myConfig', ExpectedFactory]);