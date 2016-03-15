var store = angular.module('store');

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
    return $resource('http://localhost:8080/api/products/:id',
		{
			id: "@id"
		}, 
		{
			update:{method:'PUT'}
  		}
	);
});

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

store.factory('refreshFactory', function ($resource) {
    return resource = $resource('http://localhost:8080/api/cuts/update', {},
		{
			refresh: {method:'GET', isArray: false}
		}
  	);
});


/*--------------------------> LOGISTICA <----------------------------------------------------*/
store.factory('articleFactory', function ($resource) {
    return { 
		resourceState: function () {
			return $resource('http://localhost:8080/api/articles/:state', 
				{
					state: "@state"
				},
				{
					getAll: {method:'GET', isArray: false},
				}
			);
		},
		resourceStock: function () {
			return $resource('http://localhost:8080/api/articles/stock/:id', 
				{
					id: "@id"
				},
				{
					update: {method:'PUT'},
				}
			);
		},
		resourceComplete: function () {
			return $resource('http://localhost:8080/api/articles/complete/:id', 
				{
					id: "@id"
				},
				{
					update: {method:'PUT'},
				}
			);
		}
	}
});

store.factory('productionStateFactory', function ($resource) {
    return resource = $resource('http://localhost:8080/api/prods/:id', 
		{
			id: "@id"
		},
		{
			getAll: {method:'GET', isArray: false},
		}
  	);
});

/*--------------------------------> PROCESS<-------------------------------------*/
store.factory('processFactory', function ($resource) {
    return $resource('http://localhost:8080/api/processes', {});
});




/*--------------------------------> LOGIN/LOGOUT <-------------------------------------*/
store.factory('UserService', function ($resource, $window) {
    return{ 
		resource: function(){
			return $resource('http://localhost:8080/api/authenticate', {});
		},
		getUser: function(){
			return $window.sessionStorage.user;
		},
		getToken: function(){
			return $window.sessionStorage.user;
		},
		setToken: function(token){
			$window.sessionStorage.token = token;
		},
		setUser: function(user) {
			$window.sessionStorage.user = user;
		}
	};
});


store.factory('AuthenticationService', function ($resource) {
    return $resource('http://localhost:8080/api/verify', {
  	});
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
            if (rejection != null && rejection.status === 401 && rejection.status === 500 && rejection.status === 403 && ($window.sessionStorage.token || $rootScope.isLogged)) {
                delete $window.sessionStorage.user;	
				delete $window.sessionStorage.token;
				$rootScope.isLogged = false;
                $location.path("/login");
            }
 			return $q.reject(rejection);
        }
    };
});