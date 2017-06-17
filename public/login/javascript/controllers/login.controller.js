function LoginController($rootScope, $location, UserService, LoginFactory) {
    var ctrl = this;

    ctrl.loginAlertModalContent = {
        modalTitle: 'Errore di autenticazione',
        modalId: 'loginalert',
        modalClass: 'modal fade',
        modalBody: 'Username e/o password errati'
    };

    ctrl.logIn = function (user) {
        var username = user.username;
        var password = user.password;
        if (username !== undefined && password !== undefined) {
            username = username.toLowerCase();
            LoginFactory.logIn({username:username, password:password})
                .then(function (resp) {
                    console.log(resp);
                    UserService.setUser(resp.data.username, resp.data.role);
                    $rootScope.isLogged = resp.status;
                    $rootScope.user = UserService.getUser();
                    UserService.setToken(resp.data.token);
                    $location.path("/");
                })
                .catch(function (err) {
                    $('#' + ctrl.loginAlertModalContent.modalId).modal();
                    console.log(err.message);
                });
        }
    }
}

angular
    .module('store')
    .controller('LoginController', ['$rootScope', '$location', 'UserService', 'LoginFactory', LoginController]);