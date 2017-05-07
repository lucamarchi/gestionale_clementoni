var store = angular.module('store', ['ngRoute', 'ngResource', 'ngTouch', 'ngAnimate', 'ui.bootstrap']);

store.constant("myConfig", {
	"url": "http://localhost:8080",
//	"url": "http://clements-clementoni.rhcloud.com"
});

store.constant("features", {
	"tipi": ["coil", "nastro", "piana","ondulata", "grecata", "pressopiegata", "collaboranteh55", "collaboranteh55-s", "collaboranteh75", "collaboranteh75-s"],
	"materiali": ["zincato", "decapato","elettrozincato", "laf", "preverniciato", "caldo", "aluzinc", "alluminato", "inox"],
	"qualita": {
        "zincato": ["dx51d", "dx52d", "dx53d", "dx54d","s250gd","s280gd"],
        "decapato": ["dd11", "dd12", "dd13", "dd14","s235jr","s355jr","s355mc","s420mc"],
        "laf": ["dc01", "dc02", "dc03", "dc04"],
        "caldo": ["s235jr", "s275jr", "s355jr","s235jo", "s275jo", "s355jo","s235j2", "s275j2", "s355j2"],
        "preverniciato": ["dx51d", "dx52d", "dx53d", "dx54d"],
        "elettrozincato": ["dc01", "dc02", "dc03", "dc04"],
        "inox":["430","304","316","303l","304t","316l","316t"]
    },
	"scelte":["a", "b", "c", "0"],
	"finiture": {
        "zincato":["z100", "z140", "z200", "z275"],
        "preverniciato":["z100", "z140", "z200", "z275"],
        "inox": ["2b","ba", "sb", "satinato"]
    },
	"colori": {
        "preverniciato": ["v","bg","tdm","rs"]  
    },
	"superfici": {
        "zincato":["br","mf","f","skl"]
    },
	"spessoriNominali": ["0.25", "0.3", "0.35", "0.4", "0.45", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "1.2", "1.5", "1.8", "2", "2.5", "3", "4", "5", "6", "8", "10","12"],
	"lunghezze": ["2000","2500","3000"],
	"larghezzeNominali":["1000", "1250", "1500"],
	"stati": ["sospeso", "approvato", "respinto"],
	"stabilimenti": ["1", "2"],
	"fornitori": ["21","15","7","5","4","2","1"],
	"trasportatori":["tizio", "caio", "sempronio"],
	"unita":["0","1","01"],
    "macchinari": {
            "slitter":"a",
            "spianatrice":"b",
            "pressopiegatrice":"c",
            "grandini":"d",
            "ondulatorie":"e",
            "grecatrice":"d"
    }
});



store.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $routeProvider
		.when('/', {
        	templateUrl: 'public/stock/templates/stocks.html',
			controller: 'StockController',
            controllerAs: 'stockCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
		
      	.when('/stock', {
        	templateUrl: 'public/stock/templates/stocks.html',
			controller: 'StockController',
            controllerAs: 'stockCtrl',
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
	
		.when('/inbound', {
        	templateUrl: 'public/inbound/templates/inbounds.html',
			controller: 'InboundController',
            controllerAs: 'inCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
    
        .when('/inbound/create', {
        	templateUrl: 'public/inbound/templates/inbound-create.html',
			controller: 'InboundCreateController',
            controllerAs: 'inCreateCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
    
        .when('/inbound/update/:id', {
        	templateUrl: 'public/inbound/templates/inbound-update.html',
			controller: 'InboundUpdateController',
            controllerAs: 'inUpdateCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
    
        .when('/inbound/details/:id', {
        	templateUrl: 'public/inbound/templates/inbound-details.html',
			controller: 'InboundDetailsController',
            controllerAs: 'inboundDetailsCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
	
		.when('/expected', {
        	templateUrl: 'public/expected/templates/expecteds.html',
			controller: 'ExpectedController',
            controllerAs: 'expCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
    
        .when('/expected/create', {
        	templateUrl: 'public/expected/templates/expected-create.html',
			controller: 'ExpectedCreateController',
            controllerAs: 'expCreateCtrl',
			access: { 
				requiredLogin: true 
			}
      	})
	
        .when('/cut', {
        	templateUrl: 'public/cut/templates/cuts.html',
			controller: 'CutController',
            controllerAs: 'cutCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/cut/details/:id', {
        	templateUrl: 'public/cut/templates/cut-details.html',
			controller: 'CutDetailsController',
            controllerAs: 'cutDetailsCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
    
		.when('/login', {
        	templateUrl: 'public/login/templates/login.html',
			controller:'LoginController',
			access: { 
				requiredLogin: false 
			}
      	})
	
		
	
		.when('/productionOverview', {
        	templateUrl: 'public/production-overview/templates/prod-overview.html',
			controller: 'ProdOverviewController',
            controllerAs: 'prodOverCtrl',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/productionState', {
        	templateUrl: 'public/production-state/templates/prod-states.html',
			controller: 'ProdStateController',
            controllerAs: 'prodStateCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/productionState/details/:id', {
        	templateUrl: 'public/production-state/templates/prod-state-articles.html',
			controller: 'ProdStateDetailsController',
            controllerAs: 'prodStateDetailsCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/productionState/create', {
        	templateUrl: 'public/production-state/templates/prod-state-create.html',
			controller: 'ProdStateCreateController',
            controllerAs: 'prodStateCreateCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/productionState/processing/:id', {
        	templateUrl: 'public/production-state/templates/processing-progress.html',
			controller: 'ProcessingController',
            controllerAs: 'processCtrl',
			access: { 
				requiredLogin: true
			}
      	})
	
		.when('/outbound', {
        	templateUrl: 'public/outbound/templates/outbounds.html',
			controller: 'OutboundController',
            controllerAs: 'outboundCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/outbound/details/:id', {
        	templateUrl: 'public/outbound/templates/outbound-details.html',
			controller: 'OutboundDetailsController',
            controllerAs: 'outboundDetailsCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/outbound/create', {
        	templateUrl: 'public/outbound/templates/outbound-create.html',
			controller: 'OutboundCreateController',
            controllerAs: 'outboundCreateCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/outbound/update/:id', {
        	templateUrl: 'public/outbound/templates/outbound-update.html',
			controller: 'OutboundUpdateController',
            controllerAs: 'outboundUpdateCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        .when('/outbound/despatch/:id', {
        	templateUrl: 'public/outbound/templates/outbound-despatch.html',
			controller: 'OutboundDespatchController',
            controllerAs: 'outboundDespatchCtrl',
			access: { 
				requiredLogin: true
			}
      	})
    
        
	
		.otherwise({
        	redirectTo: '/'
      	});
    
        $locationProvider.hashPrefix('');
		
}]);


store.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

store.run(['$rootScope', '$location', 'AuthenticationService', 'UserService', function($rootScope, $location, AuthenticationService, UserService) {
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
		AuthenticationService.save({},{},
			function(resp) {
				$rootScope.isLogged = true;
				$rootScope.user = UserService.getUser();
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
        delete $rootScope.user;
		$location.path("/login");
	}
}]);