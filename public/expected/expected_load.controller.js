store.controller('expectedLoadController', ['$scope', 'expectedLoadFactory', 'features', function ($scope, expectedLoadFactory,features) {
	
	
	expectedLoadFactory.getAll(
		function (resp) {
			console.log(resp);
			console.log("TUTTI I CARICHI IN ATTESA" , resp.expected);
			$scope.expectedLoads = resp.expected;
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
		var expectedLoad = $scope.expectedLoad;
		valuesProduct(expectedLoad);
		expectedLoad.dataPrevista = $scope.expectedOrder.dataPrevista;
		expectedLoad.fornitore = $scope.expectedOrder.fornitore;
		$scope.orderExpectedLoads.push($scope.expectedLoad);
		console.log($scope.orderExpectedLoads);
	}
	
	$scope.confirmExpectedOrder = function () {
		var expected = $scope.orderExpectedLoads;
		expectedLoadFactory.save({},
			{expected},
			function(resp){
				console.log("ORDINE CONFERMATO ", resp.expected);
				$scope.expectedLoads = $scope.expectedLoads.concat(resp.expected);
				console.log($scope.expectedLoads);
			},
			function (err){
				console.log(err);
			}
		);
	}
}]);

	