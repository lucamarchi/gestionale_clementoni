var store = angular.module('store');
store.controller('stockController', function ($scope, stockFactory) {
	
	$scope.spessor2products = [
		{key: 0.25, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.30, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.35, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.40, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.45, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.50, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.60, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.70, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.80, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 0.90, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 1.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 1.20, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 1.50, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 1.80, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 2.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 2.50, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 3.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 4.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 5.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 6.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key: 8.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]},
		{key:10.00, lung: 0, value: [{key: 2000, value: []},{key: 2500, value: []},{key: 3000, value: []}]}
	];
	
	function sameSpessor(products) {
		var i, j, temp;
		i=0;
		for (s2p of $scope.spessor2products) {
			j = 0;
//			console.log("s2pkey", s2p.key);
			for(l2p of s2p.value) {
				temp = products.filter(function(el){
					return (el.spessore === s2p.key) && (el.classeLarghezza === l2p.key);
				});
				
				$scope.spessor2products[i].value[j].value = temp;
				$scope.spessor2products[i].lung = $scope.spessor2products[i].lung + temp.length;
//				console.log("l2pkey", l2p.key);
//				console.log($scope.spessor2products[i].value[j].value);
				j++
			}
//			console.log("MAPLUNG", $scope.spessor2products[i].lung);
			if ($scope.spessor2products[i].lung < $scope.spessor2products[i].value.length){
				$scope.spessor2products[i].lung = $scope.spessor2products[i].value.length;
			}
			console.log("ciaociao", $scope.spessor2products[i].lung);
			i++;
		}
	}
		
	stockFactory.getAll(
		function (resp) {
			$scope.products = resp.data;
			sameSpessor($scope.products);
			console.log("MAP", $scope.spessor2products);
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