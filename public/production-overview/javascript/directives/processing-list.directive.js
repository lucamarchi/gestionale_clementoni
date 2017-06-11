function processingList() {
    return {
        restrict: 'E',
        templateUrl: 'public/production-overview/templates/processing-list.html',
        scope: {},
        bindToController: {
            processingList: "="
        },
        controller: function ($scope) {
            var ctrl = this;

            $scope.$watchCollection(
                function () {
                    return ctrl.processingList;
                },
                function (newVal) {
                    console.log(ctrl.processingList)
                    if (newVal) {
                        console.log(newVal)
                    }
                }
            );


            /*ctrl.processingList = [
             {
             operatore: "mauro",
             macchinario: "A",
             data: "12-05-2014",
             scarto: 50,
             products1: [
             {
             "_id": "ObjectId(\"57fe403e3a3b15cd017731f6\")",
             "stato": "sospeso",
             "superficie": "br",
             "stabilimento": 1,
             "prezzo": 504,
             "larghezza": 1500,
             "spessore": 2,
             "pesoNetto": 10000,
             "finitura": "z140",
             "scelta": "a",
             "qualita": "dx51d",
             "materiale": "zincato",
             "tipo": "coil",
             "anno": "2016",
             "matricola": "2000",
             "lavorazione": 1,
             "scarto": 0,
             "__v": 0,
             "stockId": "ObjectId(\"57fe403e3a3b15cd017731f5\")",
             "numeroCollo": "160001"
             },
             {
             "_id": "ObjectId(\"57fe403e3a3b15cd017731f6\")",
             "stato": "sospeso",
             "superficie": "br",
             "stabilimento": 1,
             "prezzo": 504,
             "larghezza": 1500,
             "spessore": 2,
             "pesoNetto": 10000,
             "finitura": "z140",
             "scelta": "a",
             "qualita": "dx51d",
             "materiale": "zincato",
             "tipo": "coil",
             "anno": "2016",
             "matricola": "2000",
             "lavorazione": 1,
             "scarto": 0,
             "__v": 0,
             "stockId": "ObjectId(\"57fe403e3a3b15cd017731f5\")",
             "numeroCollo": "160001"
             }
             ],
             products2: [
             {
             "_id": "ObjectId(\"57fe403e3a3b15cd017731f6\")",
             "stato": "sospeso",
             "superficie": "br",
             "stabilimento": 1,
             "prezzo": 504,
             "larghezza": 1500,
             "spessore": 2,
             "pesoNetto": 10000,
             "finitura": "z140",
             "scelta": "a",
             "qualita": "dx51d",
             "materiale": "zincato",
             "tipo": "coil",
             "anno": "2016",
             "matricola": "2000",
             "lavorazione": 1,
             "scarto": 0,
             "__v": 0,
             "stockId": "ObjectId(\"57fe403e3a3b15cd017731f5\")",
             "numeroCollo": "160001"
             }
             ]
             },
             {
             operatore: "pippo",
             macchinario: "A",
             data: "12-05-2015",
             scarto: 50
             },
             {
             operatore: "pluto",
             macchinario: "A",
             data: "12-05-2016",
             scarto: 50
             }
             ];*/
        },
        controllerAs: 'processingListCtrl',
    }
}

angular
    .module('store')
    .directive('processingList', processingList)