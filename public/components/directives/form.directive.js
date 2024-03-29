angular
    .module('store')

    .directive('inputForm', function () {
        return {
            restrict: 'E',
            template: [
                '<label>',
                '{{labelName}}',
                '</label>',
                '<input type="{{type}}" class="form-control" ng-model="model" ng-required="required">',
            ].join(''),
            scope: {
                labelName: "@",
                type: "@",
                model: "=",
                required: "="
            }
        }
    })

    .directive('selectForm', function () {
        return {
            restrict: 'E',
            template: [
                '<label>',
                '{{labelName}}',
                '</label>',
                '<select ng-model="model" ng-options="option for option in options" class="form-control" ng-required="required">',
                '</select>',
            ].join(''),
            scope: {
                labelName: "@",
                model: "=",
                options: "=",
                required: "="

            },
        }
    })

    .directive('selectMaterialeSwitchForm', function () {
        return {
            restrict: 'E',
            template: [
                '<span ng-repeat="(key,value) in options[attributeO]">',
                '<span ng-if="model.materiale == key">',
                '<select-form label-name="{{labelName}}" model="model[attributeM]" options="value" required = "required">',
                '</select-form>',
                '</span>',
                '</span>',
                '<span ng-if="!(options[attributeO].hasOwnProperty(model.materiale))">',
                '<label>',
                '{{labelName}}',
                '</label>',
                '<select disabled ng-model="model[attributeM]" class="form-control" ng-required=false>',
                '</select>',
                '</span>',
            ].join(''),
            scope: {
                labelName: "@",
                model: "=",
                attributeM: "@",
                attributeO: "@",
                required: "=",
            },
            controller: function ($scope, features) {
                $scope.$watch('model.materiale',
                    function (newVal, oldVal) {
                        if (newVal && newVal != oldVal && oldVal != undefined) {
                            delete $scope.model[$scope.attributeM];
                        }
                    }
                );
                $scope.options = features;
            }
        }
    })

    .component('selectMaterialeForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.materiali;
        }
    })

    .component('selectTipoForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.tipi;

        }
    })

    .component('selectSpessoreForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.spessoriNominali;

        }
    })

    .component('selectLarghezzaForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.larghezzeNominali;

        }
    })

    .component('selectSceltaForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.scelte;

        }
    })


    .directive('selectLunghezzaForm', function () {
        return {
            restrict: 'E',
            template: [
                '<label>',
                '{{selectLunghFormCtrl.labelName}}',
                '</label>',
                '<select class="form-control" ng-disabled = "selectLunghFormCtrl.isDisabled" ng-model="selectLunghFormCtrl.model[selectLunghFormCtrl.attributeM]" ng-options="option for option in selectLunghFormCtrl.options" ng-required="selectLunghFormCtrl.isRequired">',
                '</select>',
            ].join(''),
            bindToController: {
                labelName: "@",
                model: "=",
                attributeM: "@",
                required: "="
            },
            controller: function ($scope, features) {
                var ctrl = this;
                ctrl.options = features.lunghezze;

                ctrl.disable = function () {
                    ctrl.isDisabled = ctrl.model.tipo == undefined || ctrl.model.tipo == "nastro" || ctrl.model.tipo == "coil";
                    if (ctrl.isDisabled) {
                        delete ctrl.model[ctrl.attributeM];
                    }
                    ctrl.isRequired = !ctrl.isDisabled && ctrl.required;
                    console.log(ctrl.isDisabled, ctrl.isRequired);
                };

                $scope.$watch(
                    function () {
                        return ctrl.model.tipo;
                    },
                    function (newVal, oldVal) {
                        console.log("aaa")
                        if (newVal || (oldVal == undefined && newVal == undefined)) {
                            console.log("bb")
                            ctrl.disable();
                        }
                    })

            },
            controllerAs: 'selectLunghFormCtrl'
        }
    })

    .component('selectFornitoreForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.fornitori;
        }
    })

    .component('selectTrasportatoreForm', {
        restrict: 'E',
        template: [
            '<select-form label-name="{{$ctrl.labelName}}" model="$ctrl.model[$ctrl.attributeM]" options="$ctrl.options" required="$ctrl.required">',
            '</select-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, features) {
            this.options = features.trasportatori;
        }
    })

    .component('selectFinituraForm', {
        restrict: 'E',
        template: [
            '<select-materiale-switch-form label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="finiture" required="$ctrl.required">',
            '</select-materiale-switch-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
    })

    .component('selectQualitaForm', {
        restrict: 'E',
        template: [
            '<select-materiale-switch-form label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="qualita" required="$ctrl.required">',
            '</select-materiale-switch-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
    })

    .component('selectSuperficieForm', {
        restrict: 'E',
        template: [
            '<select-materiale-switch-form label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="superfici" required="$ctrl.required">',
            '</select-materiale-switch-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        }
    })

    .component('selectColoreForm', {
        restrict: 'E',
        template: [
            '<select-materiale-switch-form label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" attribute-o="colori" required="$ctrl.required">',
            '</select-materiale-switch-form>'
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
    })

    .component('inputPrezzoForm', {
        restrict: 'E',
        template: [
            '<span ng-if="userRole == \'logistica\' || userRole == \'admin\'">',
            '<input-num-form label-name="{{$ctrl.labelName}}" model="$ctrl.model" attribute-m="{{$ctrl.attributeM}}" required="$ctrl.required">',
            '</input-num-form>',
            '</span>',
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
        controller: function ($scope, $rootScope) {
            $scope.$watch(
                function () {
                    return $rootScope.user;
                },
                function (newVal, oldVal) {
                    if (newVal) {
                        $scope.userRole = newVal.role;
                    }
                }
            );
        }
    })


    .component('inputNumForm', {
        restrict: 'E',
        template: [
            '<input-form label-name="{{$ctrl.labelName}}" type="number" model="$ctrl.model[$ctrl.attributeM]" required="$ctrl.required">',
            '</input-form>',
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
    })

    .component('inputDateForm', {
        restrict: 'E',
        template: [
            '<input-form label-name="{{$ctrl.labelName}}" type="date" model="$ctrl.model[$ctrl.attributeM]" required="$ctrl.required">',
            '</input-form>',
        ].join(''),
        bindings: {
            labelName: '@',
            model: "=",
            attributeM: '@',
            required: "="
        },
    })

    .component('inputTextForm', {
        restrict: 'E',
        template: [
            '<input-form label-name="{{$ctrl.labelName}}" type="text" model="$ctrl.model[$ctrl.attributeM]" required="$ctrl.required">',
            '</input-form>',
        ].join(''),
        bindings: {
            labelName: "@",
            model: "=",
            attributeM: "@",
            required: "="
        },
    })

    
