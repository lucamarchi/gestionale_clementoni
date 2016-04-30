var store = angular.module('store');

store.controller('loginController', ['$scope', '$rootScope', '$location', 'UserService', function($scope, $rootScope, $location, UserService) {
	//Admin User Controller (login, logout)

	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			UserService.resource().save({},
				{username, password},
				function(resp){
					console.log(resp);
					$rootScope.isLogged = resp.status;
					UserService.setUser(resp.username, resp.role);
					console.log(UserService.getUser());
					UserService.setToken(resp.token);
					$location.path("/");
				},
				function(err){
					console.log(err.message);
				}
			);
		}
	}
}]);