store.controller('expectedController', ['$scope', 'expectedFactory', 'features', function ($scope, expectedFactory,features) {
	
	
	expectedFactory.getAll(
		function (resp) {
			console.log(resp);
			console.log("TUTTI I CARICHI IN ATTESA" , resp.expected);
			$scope.expecteds = resp.expected;
			$scope.totalItems = $scope.expecteds.length;
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
		$scope.orderExpecteds = [];
		console.log($scope.orderExpecteds);
	}

	$scope.newExpected = function () {
		$scope.expected = undefined;	
	}

	$scope.addExpected = function () {
		var expected = $scope.expected;
		valuesProduct(expected);
		expected.dataPrevista = $scope.expectedOrder.dataPrevista;
		expected.fornitore = $scope.expectedOrder.fornitore;
		$scope.orderExpecteds.push($scope.expected);
		console.log($scope.orderExpecteds);
	}
	
	$scope.confirmExpectedOrder = function () {
		var expected = $scope.orderExpecteds;
		expectedFactory.save({},
			{expected},
			function(resp){
				console.log("ORDINE CONFERMATO ", resp);
				$scope.expecteds = $scope.expecteds.concat(resp.expected);
			},
			function (err){
				console.log(err);
			}
		);
	}
}]);

	