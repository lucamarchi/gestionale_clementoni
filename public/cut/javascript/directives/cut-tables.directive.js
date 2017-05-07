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
		templateUrl:'public/cut/templates/cut-articles-table.html',
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
            
            ctrl.selectArticle = function (article, index) {
                var articleCopy = Object.assign({},article);
                ctrl.dimensionSelectionModalContent.article = articleCopy;
                ctrl.dimensionSelectionModalContent.index = index;
                console.log(article, index);
            }
            
            ctrl.assignDimension = function (article, index) {
                //chiamata all'API
                ctrl.articleList[index] = article;
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
    