store.controller('expectedLoadController', ['$scope', 'expectedLoadFactory', 'features', function ($scope, expectedLoadFactory,features) {
	
	
	expectedLoadFactory.getAll(
		function (resp) {
			console.log("TUTTI I CARICHI IN ATTESA" , resp.data);
			$scope.expectedLoads = resp.data;
			$scope.totalItems = $scope.expectedLoads.length;
			$scope.entryLimit = 20;
			$scope.currentPage = 1;
			$scope.maxSize = Math.ceil($scope.totalItems / $scope.entryLimit);
		},
		function(err) {
			console.log(resp);
		}
	);
	
	$scope.features = features;
	
	$scope.newExpectedOrder = function () {
		$scope.expectedOrder = undefined;
		$scope.orderExpectedLoads = [];
		console.log($scope.orderExpectedLoads);
	}

	$scope.newExpectedLoad = function () {
		$scope.expectedLoad = undefined;	
	}

	$scope.addExpectedLoad = function () {
		valuesProduct($scope.expectedLoad);
		console.log($scope.expectedLoad);
		$scope.orderExpectedLoads.push($scope.expectedLoad);
		console.log($scope.orderExpectedLoads);
	}
	
	$scope.confirmExpectedOrder = function () {
		var expected = $scope.orderExpectedLoads;
		expected.dataPrevista = $scope.expectedOrder.dataPrevista;
		expected.fornitore = $scope.expectedOrder.fornitore;
		expectedLoadFactory.save({},
			{expected},
			function(resp){
				console.log("ORDINE CONFERMATO ", resp);
//				$scope.expectedLoads.push(resp);
			},
			function (err){
				console.log(err);
			}
		);
	}
}]);

	