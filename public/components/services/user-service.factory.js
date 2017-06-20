function UserService($window, $http, myConfig) {
    var userService = {};

    userService.verify = function () {
        return $http.post(myConfig.url+'/api/verify')
    };

    userService.getUser = function () {
        return {username: $window.sessionStorage.username, role: $window.sessionStorage.role};
    };
    userService.setUser = function (username, role) {
        $window.sessionStorage.username = username;
        $window.sessionStorage.role = role;
        console.log($window.sessionStorage.username, $window.sessionStorage.role);
    };
    userService.getToken = function () {
        return $window.sessionStorage.token;
    };
    userService.setToken = function (token) {
        $window.sessionStorage.token = token;
    };
    userService.emptySession = function () {
        delete $window.sessionStorage.username;
        delete $window.sessionStorage.role;
        delete $window.sessionStorage.token;
    };
    return userService;
}


angular
    .module('store')
    .factory('UserService', ['$window','$http', 'myConfig', UserService]);