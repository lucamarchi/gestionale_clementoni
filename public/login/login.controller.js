var store = angular.module('store');

store.controller('loginController', function($scope, $rootScope, $location, $window, UserService, AuthenticationService) {
	//Admin User Controller (login, logout)
	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			UserService.logIn(username, password)
				.success(function(data) {
//					AuthenticationService.isLogged = true;
					$rootScope.isLogged = data.status;
					$window.sessionStorage.token = data.token;
					$location.path("/");
				})
				.error(function(status, data) {
					console.log(status);
					console.log(data);
				});
		}
	}

	$rootScope.logout = function () {
//		if (AuthenticationService.isLogged) {
//			AuthenticationService.isLogged = false;
		if($rootScope.isLogged) {
			$rootScope.isLogged = false;
			delete $window.sessionStorage.token;
			$location.path("/login");
		}
	}
});