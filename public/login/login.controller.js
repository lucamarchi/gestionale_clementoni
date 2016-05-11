var store = angular.module('store');

store.controller('loginController', ['$scope', '$rootScope', '$location', 'UserService', function($scope, $rootScope, $location, UserService) {
	
	$scope.logIn = function (username, password) {
		if (username !== undefined && password !== undefined) {
			username = username.toLowerCase();
			UserService.resource().save({},
				{username, password},
				function(resp){
					console.log(resp);
					UserService.setUser(resp.username, resp.role);
					$rootScope.isLogged = resp.status;
					$rootScope.userRole = resp.role;
//					$rootScope.userRole = 'admin';
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