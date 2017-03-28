function inboundSet () {
    return {
        restrict: 'E',
        templateUrl: 'public/inbound/templates/inbound-set.html',
        scope: {},
        bindToController: {
            models: "=",
        },
        transclude: {
            'confirmButton': 'confirmButton'
        },
        controller: function ($scope, InboundFactory, ExpectedFactory, $element, $transclude) {
            var ctrl = this;
            ctrl.product2expected = [];
            ctrl.currentPage = 1;
            ctrl.inboundProduct = {};
            
            ctrl.inbound = {};
            ctrl.inbound.order = {};
            ctrl.inbound.products = [];
            ctrl.inbound.addedProducts = [];
            ctrl.inbound.modifiedProducts = [];
            ctrl.inbound.deletedProducts = [];
            ctrl.inbound.selectedExpecteds = [];
            ctrl.unlockedForm = 0;
            
            $scope.$watchCollection(
                function () {
                    return ctrl.models;
                }, 
                function (newVal) {
                    if (newVal) {
                        ctrl.inbound.order = newVal.inboundOrder;
                        ctrl.inbound.products = newVal.inboundProducts;
                    }
                }
            );
            
            $scope.$watchCollection(
                function () {
                    return ctrl.inbound;
                }, 
                function(newVal) {
                        $scope.inbound = newVal;
                        $scope.completeAction = ctrl.completeAction;
                        console.log($scope.inbound);
                }
            );
            
            ctrl.expectedModalContent = {
                url:'public/inbound/templates/inbound-expected-selection.html',
                modalTitle: 'Seleziona quantita ordinata',
                modalId: 'expectedselection',
                expecteds: [],
            }

            ctrl.register = function(childController) {
                var orderForm = childController.inOrderForm;
                 $scope.$watchCollection(function () {
                    return orderForm;
                 }, function (newVal) {
                    if (newVal) {
                        $scope.orderFormValid = newVal.$valid;
                    }
                });
            };
            
            ctrl.unlockAdditionForm = function () {
                ctrl.unlockedForm = 1;
            }
            
            ctrl.unlockModificationForm = function () {
                ctrl.unlockedForm = 2;
            }

            ctrl.lockForm = function () {
                ctrl.unlockedForm = 0;
                ctrl.currentExpected = undefined;
                ctrl.inboundProduct = undefined;
            }

            ctrl.showExpectedList = function () {
                ExpectedFactory.getExpecteds()
                    .then (function (resp) {
                        ctrl.expectedModalContent.expecteds = resp.data.expected;
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }

            ctrl.selectExpected = function (expected) {
                ctrl.currentExpected = expected;
                ctrl.inboundProduct = {};
                ctrl.inboundProduct.materiale = ctrl.currentExpected.materiale;
                ctrl.inboundProduct.qualita = ctrl.currentExpected.qualita;
                ctrl.inboundProduct.finitura = ctrl.currentExpected.finitura;
                ctrl.inboundProduct.tipo = ctrl.currentExpected.tipo;
                ctrl.inboundProduct.spessoreNominale = ctrl.currentExpected.spessore;
                ctrl.inboundProduct.larghezzaNominale = ctrl.currentExpected.larghezza;
                ctrl.unlockAdditionForm();
                console.log(ctrl.currentExpected);
            }
            
            ctrl.selectInboundModifyProduct = function (product) {
                ctrl.inboundProduct = product;
                ctrl.unlockModificationForm();
            }

            ctrl.addInboundProduct = function (product) {
                if (ctrl.currentExpected) {
                    var element = {};
                    if (!ctrl.currentExpected.pesoOrdinato) {
                        ctrl.currentExpected.pesoOrdinato = 150;
                        ctrl.currentExpected.pesoSaldo = ctrl.currentExpected.pesoOrdinato - ctrl.currentExpected.pesoConsegnato;
                        ctrl.currentExpected.pesoConsegnato = 0;
                    }
                    
                    element.peso = product.pesoIniziale;
                    
                    element.productPos = ctrl.inbound.addedProducts.push(product) - 1;

                    var trovato = ctrl.inbound.selectedExpecteds.find(function(e) {
                       return e._id == ctrl.currentExpected._id;
                    });

                    if (trovato) {
                        i = ctrl.inbound.selectedExpecteds.indexOf(trovato);
                    }
                    else {
                        i = ctrl.inbound.selectedExpecteds.push(ctrl.currentExpected) - 1;
                    }

                    element.expectedPos = i;
                    ctrl.inbound.selectedExpecteds[i].pesoSaldo-=product.pesoIniziale;
                    ctrl.inbound.selectedExpecteds[i].pesoConsegnato+=product.pesoIniziale;
                    ctrl.product2expected.push(element);
                }
                else {
                    ctrl.inbound.addedProducts.push(product)
                }
                ctrl.inbound.products.push(product);
                ctrl.lockForm();
                console.log("P2E", ctrl.product2expected);
            }
            
            ctrl.deleteProduct = function (product) {
                if (product._id && ctrl.inbound.deletedProducts.indexOf(product) == -1) {
                    ctrl.inbound.deletedProducts.push(product);
                }
                else {
                    var pos = ctrl.inbound.addedProducts.indexOf(product);
                    var trovato = ctrl.product2expected.find(function(e) {
                       return e.productPos == pos;
                    });
                    if (trovato) {
                        ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoConsegnato-=trovato.peso;
                        ctrl.product2expected.splice(ctrl.product2expected.indexOf(trovato),1);
                        for (p2e of ctrl.product2expected) {
                            if (p2e.productPos > trovato.productPos) {
                                p2e.productPos--;
                            }
                        }
                    }
                    ctrl.inbound.addedProducts.splice(pos,1);
                    
                }
                ctrl.inbound.products.splice(ctrl.inbound.products.indexOf(product),1);
                console.log(product);
            }
            
            ctrl.updateInboundProduct = function (product) {
                if (product._id  && ctrl.inbound.modifiedProducts.indexOf(product) == -1) {
                    ctrl.inbound.modifiedProducts.push(product);
                }
                else {
                    var pos = ctrl.inbound.addedProducts.indexOf(product);
                    var trovato = ctrl.product2expected.find(function(e) {
                       return e.productPos == pos;
                    });
                    if (trovato) {
                        ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoConsegnato+=(product.pesoIniziale-trovato.peso);
                    }
                }
                ctrl.lockForm();
                console.log(product);
            }
        },
        controllerAs: 'inSetCtrl',
    };
};

angular
    .module('store')
    .directive('inboundSet', inboundSet)