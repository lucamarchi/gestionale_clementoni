var store = angular.module('store');

store.factory('productFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/products/:product',{product: "@product"}, {
		update:{method:'PUT'}
  	});
	return resource;
});

store.factory('orderFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/orders/:order',{order: "@order"}, {
		update:{method:'PUT'}
  	});
	return resource;
});

store.factory('orderCutFactory', function ($resource) {
    var resource = $resource('http://localhost:8080/api/cuts/:cuts',{cut: "@cut"}, {
		update:{method:'PUT'}
  	});
	return resource;
});






store.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }
 
    return auth;
});

store.factory('UserService', function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('http://localhost:8080/api/authenticate', {username: username, password: password});
        },
 
        logOut: function() {
 		}
    }
});

store.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
//                config.headers.Authorization = $window.sessionStorage.token;
				config.headers['x-access-token'] = $window.sessionStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 500 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }
 			return $q.reject(rejection);
        }
    };
});

store.factory('AuthenticationService2', function($http) {
    return {
		verify: function () {
			return $http.post('http://localhost:8080/api/verify');
		}
	}
});