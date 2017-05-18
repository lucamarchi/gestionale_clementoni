/**
 * Created by nexse on 18/05/2017.
 */

function cutTable() {
    return {
        restrict: 'E',
        templateUrl: 'public/cut/templates/cut-table.html',
        scope: {},
        bindToController: {
            cutList: "=",
            currentPage: "=",
            entryLimit: "=",
        },
        controller: function ($scope, CutFactory, $location) {
            var ctrl = this;

            ctrl.cutDeletionModalContent = {
                modalTitle: 'Conferma rimozione ordine di taglio',
                modalId: 'cutdeletion',
                modalClass: 'modal fade',
                modalBody: 'Rimuovere l\'ordine con i relativi articoli scaricati dal portale agenti?',
                cut: {}
            };

            ctrl.cutConfirmationModalContent = {
                modalTitle: 'Conferma dell\'ordine di taglio',
                modalId: 'cutconfirmation',
                modalClass: 'modal fade',
                modalBody: 'Confermare l\'ordine con i relativi articoli scaricati dal portale agenti?',
                cut: {}
            };

            ctrl.selectCut = function (cut) {
                console.log(cut);
                ctrl.cutDeletionModalContent.cut = cut;
                ctrl.cutConfirmationModalContent.cut = cut;
            };

            ctrl.deleteCut = function (cut) {
                CutFactory.deleteCut(cut._id)
                    .then(function (resp) {
                        console.log(resp);
                        ctrl.cutList.splice(ctrl.cutList.indexOf(cut), 1);
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            };

            ctrl.showCutDetails = function (cutId) {
                $location.path('/cut/details/' + cutId);
            };

            ctrl.confirmCut = function (cut) {
                CutFactory.confirmCut(cut._id)
                    .then(function (resp) {
                        console.log(resp);
                        cut.accepted = true;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        },
        controllerAs: 'cutTableCtrl',
    };
}

angular
    .module('store')
    .directive('cutTable', cutTable);