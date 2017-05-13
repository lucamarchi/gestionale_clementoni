function ExpectedFactory ($http, myConfig) {
   
    var urlExpecteds = myConfig.url+'/api/expecteds/';
    var urlExpected = myConfig.url+'/api/expected/';
    var expectedFactory = {};

    expectedFactory.getExpecteds = function () {
        return $http.get(urlExpecteds);
    };

    expectedFactory.addExpecteds = function (expecteds) {
        return $http.post(urlExpecteds, expecteds);
    };
    
    expectedFactory.updateExpected = function (expected) {
        return $http.put(urlExpected+'/'+expected._id, expected);
    };

    expectedFactory.deleteExpected = function (expectedId) {
        return $http.put(urlExpected+'/'+expectedId);
    };

    
    return expectedFactory;
};

angular
    .module('store')
    .factory('ExpectedFactory', ['$http', 'myConfig', ExpectedFactory]);