function stockTable () {
	return {
		restrict: 'E',
		templateUrl:'public/stock/templates/stock-table.html',
		scope: {},
        bindToController: {
			stockList: "=",
        },
        transclude: {
            buttonAction: '?buttonAction',
            stockFilters: '?stockFilters'
        },
        controller: function ($scope, features) {
            var ctrl = this;
            ctrl.filterObject = {};
            ctrl.filterObject.materialeArray = [];
            ctrl.filterObject.tipoArray = [];
            ctrl.filterObject.spessoreArray = [];
            ctrl.filterObject.larghezzaArray = [];
            
            ctrl.createMapStocks = function (stocks) {
                var materialArray = features.materiali;
                var typeArray = features.tipi;
                var spessorArray = features.spessoriNominali;
                var largArray = features.larghezzeNominali;

                var monster = [];

                var i, j, k,z, temp;
                i=0;
                for (mt of materialArray) {
                    temp = stocks.filter(function(el){
                        return (el.materiale == mt);
                    });
                    if(temp.length != 0){
                        monster.push({key: mt, lung: 0, weight: 0, value: []}); //i per accedere
                        j=0;
                        for (tp of typeArray){
                            temp = stocks.filter(function(el){
                                return (el.materiale == mt) && (el.tipo == tp);
                            });
                            if(temp.length != 0){
                                monster[i].value.push({key: tp, lung: 0, weight: 0, value: []}) //j per accedere
                                k = 0;
                                for (sp of spessorArray) {
                                    temp = stocks.filter(function(el){
                                        return (el.materiale == mt) && (el.tipo == tp) && (el.spessoreNominale == sp);
                                    });
                                    if(temp.length != 0){
                                        monster[i].value[j].value.push({key: sp, lung: 0, weight: 0, value: []}); //k per accedere 
                                        z = 0;
                                        for (lg of largArray) {
                                            temp = stocks.filter(function(el){
                                                return (el.materiale == mt) && (el.tipo == tp) && (el.spessoreNominale == sp) && (el.larghezzaNominale == lg);
                                            });

                                            if(temp.length != 0){
                                                monster[i].value[j].value[k].value.push({key: lg, lung: 0, weight: 0, value: temp}); //z per accedere
                                                monster[i].value[j].value[k].value[z].lung = temp.length;
                                                monster[i].value[j].value[k].lung = monster[i].value[j].value[k].lung + temp.length;
                                                monster[i].value[j].lung = monster[i].value[j].lung + temp.length;
                                                monster[i].lung = monster[i].lung + temp.length;
                                                for (t of temp) {
                                                    monster[i].value[j].value[k].value[z].weight = monster[i].value[j].value[k].value[z].weight + t.pesoNetto;
                                                    monster[i].value[j].value[k].weight = monster[i].value[j].value[k].weight + t.pesoNetto; 
                                                    monster[i].value[j].weight = monster[i].value[j].weight + t.pesoNetto;
                                                    monster[i].weight = monster[i].weight + t.pesoNetto;
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
                return monster;
            }
            
            $scope.$watchCollection (
                function () {
                    return ctrl.stockList;
                }, 
                function (newVal) {
                    if (newVal) {
                        ctrl.stockMap = ctrl.createMapStocks(newVal);
                    }
                }
            );
            
        },
        controllerAs: 'stockTableCtrl',
    }
}

angular
    .module('store')
    .directive('stockTable', stockTable);