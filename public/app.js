var myapp = angular.module('store', ["ngRoute", "ngResource"]);

myapp.config(function($routeProvider) {
    $routeProvider
      	.when('/magazzino', {
        	templateUrl: 'magazzino/magazzino.html',
			controller: 'magazzinoController'
      	})
		.when('/carichiIn', {
        	templateUrl: 'carichi_in/carichi_in.html',
			controller: 'carichiInController'
      	})
		.when('/login', {
        	templateUrl: 'login/login.html',
			controller:'loginController'
      	})
		.when('/ordiniTaglio', {
        	templateUrl: 'ordini_taglio/ordini_taglio.html',
			controller: 'ordiniTaglioController'
      	})
		
		.otherwise({
        	redirectTo: '/'
      	});
		
});