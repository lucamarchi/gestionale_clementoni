function LoginFactory($http, myConfig) {
    var loginFactory = {};
    loginFactory.logIn = function (user) {
        return $http.post(myConfig.url + '/api/authenticate', user);
    };
    return loginFactory;
}

angular
    .module('store')
    .factory('LoginFactory', ['$http', 'myConfig', LoginFactory]);