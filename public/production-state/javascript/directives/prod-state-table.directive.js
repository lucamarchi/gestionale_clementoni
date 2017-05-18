/**
 * Created by francescodicara on 19/05/17.
 */

function prodStateTable (ProdStateFactory) {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/prod-state-table.html',
        scope: {},
        bindToController: {
            prodStates: "=",
            currentPage: "=",
            entryLimit: "="
        },
        controller: function () {
            var ctrl = this;

            ctrl.prodStateModalContent = {
                url:'public/production-state/templates/prod-state-articles.html',
                modalTitle: '',
                modalId: 'prodstatearticles',
                prodStateArticles: [],
                currentPage: 1,
                entryLimit: 20
            }

            ctrl.getProdState = function (id) {
                ProdStateFactory.getProdState(id)
                    .then (function (resp) {
                        console.log("ARTICOLI STATO PRODUZIONE" , resp);
                        ctrl.prodStateModalContent.prodStateArticles = resp.data.articoli;
                        ctrl.prodStateModalContent.modalTitle = 'Articoli dello stato produzione '+resp.data.prod.numero;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }

            ctrl.deleteProdStateArticle = function (article) {
//                ArticleFactory.deleteProdStateArticle(article._id)
//                .then (function (resp) {
//                    console.log("ARTICLE ELIMINATO", resp);
//                    ctrl.prodStates.splice(ctrl.inboundList.indexOf(article),1);
//                })
//                .catch(function(err) {
//                    console.log(err);
//                });
                console.log(article);
            }
        },

        controllerAs: 'prodStateTableCtrl',
    }
};

angular
    .module('store')
    .directive('prodStateTable',['ProdStateFactory', prodStateTable]);