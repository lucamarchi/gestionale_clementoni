var myapp = angular.module('store', ['ngRoute']);
myapp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/magazzino', {
				templateUrl: 'magazzino.html',
				controller: 'carichiInController'
			})

			.when('/carichiIn', {
				templateUrl: 'carichi_in.html',
				controller: 'carichiInController'
			})

			.when('/createOrder', {
				templateUrl: 'new_order.html',
				controller: 'orderController'
			})

			.when('/orderPreview', {
				templateUrl: 'order_products.html',
				controller: 'orderProductsController'
			})


			.when('/orderPreview/:nOrdine/:orderId', {
				templateUrl: 'order_products.html',
				controller: 'orderProductsController'
			})

			.when('/addproduct', {
				templateUrl: 'new_product.html',
				controller: 'productController'
			})
}])