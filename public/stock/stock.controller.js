var store = angular.module('store');
store.controller('stockController', function ($scope, $scope,stockFactory) {
	
	$scope.monster = [];
	
	var materialArray = ['zincato', 'decapato', 'laf', 'preverniciato', 'caldo', 'aluzinc', 'alluminato', 'elettrozincato'];
	
	var typeArray = ['coil', 'nastro', 'piana', 'ondulata', 'grecata', 'collaboranteh55', 'collaboranteh55-s', 'collaboranteh75', 'collaboranteh75-s'];
	
	var spessorArray = [0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.20, 1.50, 1.80, 2.00, 2.50, 3.00, 4.00, 5.00, 6.00, 8.00, 10.00];
	
	var largArray = [1000, 1250, 1500]; 
	
	function createMonster (products) {
		var i, j, k,z, temp;
		i=0;
		for (mt of materialArray){
			temp = products.filter(function(el){
				return (el.materiale === mt);
			});
			if(temp.length != 0){
				$scope.monster.push({key: mt, lung: 0, value: []}); //i per accedere
				j=0;
				for (tp of typeArray){
					temp = products.filter(function(el){
						return (el.materiale === mt) && (el.tipo === tp);
					});
					if(temp.length != 0){
						$scope.monster[i].value.push({key: tp, lung: 0, value: []}) //j per accedere
						k = 0;
						for (sp of spessorArray) {
							temp = products.filter(function(el){
								return (el.materiale === mt) && (el.tipo === tp) && (el.spessore === sp);
							});
							if(temp.length != 0){
								$scope.monster[i].value[j].value.push({key: sp, lung: 0, weight: 0, value: []}); //k per accedere 
								z = 0;
								for (lg of largArray) {
									temp = products.filter(function(el){
										return (el.materiale === mt) && (el.tipo === tp) && (el.spessore === sp) && (el.classeLarghezza === lg);
									});
									
									if(temp.length != 0){
										$scope.monster[i].value[j].value[k].value.push({key: lg, lung: 0, weight: 0, value: temp}); //z per accedere
										console.log("i ", i, "	j ",j, "	k ",k,"		z ",z);
										console.log("product", $scope.monster[i].value[j].value[k].value[z].value);
										$scope.monster[i].value[j].value[k].value[z].lung = temp.length;
										$scope.monster[i].value[j].value[k].lung = $scope.monster[i].value[j].value[k].lung + temp.length;
										$scope.monster[i].value[j].lung = $scope.monster[i].value[j].lung + temp.length;
										$scope.monster[i].lung = $scope.monster[i].lung + temp.length;
										for (t of temp) {
											$scope.monster[i].value[j].value[k].value[z].weight = $scope.monster[i].value[j].value[k].value[z].weight + t.peso;
											$scope.monster[i].value[j].value[k].weight = $scope.monster[i].value[j].value[k].weight + t.peso; 
										}
										z++;
									}
								}
								k++;
							}
						}
						j++;
					}
				}
				i++;
			}
		}
	}
	
	$scope.getStock = function () {
		stockFactory.getAll(
			function (resp) {
				var products = resp.data;
				createMonster(products);
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
		stockFactory.delete({
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