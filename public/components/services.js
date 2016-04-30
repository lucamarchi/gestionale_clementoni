var store = angular.module('store');

store.factory('orderFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
//    return $resource(myConfig.url+'/api/orders/:id',
	return $resource(myConfig.url+'/api/orders/:id',
		{
			id: "@id"
		}, 
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
		}
	);
}]);

store.factory('productFactory',  ['$resource', 'myConfig', function ($resource, myConfig) {
    return $resource(myConfig.url+'/api/products/:id',
		{
			id: "@id"
		}, 
		{
			update:{method:'PUT'}
  		}
	);
}]);

store.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});


/*-----------------------> ORDINI DI TAGLIO <--------------------------------------------*/
store.factory('cutFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return $resource(myConfig.url+'/api/cuts/:id',
		{
			id: "@id"
		}, 
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
		}
	);
}]);

store.factory('refreshFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return resource = $resource(myConfig.url+'/api/cuts/update', {},
		{
			refresh: {method:'GET', isArray: false}
		}
  	);
}]);


/*--------------------------> PRODUZIONE <----------------------------------------------------*/
store.factory('articleFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return { 
		resourceState: function () {
			return $resource(myConfig.url+'/api/articles/:state', 
				{
					state: "@state"
				},
				{
					getAll: {method:'GET', isArray: false},
				}
			);
		},
		resourceStock: function () {
			return $resource(myConfig.url+'/api/articles/stock/:id', 
				{
					id: "@id"
				},
				{
					update: {method:'PUT'},
				}
			);
		},
		resourceComplete: function () {
			return $resource(myConfig.url+'/api/articles/complete/:id', 
				{
					id: "@id"
				},
				{
					update: {method:'PUT'},
				}
			);
		},
		resourceCustomer: function () {
			return $resource(myConfig.url+'/api/customer/articles/:id', 
				{
					id: "@id"
				}
			)
		}
	}
}]);

store.factory('productionStateFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return resource = $resource(myConfig.url+'/api/prods/:id', 
		{
			id: "@id"
		},
		{
			getAll: {method:'GET', isArray: false},
		}
  	);
}]);

/*--------------------------------> PROCESS<-------------------------------------*/
store.factory('processFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return {
		resource: function() {
			return $resource(myConfig.url+'/api/processes', {});
		},
		resourceArticle: function() {
			return $resource(myConfig.url+'/api/processes/articles/:id',
				{
					id:"@id"
				}
			);
		}
	} 
}]);




/*--------------------------------> LOGIN/LOGOUT <-------------------------------------*/
store.factory('UserService', ['$resource','$window', 'myConfig', function ($resource, $window, myConfig) {
    return{ 
		resource: function(){
			return $resource(myConfig.url+'/api/authenticate', {});
		},
		getUser: function(){
			return {username : $window.sessionStorage.user, role: $window.sessionStorage.role};
		},
		setUser: function(user, role) {
			$window.sessionStorage.user = user;
			$window.sessionStorage.role = role;
			
		},
		getToken: function(){
			return $window.sessionStorage.token;
		},
		setToken: function(token){
			$window.sessionStorage.token = token;
		},
		emptySession: function() {
			delete $window.sessionStorage.user;	
			delete $window.sessionStorage.token;
		}
	};
}]);


store.factory('AuthenticationService', ['$resource', 'myConfig', function ($resource, myConfig) {
    return $resource(myConfig.url+'/api/verify', {
  	});
}]);

store.factory('TokenInterceptor', ['$q', '$window', '$location', '$rootScope', 'myConfig', function ($q, $window, $location, $rootScope, myConfig) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
				config.headers['x-access-token'] = $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
  
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && rejection.status === 500 && rejection.status === 403 && ($window.sessionStorage.token || $rootScope.isLogged)) {
                delete $window.sessionStorage.user;	
				delete $window.sessionStorage.token;
				$rootScope.isLogged = false;
                $location.path("/login");
            }
 			return $q.reject(rejection);
        }
    };
}]);