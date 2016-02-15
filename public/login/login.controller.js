var store = angular.module('store');

store.controller('loginController', function($scope, $rootScope, $location, $window, UserService) {
	//Admin User Controller (login, logout)

	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			UserService.save({},
				{username, password},
				function(resp){
					$rootScope.isLogged = resp.status;
					$window.sessionStorage.user = username;
					console.log($window.sessionStorage.user);
					$window.sessionStorage.token = resp.token;
					$location.path("/");
				},
				function(err){
					console.log(err.data.message);
				}
			);
		}
	}
	$rootScope.logout = function () {
		$rootScope.isLogged = false;
		delete $window.sessionStorage.user;
		delete $window.sessionStorage.token;
		console.log("CONTROLLO ",$window.sessionStorage.token);
	}
});