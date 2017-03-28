angular
    .module('store')

    .directive('inputFilter', function () {
        return {
            restrict: 'E',
            template: [
                    '<div>',
                        '<span class="glyphicon glyphicon-filter" aria-hidden="true"></span>',
                        '<b>{{labelName|uppercase}}</b>',
                    '</div>',
                    '<input type="{{type}}" ng-model="model">',
            ].join(''),
            scope: { 
                labelName: "@",
                type: "@",
                model: "=",
            }
        }
    })

    .directive('selectFilter', function () {
        return {
            restrict: 'E',
            template: [
                    '<div>',
                        '<span class="glyphicon glyphicon-filter" aria-hidden="true"></span>',
                        '<b>{{labelName|uppercase}}</b>',
                    '</div>',
                    '<select ng-model="model" ng-options="option for option in options">',
                    '<option value=""></option>',
                    '</select>',
            ].join(''),
            scope: { 
                labelName: "@",
                model: "=",
                options: "=",
            },
        }
    })

    .directive('selectMaterialeSwitchFilter', function () {
        return {
            restrict: 'E',
            template: [ 
                '<span ng-repeat="(key,value) in options[attributeO]">',
                    '<span ng-if="model.materiale == key">',
                        '<select-filter label-name="{{labelName}}" model="model[attributeM]" options="value">',
                        '</select-filter>',
                    '</span>',
                '</span>',
                '<span ng-if="!(options[attributeO].hasOwnProperty(model.materiale))">',
                    '<select disabled ng-model="model[attributeM]" class="filter-control">',
                    '</select disabled>',
                '</span>',
            ].join(''),
            scope: { 
                labelName: "@",
                model: "=",
                attributeM: "@",
                attributeO:"@"
            },
            controller: function ($scope, features) {
                $scope.$watch('model.materiale',
                    function(newVal, oldVal) {
                        if (newVal) {
                            console.log(newVal, oldVal); 
                            delete $scope.model[$scope.attributeM];
                        }
                    }
                );
                $scope.options = features;
            }
        }
    })

    .component('selectMaterialeFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",
        },
        controller: function ($scope, features) {
            this.options = features.materiali;
        }
    })
    
    .component('selectTipoFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.tipi;

        }
    })

    .component('selectSpessoreFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.spessoriNominali;

        }
    })

    .component('selectLarghezzaFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.larghezzeNominali;

        }
    })

    .component('selectSceltaFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.scelte;

        }
    })


    .component('selectLunghezzaFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.lunghezze;

        }
    })

    .component('selectFornitoreFilter', {
        restrict: 'E',
        template: [ 
            '<select-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options">',
            '</select-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
        controller: function ($scope, features) {
            this.options = features.fornitori;
        }
    })

    .component('selectFinituraFilter', {
        restrict: 'E',
        template: [ 
            '<select-materiale-switch-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="finiture">',
            '</select-materiale-switch-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",
        },
    })

    .component('selectQualitaFilter', {
        restrict: 'E',
        template: [ 
            '<select-materiale-switch-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="qualita">',
            '</select-materiale-switch-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",
        },
    })

    .component('selectSuperficieFilter', {
        restrict: 'E',
        template: [ 
            '<select-materiale-switch-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="superfici">',
            '</select-materiale-switch-filter>'
        ].join(''),
        bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",
        }
    })

    .component('selectColoreFilter', {
        restrict: 'E',
        template: [
            '<select-materiale-switch-filter label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="colori">',
            '</select-materiale-switch-filter>'
        ].join(''),
         bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",
        },
    })


    .component('inputNumFilter', {
        restrict: 'E',
        template: [
                '<input-filter label-name="{{$ctrl.labelName}}" type="number" model="$ctrl.model[$ctrl.attributeM]">',
                '</input-filter>',
        ].join(''),
         bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
    })


    .component('inputDateFilter', {
        restrict: 'E',
        template: [
            '<input-filter label-name="{{$ctrl.labelName}}" type="date" model="$ctrl.model[$ctrl.attributeM]">',
            '</input-filter>',
        ].join(''),
         bindings: { 
            labelName: '@',
            model: "=",
            attributeM: '@',

        },
    })

    .component('inputTextFilter', {
        restrict: 'E',
        template: [
            '<input-filter label-name="{{$ctrl.labelName}}" type="text" model="$ctrl.model[$ctrl.attributeM]">',
            '</input-filter>',
        ].join(''),
         bindings: { 
            labelName: "@",
            model: "=",
            attributeM: "@",

        },
    })

    
