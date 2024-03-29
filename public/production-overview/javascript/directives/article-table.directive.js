function articleTable(ProcessingFactory, CustomerFactory) {
    return {
        restrict: 'E',
        templateUrl: 'public/production-overview/templates/article-table.html',
        scope: {},
        bindToController: {
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
            };

            ctrl.articleStockModalContent = {
                url: 'public/inbound/templates/inbound-expected-selection.html',
                modalTitle: 'Article Stock',
                modalId: 'articlestock',
                modalClass: 'modal modal-xl fade',
                stocks: [],
            };

            ctrl.articleProcessingModalContent = {
                modalTitle: 'Lista lavorazioni articolo',
                modalId: 'articleprocessing',
                modalClass: 'modal modal-xl fade',
                processingList: [],
            };

            ctrl.getArticleCustomer = function (clienteCod) {
                CustomerFactory.getCustomer(clienteCod)
                    .then(function (resp) {
                        console.log(resp);
                        ctrl.articleCustomerModalContent.customer = resp.data.data.customer;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            };

            ctrl.getArticleProcessing = function (articleId) {
                ProcessingFactory.getArticleProcessing(articleId)
                    .then(function (resp) {
                        console.log(resp);
                        if (resp.data.data) {
                            ctrl.articleProcessingModalContent.processingList = resp.data.data.processes;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            };
        },
        controllerAs: 'articleTableCtrl',
    };
}

angular
    .module('store')
    .directive('articleTable', ['ProcessingFactory', 'CustomerFactory', articleTable])