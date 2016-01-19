var store = angular.module('store');
store.controller('magazzinoController', function ($scope, productFactory) {
	
	$scope.products = productFactory.query();
	
	$scope.deleteProduct = function (id) {
		productFactory.remove({
			product:id
		},
		function(resp){
			console.log(resp);
		},
		function(err){
			console.log(err);
		});
	}
	
	$scope.openProduct = function (product) {
		$scope.product = product;
	}
	
	$scope.updateProduct = function (product) {
		productFactory.update({
			product:product._id
		},
		product,
		function(resp){
			console.log(resp);
		},
		function(err){
			console.log(err);
		});
	}

});