var store = angular.module('store');
store.controller('stockController', function ($scope, stockFactory) {
	
	stockFactory.getAll(
		function (resp) {
			console.log(resp.data);
			$scope.products = resp.data;
		},
		function(err) {
			console.log(err);
		}
	);
	
	$scope.deleteProduct = function (product) {
		stockFactory.delete({
			id:product._id
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
		stockFactory.update({
			id:product._id
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