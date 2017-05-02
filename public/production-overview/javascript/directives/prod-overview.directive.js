function articleTable (ProdOverviewFactory) {
	return {
		restrict: 'E',
		templateUrl:'public/production-overview/templates/articles-table.html',
		scope: {},
        bindToController: {
			articleList: "=",
            currentPage: "=",
            entryLimit: "="
        },
        transclude: {
                'pagination': '?tablePagination',
                'filters': '?filters',
                'buttonAction': '?buttonAction'
        },
        controller: function ($scope) {
            var ctrl = this;
            
            ctrl.articleCustomerModalContent = {
                modalTitle: 'INFORMAZION CLIENTE',
                modalId: 'articlecustomer',
                modalClass: 'modal modal-xl fade',
                customer: {},
            }
            
            ctrl.articleStockModalContent = {
                url:'public/inbound/templates/inbound-expected-selection.html',
                modalTitle: 'Article Stock',
                modalId: 'articlestock',
                stocks: [],
            }
            
            ctrl.articleProcessingModalContent = {
                url:'public/inbound/templates/inbound-expected-selection.html',
                modalTitle: 'Article Processing',
                modalId: 'articleprocessing',
                processing: [],
            }
            
            ctrl.getArticleCustomer = function (clienteCod) {
                ProdOverviewFactory.getCustomer(clienteCod)
                    .then (function (resp) {
                        console.log(resp);
                        ctrl.articleCustomerModalContent.customer = resp.data.customer;
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
            
            ctrl.getArticleStock = function(articleId) {
                ProdOverviewFactory.getStock(articleId)
                    .then (function (resp) {
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
            
            ctrl.getArticleProcessing = function (articleId) {
                ProdOverviewFactory.getProcessing(articleId)
                    .then (function (resp) {
                        console.log(resp);
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
        },
        controllerAs: 'articleTableCtrl',
    };
};


angular
    .module('store')
    .directive('articleTable',['ProdOverviewFactory', articleTable])