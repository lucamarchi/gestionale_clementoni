function VirtualStockController($scope, VirtualStockFactory) {
    var ctrl = this;

    ctrl.infoQuantityModalContent = {
        modalTitle: '',
        modalClass: 'modal fade',
        modalId: 'infoquantity',
        quantityMap: undefined,
        keyHeader: '',
        valueHeader: '',
    };

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
        var quadruple = {};
        if (el.materiale) {
            quadruple.materiale = el.materiale;
        }
        if (el.tipo) {
            quadruple.tipo = el.tipo;
        }
        if (el.spessore) {
            quadruple.spessore = el.spessore;
        }
        if (el.qualita) {
            quadruple.qualita = el.qualita;
        }
        quadruple.lungLargArray = [];
        return quadruple;
    };


    ctrl.findLungLarg = function (el) {
        var lungLarg = {};

        if (el.larghezza) {
            lungLarg.larghezza = el.larghezza;
        }
        if (el.lunghezza) {
            lungLarg.lunghezza = el.lunghezza;
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
            angular.forEach(el1.data, function (el2) {
                var lungLarg = ctrl.findLungLarg(el2);
                lungLarg.pesoMagazzino = ctrl.calculateWeight(el2.data.products, "pesoNetto");
                lungLarg.pesoArrivo = ctrl.calculateWeight(el2.data.expecteds, "pesoSaldo");
                lungLarg.expecteds = el2.data.expecteds;
                lungLarg.pesoClienti = ctrl.calculateWeight(el2.data.articles, "pesoAttuale");
                lungLarg.articles = el2.data.articles;
                lungLarg.disponibilita = lungLarg.pesoMagazzino - lungLarg.pesoClienti;
                virtualStockMap[index1].lungLargArray.push(lungLarg);
            })
        });
        console.log(virtualStockMap);
        return virtualStockMap;
    };

    ctrl.getFornitoreQuantity = function (expecteds) {
        ctrl.infoQuantityModalContent.modalTitle = "Quantita in arrivo";
        ctrl.infoQuantityModalContent.keyHeader = "Fornitore";
        ctrl.infoQuantityModalContent.valueHeader = "Peso Ordinato";
        ctrl.getQuantityMap(expecteds,'fornitore','pesoSaldo');
    };

    ctrl.getClienteQuantity = function (articles) {
        ctrl.infoQuantityModalContent.modalTitle = "Quantita ordinata";
        ctrl.infoQuantityModalContent.keyHeader = "Cliente";
        ctrl.infoQuantityModalContent.valueHeader = "Peso Ordinato";
        ctrl.getQuantityMap(articles,'clienteCod','pesoAttuale');
    };

    ctrl.getQuantityMap = function (collection, keyAttribute, pesoAttribute) {
        console.log(collection);
        ctrl.infoQuantityModalContent.quantityMap = {};
        angular.forEach(collection, function (el) {
            var key = el[keyAttribute];
            if (!ctrl.infoQuantityModalContent.quantityMap[key]) {
                ctrl.infoQuantityModalContent.quantityMap[key] = 0;
            }
            ctrl.infoQuantityModalContent.quantityMap[key]+=el[pesoAttribute];
        });
        console.log(ctrl.infoQuantityModalContent.quantityMap);
        $('#' + ctrl.infoQuantityModalContent.modalId).modal('show');
    };

    ctrl.getVirtualStock();
}

angular
    .module('store')
    .controller('VirtualStockController', ['$scope', 'VirtualStockFactory', VirtualStockController]);