var myapp = angular.module('store', ["ui.router"])
    myapp.config(function($stateProvider, $urlRouterProvider){
      
      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/")
      
     	$stateProvider
			.state('magazzino', {
            	url: '/magazzino',
            	templateUrl: 'magazzino.html',
		  		controller: 'productController'
        	})
		  	.state('carichiIn', {
				url: "/carichiIn",
              	templateUrl: "carichientrata.html",
              	controller: 'orderController'
	  		})
	})