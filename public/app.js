var store = angular.module('store', ['ngRoute', 'ngResource'/*, 'ngTouch', 'ngAnimate'*/, 'ui.bootstrap']);

store.constant("myConfig", {
	"url": "http://localhost:8080",
//	"url": "http://plimco-gianclementoni.rhcloud.com"
});

store.constant("features", {
	"tipi": ["coil", "nastro", "piana","ondulata", "grecata", "pressopiegata", "collaboranteh55", "collaboranteh55-s", "collaboranteh75", "collaboranteh75-s"],
	"materiali": ["zincato", "decapato", "laf", "preverniciato", "caldo", "aluzinc", "alluminato", "inox"],
	"qualitaZincato": ["dx51d", "dx52d", "dx53d", "dx54d"],
	"qualitaDecapato": ["dd11", "dd12", "dd13", "dd14"],
	"qualitaLaf": ["dc01", "dc02", "dc03", "dc04"],
	"qualitaCaldo": ["s235jr", "s275jr", "s355jr","s235jo", "s275jo", "s355jo","s235j2", "s275j2", "s355j2"],
	"qualitaPreverniciato": ["dx51d", "dx52d", "dx53d", "dx54d"],
	"qualitaElettrozincato": ["dc01", "dc02", "dc03", "dc04"],
	"qualitaInox":["430","304","316"],
	"scelte":["a", "b", "c", "0"],
	"finitureZincPrev":["z100", "z140", "z200", "z275"],
	"finitureInox": ["2b","ba", "sb", "satinato"],
	"colori":["v","bg","tdm","rs"],
	"superficiZincato":["br","mf","f","skl"],
	"spessori": ["0.25", "0.3", "0.35", "0.4", "0.45", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "1.2", "1.5", "1.8", "2", "2.5", "3", "4", "5", "6", "8", "10","12"],
	"lunghezze": ["2000","2500","3000"],
	"classiLarghezza":["1000", "1250", "1500"],
	"stati": ["sospeso", "approvato", "respinto"],
	"stabilimenti": ["1", "2"]
});


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
				$rootScope.userRole = UserService.getUser().role;
//				$rootScope.userRole = 'admin';
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