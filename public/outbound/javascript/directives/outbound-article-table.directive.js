/**
 * Created by nexse on 22/05/2017.
 */

function outboundArticleTable (OutboundFactory, features) {
    return {
        restrict: 'E',
        templateUrl:'public/outbound/templates/outbound-article-table.html',
        scope: {},
        bindToController: {
            articleList: "=",
            attribute: "@"
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
//                        console.log ("111 ", ctrl.regionArray, "222 ", ctrl.provinceArray);
                        ctrl.articleMap = ctrl.createArticleMap(newVal, ctrl.attribute);
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

            ctrl.createArticleMap = function (articles, attribute) {
                var monster = [];
                i=0;
                for (rg of ctrl.regionArray){
                    temp = articles.filter(function(el){
                        return (el.region == rg);
                    });
                    if(temp.length != 0){
                        monster.push({region: rg, weight: 0, value: []}); //i per accedere
                        j=0;
                        for (pr of ctrl.provinceArray){
                            temp = articles.filter(function(el){
                                return (el.region == rg) && (el.provincia == pr);
                            });
                            if(temp.length != 0){
                                monster[i].value.push({province: pr, weight: 0, value: temp}); //j per accedere
                                for (t of temp) {
                                    monster[i].value[j].weight += t[attribute];
                                    monster[i].weight += t[attribute];
                                }
                                j++;
                            }
                        }
                        i++;
                    }
                }
                return monster;
            };

            function findDistinctRegion (data) {
                var regionArray = [];
                for(i = 0; i< data.length; i++){
                    if(regionArray.indexOf(data[i].region) === -1){
                        regionArray.push(data[i].region);
                    }
                }
                return regionArray;
            }

            function findDistinctProvince (data) {
                var provinciaArray = [];
                for(i = 0; i< data.length; i++){
                    if(provinciaArray.indexOf(data[i].provincia) === -1){
                        provinciaArray.push(data[i].provincia);
                    }
                }
                return provinciaArray;
            }

            ctrl.addArticle = function (article) {
                console.log(article)
                $scope.$emit('addArticle', article);
            }

        },

        controllerAs: 'outboundArticleTableCtrl',
    }
}

angular
    .module('store')
    .directive('outboundArticleTable',['OutboundFactory', 'features', outboundArticleTable]);

