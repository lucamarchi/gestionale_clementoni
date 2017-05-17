function ExpectedFactory ($http, myConfig) {
   
    var urlExpecteds = myConfig.url+'/api/expecteds';
    var urlExpected = myConfig.url+'/api/expected';
    var expectedFactory = {};

    expectedFactory.getExpecteds = function () {
        return $http.get(urlExpecteds);
    };

    expectedFactory.addExpecteds = function (expecteds) {
        return $http.post(urlExpecteds, expecteds);
    };
    
    expectedFactory.updateExpected = function (expected) {
        console.log(expected);
        return $http.put(urlExpected+'/'+expected.expected._id, expected);
    };

    expectedFactory.deleteExpected = function (expectedId) {
        return $http.delete(urlExpected+'/'+expectedId);
    };

    
    return expectedFactory;
};

angular
    .module('store')
    .factory('ExpectedFactory', ['$http', 'myConfig', ExpectedFactory]);