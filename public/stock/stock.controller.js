var store = angular.module('store');
store.controller('stockController', ['$scope', 'stockFactory', function ($scope, stockFactory) {
		
	$scope.monster = [];
	
	$scope.getStock = function () {
		stockFactory.resource().getAll(
			function (resp) {
				var products = resp.stocks;
				$scope.monster = stockFactory.createMapProducts(products);
				console.log("MAP", $scope.monster);
				console.log("PRODUCTS", products);
			},
			function(err) {
				console.log(err);
			}
		);
	}
	
	$scope.getStock();
	
	$scope.deleteProduct = function (product, index1, index2,index3, index4, index5) {
		console.log("index1" , index1, "  index2 ", index2, "  index3 ",index3, "  index4 ", index4,  "  index5 ", index5);
			stockFactory.resource().delete(
				{
					id:product._id
				},
				function(resp){
					console.log(resp);
					if($scope.monster[index1].lung == 1){
						$scope.monster.splice(index1,1);
					}
					else if ($scope.monster[index1].value[index2].lung == 1){
						$scope.monster[index1].value.splice(index2,1);
						$scope.monster[index1].lung--;
					}
					else if ($scope.monster[index1].value[index2].value[index3].lung == 1){
						$scope.monster[index1].value[index2].value.splice(index3,1);
						$scope.monster[index1].value[index2].lung--;
						$scope.monster[index1].lung--;
					}
					else if ($scope.monster[index1].value[index2].value[index3].value[index4].lung == 1){
						$scope.monster[index1].value[index2].value[index3].value.splice(index4,1);
						$scope.monster[index1].value[index2].value[index3].lung--;
						$scope.monster[index1].value[index2].lung--;
						$scope.monster[index1].lung--;
					}
					else{
						$scope.monster[index1].value[index2].value[index3].value[index4].value.splice(index5,1);
						$scope.monster[index1].value[index2].value[index3].value[index4].lung--;
						$scope.monster[index1].value[index2].value[index3].lung--;
						$scope.monster[index1].value[index2].lung--;
						$scope.monster[index1].lung--;
					}
				},
				function(err){
					console.log(err);
				}
			);
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
	
	
    $scope.materialIncludes = [];
    
    $scope.includeMaterial = function(material) {
        var i = $.inArray(material, $scope.materialIncludes);
        if (i > -1) {
            $scope.materialIncludes.splice(i, 1);
        } else {
            $scope.materialIncludes.push(material);
        }
    }
    
    $scope.materialFilter = function(m2p) {
        if ($scope.materialIncludes.length > 0) {
            if ($.inArray(m2p.key, $scope.materialIncludes) < 0)
                return;
        }
        return m2p;
    }
	
	$scope.typeIncludes = [];
    
    $scope.includeType = function(type) {
        var i = $.inArray(type, $scope.typeIncludes);
        if (i > -1) {
            $scope.typeIncludes.splice(i, 1);
        } else {
            $scope.typeIncludes.push(type);
        }
    }
    
    $scope.typeFilter = function(t2p) {
        if ($scope.typeIncludes.length > 0) {
            if ($.inArray(t2p.key, $scope.typeIncludes) < 0)
                return;
        }
        return t2p;
    }
	
	$scope.spessorIncludes = [];
    
    $scope.includeSpessor = function(spessor) {
        var i = $.inArray(spessor, $scope.spessorIncludes);
        if (i > -1) {
            $scope.spessorIncludes.splice(i, 1);
        } else {
            $scope.spessorIncludes.push(spessor);
        }
    }
    
    $scope.spessorFilter = function(s2p) {
        if ($scope.spessorIncludes.length > 0) {
            if ($.inArray(s2p.key, $scope.spessorIncludes) < 0)
                return;
        }
        return s2p;
    }
	
	$scope.largIncludes = [];
    
    $scope.includeLarg = function(larg) {
        var i = $.inArray(larg, $scope.largIncludes);
        if (i > -1) {
            $scope.largIncludes.splice(i, 1);
        } else {
            $scope.largIncludes.push(larg);
        }
    }
    
    $scope.largFilter = function(l2p) {
        if ($scope.largIncludes.length > 0) {
            if ($.inArray(l2p.key, $scope.largIncludes) < 0)
                return;
        }
        return l2p;
    }
	
	$scope.prepareDeleteStock = function(product,index1,index2,index3,index4,index5){
		$scope.product = product;
		$scope.index1 = index1;
		$scope.index2 = index2;
		$scope.index3 = index3;
		$scope.index4 = index4;
		$scope.index5 = index5;
	}
}]);