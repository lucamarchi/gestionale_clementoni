var myapp = angular.module('store', ["ngRoute", "ngResource"]);

myapp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

myapp.config(function($locationProvider, $routeProvider) {
    $routeProvider
		.when('/', {
        	templateUrl: 'stock/stock.html',
			controller: 'stockController',
			access: { 
				requiredLogin: true 
			}
      	})
		
      	.when('/stock', {
        	templateUrl: 'stock/stock.html',
			controller: 'stockController',
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
	
		.when('/cut', {
        	templateUrl: 'cut/cuts.html',
			controller: 'cutController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/productionSort', {
        	templateUrl: 'logistics/ordine_produzione.html',
			controller: 'logisticsController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/productionState', {
        	templateUrl: 'logistics/production_state.html',
			controller: 'logisticsController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/carichiOut', {
        	templateUrl: 'logistics/carichi_out.html',
			controller: 'logisticsController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.otherwise({
        	redirectTo: '/'
      	});
		
});

myapp.run(function($rootScope, $location, AuthenticationService, $window) {
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		AuthenticationService.save({},{},
			function(resp) {
				console.log(resp.message);
				$rootScope.isLogged = true;
				console.log($rootScope.isLogged);
			},
			function(err) {
				if (nextRoute.access && nextRoute.access.requiredLogin) {
					console.log(err.data.message);
					$rootScope.isLogged = false;
					$location.path("/login");
				}
			}
		);
	});
});