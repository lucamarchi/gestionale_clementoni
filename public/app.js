var store = angular.module('store', ['ngRoute', 'ngResource'/*, 'ngTouch', 'ngAnimate'*/, 'ui.bootstrap']);

store.constant("myConfig", {
	// "url": "http://localhost:8080",
	"url": "http://clements-clementoni.rhcloud.com"
})

store.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

store.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider
		.when('/', {
        	templateUrl: 'public/stock/stock.html',
			controller: 'stockController',
			access: { 
				requiredLogin: true 
			}
      	})
		
      	.when('/stock', {
        	templateUrl: 'public/stock/stock.html',
			controller: 'stockController',
			access: { 
				requiredLogin: true 
			}
      	})
	
//		.when('/stock2', {
//        	templateUrl: 'stock/stock2.html',
//			controller: 'stock2Controller',
//			access: { 
//				requiredLogin: true 
//			}
//      	})
	
		.when('/carichiIn', {
        	templateUrl: 'public/carichi_in/carichi_in.html',
			controller: 'carichiInController',
			access: { 
				requiredLogin: true 
			}
      	})
	
		.when('/login', {
        	templateUrl: 'public/login/login.html',
			controller:'loginController',
			access: { 
				requiredLogin: false 
			}
      	})
	
		.when('/cut', {
        	templateUrl: 'public/cut/cuts.html',
			controller: 'cutController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/productionSort', {
        	templateUrl: 'public/production/riepilogo.html',
			controller: 'productionController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/productionState', {
        	templateUrl: 'public/production/production_state/production_state.html',
			controller: 'productionStateController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/carichiOut', {
        	templateUrl: 'public/production/carichi_out/carichi_out.html',
			controller: 'carichiOutController',
			access: { 
				requiredLogin: true
			}
      	})
	
		.otherwise({
        	redirectTo: '/'
      	});
		
}]);


store.run(['$rootScope', '$location', 'AuthenticationService', 'UserService', function($rootScope, $location, AuthenticationService, UserService) {
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		AuthenticationService.save({},{},
			function(resp) {
				$rootScope.isLogged = true;
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
	
	$rootScope.logout = function () {
		$rootScope.isLogged = false;
		UserService.emptySession();
		$location.path("/login");
	}
}]);