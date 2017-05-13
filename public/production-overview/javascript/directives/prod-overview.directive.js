function articleTable (ProcessingFactory, CustomerFactory, ProductFactory) {
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
                modalClass: 'modal modal-xl fade',
                stocks: [],
            }
            
            ctrl.articleProcessingModalContent = {
                modalTitle: 'Lista lavorazioni articolo',
                modalId: 'articleprocessing',
                modalClass: 'modal modal-xl fade',
                processing: [],
            }
            
            ctrl.getArticleCustomer = function (clienteCod) {
                CustomerFactory.getCustomer(clienteCod)
                    .then (function (resp) {
                        console.log(resp);
                        ctrl.articleCustomerModalContent.customer = resp.data.customer;
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            }
            
//            ctrl.getArticleStock = function(articleId) {
//                ProductFactory.getStock(articleId)
//                    .then (function (resp) {
//                        console.log(resp);
//                    })
//                    .catch(function(err) {
//                        console.log(err);
//                    })
//            }
            
            ctrl.getArticleProcessing = function (articleId) {
                ProcessingFactory.getProcessing(articleId)
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


function processingList () {
	return {
		restrict: 'E',
		templateUrl:'public/production-overview/templates/processing-list.html',
		scope: {},
        bindToController: {
        },
        controller: function ($scope) {
            var ctrl = this;
            
//            $scope.$watchCollection(
//                function () {
//                    return ctrl.processingList;
//                }, 
//                function (newVal) {
//                    if (newVal) {
//                        console.log(newVal)
                        ctrl.processingList = [
                            {operatore: "mauro",
                            macchinario: "A",
                            data:"12-05-2014",
                            scarto: 50,
                            products1: 
                                [
                                    {
                                        "_id" : "ObjectId(\"57fe403e3a3b15cd017731f6\")",
                                        "stato" : "sospeso",
                                        "superficie" : "br",
                                        "stabilimento" : 1,
                                        "prezzo" : 504,
                                        "larghezza" : 1500,
                                        "spessore" : 2,
                                        "pesoNetto" : 10000,
                                        "finitura" : "z140",
                                        "scelta" : "a",
                                        "qualita" : "dx51d",
                                        "materiale" : "zincato",
                                        "tipo" : "coil",
                                        "anno" : "2016",
                                        "matricola" : "2000",
                                        "lavorazione" : 1,
                                        "scarto" : 0,
                                        "__v" : 0,
                                        "stockId" : "ObjectId(\"57fe403e3a3b15cd017731f5\")",
                                        "numeroCollo" : "160001"
                                    },
                                    {
                                        "_id" : "ObjectId(\"57fe403e3a3b15cd017731f6\")",
                                        "stato" : "sospeso",
                                        "superficie" : "br",
                                        "stabilimento" : 1,
                                        "prezzo" : 504,
                                        "larghezza" : 1500,
                                        "spessore" : 2,
                                        "pesoNetto" : 10000,
                                        "finitura" : "z140",
                                        "scelta" : "a",
                                        "qualita" : "dx51d",
                                        "materiale" : "zincato",
                                        "tipo" : "coil",
                                        "anno" : "2016",
                                        "matricola" : "2000",
                                        "lavorazione" : 1,
                                        "scarto" : 0,
                                        "__v" : 0,
                                        "stockId" : "ObjectId(\"57fe403e3a3b15cd017731f5\")",
                                        "numeroCollo" : "160001"
                                    }
                                ],
                             products2: 
                                [
                                    {
                                        "_id" : "ObjectId(\"57fe403e3a3b15cd017731f6\")",
                                        "stato" : "sospeso",
                                        "superficie" : "br",
                                        "stabilimento" : 1,
                                        "prezzo" : 504,
                                        "larghezza" : 1500,
                                        "spessore" : 2,
                                        "pesoNetto" : 10000,
                                        "finitura" : "z140",
                                        "scelta" : "a",
                                        "qualita" : "dx51d",
                                        "materiale" : "zincato",
                                        "tipo" : "coil",
                                        "anno" : "2016",
                                        "matricola" : "2000",
                                        "lavorazione" : 1,
                                        "scarto" : 0,
                                        "__v" : 0,
                                        "stockId" : "ObjectId(\"57fe403e3a3b15cd017731f5\")",
                                        "numeroCollo" : "160001"
                                    }
                                ]
                            },
                            {operatore: "pippo",
                            macchinario: "A",
                            data:"12-05-2015",
                            scarto: 50},
                            {operatore: "pluto",
                            macchinario: "A",
                            data:"12-05-2016",
                            scarto: 50}
                        ];
//                    }
//                }
//            );  
        },
        controllerAs: 'processingListCtrl',
    }
}


angular
    .module('store')
    .directive('articleTable',['ProcessingFactory', 'CustomerFactory', 'ProductFactory', articleTable])
    .directive('processingList', processingList)