var store = angular.module('store');

store.controller('loginController', function($scope, $rootScope, $location, $window, UserService) {
	//Admin User Controller (login, logout)

	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			UserService.save({},
				{username, password},
				function(resp){
					$rootScope.isLogged = resp.status;
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
//		if($rootScope.isLogged) {
			$rootScope.isLogged = false;
			delete $window.sessionStorage.token;
//			$location.path("/login");
//		}
	}
});