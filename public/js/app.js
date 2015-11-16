var myapp = angular.module('store', ["ui.router"])
myapp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/index.html")

	$stateProvider
		.state('magazzino', {
			url: '/magazzino',
			templateUrl: 'magazzino.html',
			controller: 'magazzinoController'
		})

		.state('carichiIn', {
			url: '/carichiIn',
			templateUrl: 'carichi_in.html',
			controller: 'carichiInController'
		})
		
		.state('createOrder', {
			url: '/createOrder',
			templateUrl: 'new_order.html',
			controller: 'orderController'
		})
		
		.state('orderProducts2', {
			url: '/orderPreview',
			templateUrl: 'order_products.html',
			controller: 'orderProductsController'
		})
		
		
		.state('orderProducts', {
			url: '/orderPreview/:nOrdine/:orderId',
			templateUrl: 'order_products.html',
			controller: 'orderProductsController'
		})

		.state('addProduct', {
			url: '/addproduct',
			templateUrl: 'new_product.html',
			controller: 'productController'
		})
})