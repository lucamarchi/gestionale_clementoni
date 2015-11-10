var myapp = angular.module('store', ["ui.router"])
myapp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/index.html")

	$stateProvider
		.state('magazzino', {
			url: '/magazzino',
			templateUrl: 'magazzino.html',
			controller: 'productController'
		})

		.state('carichiIn', {
			url: '/carichiIn',
			templateUrl: 'carichientrata.html',
			controller: 'orderController'
		})

		.state('productsList', {
			url: '/productList',
			templateUrl: 'orderproducts.html',
			controller: 'orderController'
		})

		.state('createOrder', {
			url: '/createOrder',
			templateUrl: 'newOrder.html',
			controller: 'orderController'
		})

		.state('createProduct', {
			url: '/addProduct',
			templateUrl: 'newProduct.html',
			controller: 'productController'
		})
})