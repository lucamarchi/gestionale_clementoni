function outboundTable (OutboundFactory, $location) {
	return {
		restrict: 'E',
		templateUrl:'public/outbound/templates/outbound-table.html',
		scope: {},
        bindToController: {
			outbounds: "=",
            currentPage: "=",
            entryLimit: "="
        },
        controller: function () {
            var ctrl = this;
            
            ctrl.showOutboundDetails = function (outboundId) {
                $location.path('/outbound/details/'+outboundId);    
            }
        },

        controllerAs: 'outboundTableCtrl',
    }
};

function outboundArticleTable (OutboundFactory, features) {
	return {
		restrict: 'E',
		templateUrl:'public/outbound/templates/outbound-article-table.html',
		scope: {},
        bindToController: {
			articleList: "=",
        },
        transclude: {
            tableFilters : "?tableFilters",
            weightColumn : "?weightColumn",
            quantityColumn : "?quantityColumn",
            unitColumn : "?unitColumn",
            actionButton : "?actionButton"
            
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.features = features;
            ctrl.regionArray = [];
            ctrl.provinceArray = [];
            ctrl.regionArrayFilter = [];
            ctrl.provinceArrayFilter = [];
            
            $scope.$watchCollection (
                function () {
                    return ctrl.articleList;
                }, 
                function (newVal) {
                    if (newVal) {
                        ctrl.regionArray = findDistinctRegion(newVal);
                        ctrl.provinceArray = findDistinctProvince(newVal);
                        console.log ("111 ", ctrl.regionArray, "222 ", ctrl.provinceArray);
                        ctrl.articleMap = ctrl.createArticleMap(newVal);
                    }
                }
            );
            
            ctrl.includeVal = function(val, array) {
                var i = array.indexOf(val);
                if (i > -1) {
                    array.splice(i, 1);
                } 
                else {
                    array.push(val);
                }
                console.log(array);
            } 
            
            ctrl.createArticleMap = function (articles) {
                var monster = [];
                i=0;
                for (rg of ctrl.regionArray){
                    temp = articles.filter(function(el){
                        return (el.region == rg);
                    });
                    if(temp.length != 0){
                        monster.push({region: rg, lung: 0, weight: 0, value: []}); //i per accedere
                        j=0;
                        for (pr of ctrl.provinceArray){
                            temp = articles.filter(function(el){
                                return (el.region == rg) && (el.provincia == pr);
                            });
                            if(temp.length != 0){
                                monster[i].value.push({province: pr, lung: 0, weight: 0, value: temp}); //j per accedere
                                for (t of temp) {
                                    monster[i].value[j].weight = monster[i].value[j].weight + t.peso;
                                    monster[i].weight = monster[i].weight + t.peso; 
                                }
                                j++;
                            }
                        }
                        i++;
                    }
                }
                console.log("monster ", monster);
                return monster;
            }
            
            ctrl.addArticle = function (article) {
                $scope.$emit('addArticle', article);    
            }
            
        },

        controllerAs: 'outboundArticleTableCtrl',
    }
};

function outboundEdit (OutboundFactory, ProdStateFactory, features) {
	return {
		restrict: 'E',
		templateUrl:'public/outbound/templates/outbound-edit.html',
		scope: {},
        bindToController: {
			outbound: "=",
        },
        controller: function ($scope) {
            var ctrl = this;
            ctrl.currentPage = 1;
        
            $scope.$watchCollection(
                function () {
                    return ctrl.outbound;
                }, 
                function (newVal) {
                      
                    if (newVal) {
                        ctrl.outbound.order = newVal.order;
                        ctrl.outbound.articles = newVal.articles;  
                        console.log("aaaaaaaaaaaaaa", newVal)
                    }
                }
            );
            
            ctrl.getFreeArticles = function () {
                ProdStateFactory.getFreeArticles()
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

            ctrl.getFreeArticles();
            
            ctrl.addSelectedArticle = function (article) {
                ctrl.outbound.articles.push(article);
                index = ctrl.freeArticles.indexOf(article);
                console.log(article, index);
                ctrl.freeArticles.splice(index,1);
            };
            
            ctrl.removeSelectedArticle = function (article){
                ctrl.freeArticles.push(article);
                index = ctrl.outbound.articles.indexOf(article);
                console.log(article, index);
                ctrl.outbound.articles.splice(index,1);
            };
            
            $scope.$on('addArticle', function(event, data) { 
                ctrl.addSelectedArticle (data); 
            });
            
            $scope.$on('removeArticle', function(event, data) { 
                ctrl.removeSelectedArticle (data); 
            });
            
        },

        controllerAs: 'outboundEditCtrl',
    }
};

function outboundForm () {
	return {
		restrict: 'E',
		templateUrl:'public/outbound/templates/outbound-form.html',
		scope: {},
        bindToController: {
			outboundOrder:"=",
        },
        
        controller: function ($scope) {
            var ctrl = this; 
            $scope.$watchCollection(
                function () {
                    return ctrl.outboundForm;
                }, 
                function (newVal) {
                    if (newVal) {
                        $scope.$emit('orderFormValid', ctrl.outboundForm);
                    }
                }
            );   
        },
        
        
        controllerAs: 'inOrderFormCtrl',
    };
};

angular
    .module('store')
    .directive('outboundTable',['OutboundFactory', '$location', outboundTable])
    .directive('outboundArticleTable',['OutboundFactory', 'features', outboundArticleTable])
    .directive('outboundEdit',['OutboundFactory','ProdStateFactory', 'features', outboundEdit])
    .directive('outboundForm', outboundForm)
