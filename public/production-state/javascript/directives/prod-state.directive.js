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

function machineryTable () {
	return {
		restrict: 'E',
		templateUrl:'public/production-state/templates/machinery-table.html',
		scope: {},
        bindToController: {
			machineryList: "=",
        },
        transclude: {
          buttonAction: '?buttonAction'  
        },
        controller: function () {
        },
        controllerAs: 'machineryTableCtrl',
    }
}

function prodStateEdit (ArticleFactory) {
    return {
        restrict: 'E',
        templateUrl:'public/production-state/templates/prod-state-edit.html',
        scope: {},
        bindToController: {
            selectedArticles: "=",
        },
        transclude: {
            'confirmButton': '?confirmButton'
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.addedArticles = [];
            ctrl.removedArticles = [];
            ctrl.freeArticles = [];
            
            $scope.$watchCollection(
                function () {
                    return ctrl.selectedArticles;
                }, 
                function (newVal) {
                      
                    if (newVal) {
                        ctrl.selectedArticles = newVal;
                        console.log(newVal)
                    }
                }
            );
            
            ctrl.getUnassignedToStateProdArticles = function () {
                ArticleFactory.getUnassignedToStateProdArticles()
                    .then (function (resp) {
                        console.log(resp);
                        ctrl.freeArticles = resp.data.articles;
                        ctrl.entryLimit = 10;
                        ctrl.currentPage = 1;
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            };
            
            ctrl.getUnassignedToStateProdArticles();
    
            ctrl.addSelectedArticle = function (article) {
                ctrl.selectedArticles.push(article);
                index = ctrl.freeArticles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione == "libero") {
                    ctrl.addedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.removedArticles.indexOf(article);
                    if (articlePos != -1){
                        ctrl.removedArticles.splice(articlePos,1);
                    }
                }
                ctrl.freeArticles.splice(index,1);
            };

            ctrl.removeSelectedArticle = function (article){
                ctrl.freeArticles.push(article);
                index = ctrl.selectedArticles.indexOf(article);
                console.log(article, index);
                if (article.statoProduzione != "libero") {
                    ctrl.removedArticles.push(article);
                }
                else {
                    var articlePos = ctrl.addedArticles.indexOf(article);
                    if (articlePos != -1){
                        ctrl.addedArticles.splice(articlePos,1);
                    }
                }
                ctrl.selectedArticles.splice(index,1);
            };
        },
        controllerAs: 'prodStateEditCtrl',
    }
}


angular
    .module('store')
    .directive('prodStateTable',['ProdStateFactory', prodStateTable])
    .directive('machineryTable', machineryTable)
    .directive('prodStateEdit', ['ArticleFactory', prodStateEdit])
