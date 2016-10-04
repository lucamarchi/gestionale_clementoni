var store = angular.module('store');

store.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
		ngModel.$parsers.push(function(val) {
			return parseInt(val, 10);
		});
		ngModel.$formatters.push(function(val) {
			return '' + val;
		});
    }
  };
});

store.directive('convertToFloat', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseFloat(val);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});

store.directive('expectedTable', function(){
	return {
		restrict: 'E',
		templateUrl:'public/components/expected_table.html',
		scope: { 
			expectedList: "=",
			featureList: "=",
			selectExpectedButton: "=",
			selectExpectedAction: "&"
        } 
	};
});