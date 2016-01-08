var myapp = angular.module('store', ["ngRoute", "ngResource"]);

myapp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

myapp.config(function($locationProvider, $routeProvider) {
    $routeProvider
		.when('/', {
        	templateUrl: 'magazzino/magazzino.html',
			controller: 'magazzinoController',
			access: { 
				requiredLogin: true 
			}
      	})
		
      	.when('/magazzino', {
        	templateUrl: 'magazzino/magazzino.html',
			controller: 'magazzinoController',
			access: { 
				requiredLogin: true 
			}
      	})
	
		.when('/carichiIn', {
        	templateUrl: 'carichi_in/carichi_in.html',
			controller: 'carichiInController',
			access: { 
				requiredLogin: true 
			}
      	})
	
		.when('/login', {
        	templateUrl: 'login/login.html',
			controller:'loginController',
			access: { 
				requiredLogin: false 
			}
      	})
	
		.when('/login', {
        	templateUrl: 'login/login.html',
			controller:'loginController',
			access: { 
				requiredLogin: false 
			}
      	})
	
		.when('/ordiniTaglio', {
        	templateUrl: 'ordini_taglio/ordini_taglio.html',
			controller: 'ordiniTaglioController',
			access: { 
				requiredLogin: true
			}
      	})
		
		.otherwise({
        	redirectTo: '/'
      	});
		
});

myapp.run(function($rootScope, $location, AuthenticationService2, $window) {
    
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		console.log("TOKEN", $window.sessionStorage.token);
		AuthenticationService2.verify()
			.success (function (data) {
				console.log("VA BENE", data.status);
				$rootScope.isLogged = data.status;
			})
			.error (function (data) {
				if (nextRoute.access && nextRoute.access.requiredLogin) {
					console.log("NON VA BENE", data.status);
					$rootScope.isLogged = data.status;
					$location.path("/login");
				}
			})
//        if (nextRoute.access && nextRoute.access.requiredLogin && !(AuthenticationService2.verify($window.sessionStorage.token))) {
//			$location.path("/login");
//        }
    });
});