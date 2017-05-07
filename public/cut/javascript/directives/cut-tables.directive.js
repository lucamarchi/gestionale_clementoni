function cutTable () {
	return {
		restrict: 'E',
		templateUrl:'public/cut/templates/cut-table.html',
		scope: {},
        bindToController: {
			cutList: "=",
            currentPage:"=",
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
            }
            
            ctrl.cutConfirmationModalContent = {
                modalTitle: 'Conferma dell\'ordine di taglio',
                modalId: 'cutconfirmation',
                modalClass: 'modal fade',
                modalBody: 'Confermare l\'ordine con i relativi articoli scaricati dal portale agenti?',
                cut: {}
            }
            
            ctrl.selectCut = function (cut) {
                console.log(cut);
                ctrl.cutDeletionModalContent.cut = cut;
                ctrl.cutConfirmationModalContent.cut = cut;
            }
            
            ctrl.deleteCut = function (cut) {
                console.log(cut);
                ctrl.cutList.splice(ctrl.cutList.indexOf(cut),1);
            }
            
            ctrl.showCutDetails = function (cutId) {
                $location.path('/cut/details/'+cutId);    
            }
            
            ctrl.confirmCut = function (cut) {
                CutFactory.confirmCut(cut._id)
                    .then(function(resp) {
                        console.log(resp);
                        cut.accepted = true;
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
	       }
        },
        controllerAs: 'cutTableCtrl',
    };
};

function cutArticleTable () {
	return {
		restrict: 'E',
		templateUrl:'public/cut/templates/cut-article-table.html',
		scope: {},
        bindToController: {
			articleList: "=",
        },
        controller: function ($scope) {
            var ctrl = this;
            
            ctrl.dimensionSelectionModalContent = {
                modalTitle: 'Inserimento larghezza e/o lunghezza Giacenza Virtuale',
                modalId: 'dimensionselected',
                modalClass: 'modal fade',
                article: {},
                index: null,
            }
            
            ctrl.cutArticleDeletionModalContent = {
                modalTitle: 'Cancellazion dell\'articolo dell\'ordine di taglio',
                modalId: 'cutarticledeletion',
                modalClass: 'modal fade',
                modalBody: 'L\'articolo verrà cancellato dall\'ordine di taglio e da ogni parte del sistema',
                index: null,
            }
            
            ctrl.selectArticle = function (article, index) {
                var articleCopy = Object.assign({},article);
                ctrl.dimensionSelectionModalContent.article = articleCopy;
                ctrl.dimensionSelectionModalContent.index = index;
                ctrl.cutArticleDeletionModalContent.index = index;
                console.log(article, index);
            }
            
            ctrl.assignDimension = function (article, index) {
                //chiamata all'API
                ctrl.articleList[index] = article;
                console.log(ctrl.articleList);
            }
            
            ctrl.deleteCutArticle = function (article, index) {
                ctrl.articleList.splice(index,1);
                console.log(ctrl.articleList);
            }
        },
        controllerAs: 'cutArticleTableCtrl',
    };
};

function customerTable () {
	return {
		restrict: 'E',
		templateUrl:'public/cut/templates/customer-table.html',
		scope: {},
        bindToController: {
            customer: "="
        },
        controller: function ($scope) {
        },
        controllerAs: 'customerTableCtrl',
    };
};


angular
    .module('store')
    .directive('cutTable', cutTable)
    .directive('cutArticleTable', cutArticleTable)
    .directive('customerTable', customerTable)
    