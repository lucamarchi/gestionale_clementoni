function LoginController ($rootScope, $location, UserService){
	var ctrl = this;
    
	ctrl.loginAlertModalContent = {
		modalTitle: 'Errore di autenticazione',
        modalId: 'loginalert',
        modalClass: 'modal fade',
        modalBody: 'Username e/o password errati'
    }
    
	ctrl.logIn = function (user) {
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
                    $('#'+ctrl.loginAlertModalContent.modalId).modal()
					console.log(err.message);
				}
			);
		}
	}
};

angular
    .module('store')
    .controller('LoginController', ['$rootScope', '$location', 'UserService', LoginController]);