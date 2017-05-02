function stockTable () {
	return {
		restrict: 'E',
		templateUrl:'public/stock/templates/stock-table.html',
		scope: {},
        bindToController: {
			stockList: "=",
        },
        transclude: {
            buttonAction: '?buttonAction',
            stockFilters: '?stockFilters'
        },
        controller: function ($scope, StockFactory, features) {
            var ctrl = this;
            ctrl.filterObject = {};
            ctrl.filterObject.materialeArray = [];
            ctrl.filterObject.tipoArray = [];
            ctrl.filterObject.spessoreArray = [];
            ctrl.filterObject.larghezzaArray = [];
            
            $scope.$watchCollection (
                function () {
                    return ctrl.stockList;
                }, 
                function (newVal) {
                    if (newVal) {
                        ctrl.stockMap = StockFactory.createMapStocks(newVal);
                    }
                }
            );
            
        },
        controllerAs: 'stockTableCtrl',
    }
}

function stockFilter() {
    return {    
        restrict: 'E',
        templateUrl:'public/stock/templates/stock-filter.html',
        scope: {},
        bindToController: {
            model: "=",
        },
        controller: function ($scope, features) {
            var ctrl = this;
            ctrl.features = features;
            
            ctrl.includeVal = function(val, array) {
                var i = array.indexOf(val);
                if (i > -1) {
                    array.splice(i, 1);
                } else {
                    array.push(val);
                }
                console.log(array);
            }
            
        },
        controllerAs: 'stockFilterCtrl',
    }
}

angular
    .module('store')
    .directive('stockTable', stockTable)
    .directive('stockFilter', stockFilter)