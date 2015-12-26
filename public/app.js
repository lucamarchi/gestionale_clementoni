//var myapp = angular.module('store', ["ui.router"])
//myapp.config(function($stateProvider, $urlRouterProvider){
//
//	$urlRouterProvider.otherwise("/index.html")
//
//	$stateProvider
//		.state('magazzino', {
//			url: '/magazzino',
//			templateUrl: 'magazzino.html',
//			controller: 'magazzinoController'
//		})
//
//		.state('carichiIn', {
//			url: '/carichiIn',
//			templateUrl: 'carichi_in.html',
//			controller: 'carichiInController'
//		})
//		
//		.state('login', {
//			url:'/login',
//			templateUrl: 'login.html',
//			controller:'loginController'
//		})
//})


var myapp = angular.module('store', ["ui.router"]);

myapp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/index.html")

	$stateProvider
		.state('magazzino', {
			url: '/magazzino',
			templateUrl: 'magazzino/magazzino.html',
			controller: 'magazzinoController'
		})

		.state('carichiIn', {
			url: '/carichiIn',
			templateUrl: 'carichi_in/carichi_in.html',
			controller: 'carichiInController'
		})
		
		.state('login', {
			url:'/login',
			templateUrl: 'login/login.html',
			controller:'loginController'
		})
})