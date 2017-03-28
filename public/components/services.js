var store = angular.module('store');


/*--------------------------> PRODUZIONE <----------------------------------------------------*/
store.factory('articleFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return { 
		resource: function () {
			return $resource(myConfig.url+'/api/articles/', 
				{},
				{
					getAll: {method:'GET', isArray: false},
				}
			);
		},
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

/*--------------------------------> PRODUCTION STATE<-------------------------------------*/
store.factory('productionStateFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return $resource(myConfig.url+'/api/prods/:id', 
		{
			id: "@id"
		},
		{
			update: {method:'PUT'},
			getAll: {method:'GET', isArray: false}
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
			return $resource(myConfig.url+'/api/processes/article/:id',
				{
					id:"@id"
				}
			);
		},
		resourceChildren: function() {
			return $resource(myConfig.url+'/api/processes/figli/:id',
				{
					id:"@id"
				}
			);
		}
	} 
}]);

/*--------------------------------> CUSTOMER <-------------------------------------*/
store.factory('customerFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
	return {
		resourceGroup: function() {
			return $resource(myConfig.url+'/api/customers', {});
		},
		resourceId: function() {
			return $resource(myConfig.url+'/api/customer/:id', 
				{
					id:"@id"
				}
			);
		},
		resourceCod: function() {
			return $resource(myConfig.url+'/api/customerCod/:id', 
				{
					id:"@id"
				}
			);
		},
	}
}]);

/*--------------------------------> LOGIN/LOGOUT <-------------------------------------*/
store.factory('UserService', ['$resource','$window', 'myConfig', function ($resource, $window, myConfig) {
    return{ 
		resource: function(){
			return $resource(myConfig.url+'/api/authenticate', {});
		},
		getUser: function(){
			return {username: $window.sessionStorage.username, role:$window.sessionStorage.role};
		},
		setUser: function(username, role) {
            $window.sessionStorage.username = username;
            $window.sessionStorage.role = role;
            console.log($window.sessionStorage.username,$window.sessionStorage.role )
		},
		getToken: function(){
			return $window.sessionStorage.token;
		},
		setToken: function(token){
			$window.sessionStorage.token = token;
		},
		emptySession: function() {
			delete $window.sessionStorage.username;
            delete $window.sessionStorage.role;
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
            console.log("bbbb");
        },
  
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && (rejection.status === 401 || rejection.status === 500 || rejection.status === 403) && ($window.sessionStorage.token || $rootScope.isLogged)) {
                delete $window.sessionStorage.user;	
				delete $window.sessionStorage.token;
				$rootScope.isLogged = false;
                $location.path("/login");
            }
 			return $q.reject(rejection);
        }
    };
}]);