angular
    .module('store')

    .directive('customDate', function () {
        return {
            restrict: 'A',
            template: [
                '{{model[attribute]| date:\'EEE, dd/MM/yy\'}}'
            ].join(''),
            scope: {
                model: "=",
                attribute: "@"
            }
        }
    })


    .directive('productionState', function () {
        return {
            restrict: 'EA',
            bindToController: {
                model: "=",
                attribute: "@"
            },
            template: [
                '<span ng-switch="prodStateCtrl.model[prodStateCtrl.attribute]" style="text-align: center;">',
                '<span ng-switch-when="libero" class="label label-default">{{prodStateCtrl.model[prodStateCtrl.attribute]}}</span>',
                '<span ng-switch-when="assegnato" class="label label-info">{{prodStateCtrl.model[prodStateCtrl.attribute]}}</span>',
                '<span ng-switch-when="lavorazione" class="label label-warning">{{prodStateCtrl.model[prodStateCtrl.attribute]}}</span>',
                '<span ng-switch-when="completato" class="label label-success">{{prodStateCtrl.model[prodStateCtrl.attribute]}}</span>',
                '</span>',
            ].join(''),
            controller: function () {
            },
            controllerAs: 'prodStateCtrl',
            scope: {}
        }
    })

    .directive('evasionState', function () {
        return {
            restrict: 'A',
            bindToController: {
                model: "=",
                attribute: "@"
            },
            template: [
                '<span ng-switch="evasionStateCtrl.model[evasionStateCtrl.attribute]" style="text-align: center;">',
                '<span ng-switch-when="libero" class="label label-default">{{evasionStateCtrl.model[evasionStateCtrl.attribute]}}</span>',
                '<span ng-switch-when="assegnato" class="label label-info">{{evasionStateCtrl.model[evasionStateCtrl.attribute]}}</span>',
                '<span ng-switch-when="evaso" class="label label-success">{{evasionStateCtrl.model[evasionStateCtrl.attribute]}}</span>',
                '</span>'
            ].join(''),
            controller: function () {
            },
            controllerAs: 'evasionStateCtrl',
            scope: {}
        }
    });

