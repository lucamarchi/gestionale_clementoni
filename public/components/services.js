var store = angular.module('store');

store.factory('stockFactory', function ($resource) {
    return $resource = $resource('http://localhost:8080/api/stocks/:id',
		{
			id: "@id"
		}, 
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
		}
	);
});

store.factory('orderFactory', function ($resource) {
    return $resource('http://localhost:8080/api/orders/:id',
		{
			id: "@id"
		}, 
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
		}
	);
});

store.factory('productFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/products/:product',{product: "@product"}, {
		update:{method:'PUT'}
  	});
	return resource;
});



store.factory('cutFactory', function ($resource) {
    return $resource('http://localhost:8080/api/cuts/:id',
		{
			id: "@id"
		}, 
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
		}
	);
});

store.factory('UserService', function ($resource) {
    var resource = $resource('http://localhost:8080/api/authenticate', {
  	});
	return resource;
});


store.factory('AuthenticationService', function ($resource) {
    var resource = $resource('http://localhost:8080/api/verify', {
  	});
	return resource;
});


store.factory('TokenInterceptor', function ($q, $window, $location, $rootScope) {
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
            if (rejection != null && rejection.status === 500 && ($window.sessionStorage.token || $rootScope.isLogged)) {
                delete $window.sessionStorage.token;
				$rootScope.isLogged = false;
                $location.path("/login");
            }
 			return $q.reject(rejection);
        }
    };
});