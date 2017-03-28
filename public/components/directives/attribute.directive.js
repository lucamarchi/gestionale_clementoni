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

  