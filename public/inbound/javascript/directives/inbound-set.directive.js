function inboundSet () {
    return {
        restrict: 'E',
        templateUrl: 'public/inbound/templates/inbound-set.html',
        scope: {},
        bindToController: {
            model: "=",
        },
        transclude: {
            'confirmButton': 'confirmButton'
        },
        controller: function ($scope, InboundFactory, ExpectedFactory, $element, $transclude) {
            var ctrl = this;
            ctrl.product2expected = [];
            ctrl.currentPage = 1;
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
                    return ctrl.model;
                }, 
                function (newVal) {
                    console.log(newVal)
                    if (newVal) {
                        ctrl.inbound.order = newVal.order;
                        ctrl.inbound.products = newVal.products;
                        
                    }
                }
            );
            
            ctrl.expectedSelectionModalContent = {
                url:'public/inbound/templates/inbound-expected-selection.html',
                modalTitle: 'Seleziona quantita ordinata',
                modalId: 'expectedselection',
                modalClass: 'modal modal-xl fade',
                entryLimit: 10,
                expecteds: [],
            }
            
            ctrl.inboundProductEntryModalContent = {
                modalTitle: '',
                modalId: 'inboundproductform',
                modalClass: 'modal modal-xl fade',
                expected: 'undefined',
                oldProduct: {},
                product: {},
            }
            
            $scope.$on('orderFormValid', function (event, data) {
                if (data) {
                    ctrl.orderFormValid = data.$valid;
                }
            })
            
            $scope.$on('inboundProductFormValid', function (event, data) {
                if (data) {
                    ctrl.inboundProductFormValid = data.$valid;
                }
            })
            
            ctrl.newInboundProduct = function () {
                ctrl.inboundProductEntryModalContent.modalTitle = 'Inserisci prodotto del carico';
                ctrl.inboundProductEntryModalContent.product = {};
                ctrl.inboundProductEntryModalContent.expected = undefined;
                ctrl.unlockedForm = 1;
            }
            
            ctrl.unlockModificationForm = function () {
                ctrl.inboundProductEntryModalContent.modalTitle = 'Modifica prodotto del carico';
                ctrl.unlockedForm = 2;
            }

            ctrl.showExpectedList = function () {
                ExpectedFactory.getExpecteds()
                    .then (function (resp) {
                        ctrl.expectedSelectionModalContent.expecteds = resp.data.expected;
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }

            ctrl.selectExpected = function (expected) {
                ctrl.inboundProductEntryModalContent.expected = expected;
                ctrl.inboundProductEntryModalContent.product= {};
                ctrl.inboundProductEntryModalContent.product.materiale = ctrl.inboundProductEntryModalContent.expected.materiale;
                ctrl.inboundProductEntryModalContent.product.qualita = ctrl.inboundProductEntryModalContent.expected.qualita;
                ctrl.inboundProductEntryModalContent.product.colore = ctrl.inboundProductEntryModalContent.expected.colore;
                ctrl.inboundProductEntryModalContent.product.finitura = ctrl.inboundProductEntryModalContent.expected.finitura;
                ctrl.inboundProductEntryModalContent.product.tipo = ctrl.inboundProductEntryModalContent.expected.tipo;
                if (ctrl.inboundProductEntryModalContent.expected.spessore) {
                    ctrl.inboundProductEntryModalContent.product.spessoreNominale = ctrl.inboundProductEntryModalContent.expected.spessore.toString();
                }
                if (ctrl.inboundProductEntryModalContent.expected.larghezza) {
                    ctrl.inboundProductEntryModalContent.product.larghezzaNominale = ctrl.inboundProductEntryModalContent.expected.larghezza.toString();
                }
                ctrl.unlockedForm = 1;
                console.log(ctrl.inboundProductEntryModalContent.product);
            }
            
            ctrl.selectInboundModifyProduct = function (product) {
                ctrl.inboundProductEntryModalContent.oldProduct = product;
                ctrl.inboundProductEntryModalContent.product = Object.assign({},product);
                ctrl.unlockModificationForm();
            }

            ctrl.addInboundProduct = function (product) {
                product.pesoNetto = product.pesoIniziale;
                product.pesoLordo = product.pesoIniziale;
                if (ctrl.inboundProductEntryModalContent.expected) {
                    var element = {};
                    
                    element.peso = product.pesoIniziale;
                    
                    element.productPos = ctrl.inbound.addedProducts.push(product) - 1;

                    var trovato = ctrl.inbound.selectedExpecteds.find(function(e) {
                       return e._id == ctrl.inboundProductEntryModalContent.expected._id;
                    });
                    
                    console.log("trovato",trovato);
                    
                    if (trovato) {
                        i = ctrl.inbound.selectedExpecteds.indexOf(trovato);
                    }
                    else {
                        i = ctrl.inbound.selectedExpecteds.push(ctrl.inboundProductEntryModalContent.expected) - 1;
                    }

                    element.expectedPos = i;
                    ctrl.inbound.selectedExpecteds[i].pesoSaldo-=product.pesoIniziale;
//                    ctrl.inbound.selectedExpecteds[i].pesoConsegnato+=product.pesoIniziale;
                    ctrl.inbound.selectedExpecteds[i].pesoConsegnato = ctrl.inbound.selectedExpecteds[i].pesoOrdinato -ctrl.inbound.selectedExpecteds[i].pesoSaldo;
                    ctrl.product2expected.push(element);
                }
                else {
                    ctrl.inbound.addedProducts.push(product)
                }
                ctrl.inbound.products.push(product);
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
                        ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoSaldo = ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoOrdinato - ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoConsegnato;
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
                var pos;
                pos = ctrl.inbound.products.indexOf(ctrl.inboundProductEntryModalContent.oldProduct);
                ctrl.inbound.products[pos] = product; 
                if (product._id) {  
                    if (ctrl.inbound.modifiedProducts.indexOf(ctrl.inboundProductEntryModalContent.oldProduct) == -1) {
                        ctrl.inbound.modifiedProducts.push(product);
                    }
                    else {
                        pos = ctrl.inbound.modifiedProducts.indexOf(ctrl.inboundProductEntryModalContent.oldProduct);
                        ctrl.inbound.modifiedProducts[pos] = product;    
                    }
                }
                else {
                    pos = ctrl.inbound.addedProducts.indexOf(ctrl.inboundProductEntryModalContent.oldProduct);
                    var trovato = ctrl.product2expected.find(function(e) {
                       return e.productPos == pos;
                    });
                    if (trovato) {
                        ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoConsegnato+=(product.pesoIniziale-trovato.peso);
                        ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoSaldo = ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoOrdinato - ctrl.inbound.selectedExpecteds[trovato.expectedPos].pesoConsegnato;
                    }
                    ctrl.inbound.addedProducts[pos] = product;  
                }
                ctrl.lockForm();
                console.log(product);
            }
        },
        controllerAs: 'inboundSetCtrl',
    };
};

angular
    .module('store')
    .directive('inboundSet', inboundSet)