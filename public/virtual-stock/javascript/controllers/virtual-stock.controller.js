function VirtualStockController($scope, VirtualStockFactory) {
    var ctrl = this;

    ctrl.getVirtualStock = function () {
        VirtualStockFactory.getVirtualStock()
            .then(function (resp) {
                console.log(resp);
                ctrl.virtualStockMap = ctrl.createVirtualStockMap(resp.data.data.virtual);

            })
            .catch(function (err) {
                console.log(err);
            });
    };

    ctrl.calculateWeight = function (arrayCollection, pesoString) {
        var peso = 0;
        angular.forEach(arrayCollection, function (el) {
            peso += el[pesoString];
        });
        return peso;
    };

    ctrl.findQuadruple = function (el) {
        var quadruple;
        if (el[0]) {
            if (el[0][0] && el[0][0][0]) {
                quadruple = {
                    materiale: el[0][0][0].materiale,
                    tipo: el[0][0][0].tipo,
                    spessore: el[0][0][0].spessoreNominale,
                    qualita: el[0][0][0].qualita,
                    lungLargArray: []
                };
            }
            else if (el[0][1] && el[0][1][0]) {
                quadruple = {
                    materiale: el[0][1][0].materiale,
                    tipo: el[0][1][0].tipo,
                    spessore: el[0][1][0].spessore,
                    qualita: el[0][1][0].qualita,
                    lungLargArray: []
                };
            }
            else if (el[0][2] && el[0][2][0]) {
                quadruple = {
                    materiale: el[0][2][0].materiale,
                    tipo: el[0][2][0].tipo,
                    spessore: el[0][2][0].spessore,
                    qualita: el[0][2][0].qualita,
                    lungLargArray: []
                };
            }
        }
        return quadruple;
    };

    ctrl.findLungLarg = function (el) {
        var lungLarg;

        if (el[0] && el[0][0]) {
            lungLarg = {largh: el[0][0].larghezzaNominale, lungh: el[0][0].lunghezza};
        }
        else if (el[1] && el[1][0]) {
            lungLarg = {largh: el[1][0].larghezza, lungh: el[1][0].lunghezza};
        }
        else if (el[2] && el[2][0]) {
            lungLarg = {largh: el[2][0].larghezza, lungh: el[2][0].lunghezza};
        }
        return lungLarg;
    };

    ctrl.createVirtualStockMap = function (virtualStock) {
        var virtualStockMap = [];
        angular.forEach(virtualStock, function (el1, index1) {
            var quadruple = ctrl.findQuadruple(el1);
            if (quadruple) {
                virtualStockMap.push(quadruple);
            }
            angular.forEach(el1, function (el2) {
                var pesoMagazzino = ctrl.calculateWeight(el2[0], "pesoNetto");
                var pesoArrivo = ctrl.calculateWeight(el2[1], "pesoSaldo");
                var pesoClienti = ctrl.calculateWeight(el2[2], "pesoAttuale");
                var disponibilita = pesoMagazzino - pesoClienti;
                var lungLarg = ctrl.findLungLarg(el2);
                if (virtualStockMap[index1] && lungLarg) {
                    lungLarg.pesoMagazzino = pesoMagazzino;
                    lungLarg.pesoArrivo = pesoArrivo;
                    lungLarg.pesoClienti = pesoClienti;
                    lungLarg.disponibilita = disponibilita;
                    virtualStockMap[index1].lungLargArray.push(lungLarg);
                }
            })
        });
        console.log(virtualStockMap);
        return virtualStockMap;
    };

    ctrl.getVirtualStock();
}

angular
    .module('store')
    .controller('VirtualStockController', ['$scope', 'VirtualStockFactory', VirtualStockController]);