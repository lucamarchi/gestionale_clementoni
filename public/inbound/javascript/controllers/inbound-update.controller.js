function InboundUpdateController($scope, $location, InboundFactory, ExpectedFactory, ProductFactory, $routeParams) {
    var ctrl = this;

    ctrl.inbound = {
        products: [],
        order: {},
        selectedExpecteds: [],
        addedProducts: [],
        modifiedProducts: [],
        deletedProducts: [],
    }

    ctrl.inboundConfirmationModalContent = {
        modalTitle: 'Modifica carico in entrata',
        modalBody: 'Confermare le modifiche al carico in entrata?',
        modalId: 'inboundconfirmation',
        modalClass: 'modal fade',
    }

    ctrl.getInbound = function (id) {
        InboundFactory.getInbound(id)
            .then(function (resp) {
                console.log("TUTTI I PRODOTTI DEL CARICO ", resp);
                ctrl.inbound.products = resp.data.data.products;
                ctrl.inbound.order = resp.data.data.order;
                ctrl.inbound.order.dataDdt = new Date(resp.data.data.order.dataDdt);

            })
            .catch(function (err) {
                console.log(err);
            });
    }

    ctrl.getInbound($routeParams.id);

    ctrl.updateInboundOrder = function (inbound) {
        console.log(inbound);
        InboundFactory.updateInbound({
            order: inbound.order,
            productsToAdd: inbound.addedProducts,
            productsToRemove: inbound.deletedProducts,
            productsToModify: inbound.modifiedProducts,
            expecteds: inbound.selectedExpecteds
        })
            .then(function (resp) {
                console.log("update ", resp)
                $location.path("/inbound")
            })
            .catch(function (err) {
                console.log(err);
            })
    };
}


angular
    .module('store')
    .controller('InboundUpdateController', ['$scope', '$location', 'InboundFactory', 'ExpectedFactory', 'ProductFactory', '$routeParams', InboundUpdateController]);