function LoginController ($scope, $rootScope, $location, UserService) {
	
	$scope.logIn = function (user) {
		var username = user.username;
        var password = user.password;
        if (username !== undefined && password !== undefined) {
			username = username.toLowerCase();
			UserService.resource().save({},
				{username, password},
				function(resp){
				    console.log(resp);
                    UserService.setUser(resp.username, resp.role);
					$rootScope.isLogged = resp.status;
					$rootScope.user = UserService.getUser();
					UserService.setToken(resp.token);
					$location.path("/");
				},
				function(err){
					console.log(err.message);
				}
			);
		}
	}
};

angular
    .module('store')
    .controller('LoginController', ['$scope', '$rootScope', '$location', 'UserService', LoginController]);