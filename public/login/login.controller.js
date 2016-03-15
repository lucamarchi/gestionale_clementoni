var store = angular.module('store');

store.controller('loginController', function($scope, $rootScope, $location, UserService) {
	//Admin User Controller (login, logout)

	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			UserService.resource().save({},
				{username, password},
				function(resp){
					$rootScope.isLogged = resp.status;
					UserService.setUser(username);
					UserService.setToken(resp.token);
					$location.path("/");
				},
				function(err){
					console.log(err.data.message);
				}
			);
		}
	}
});