function convertToNumber() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
}

function convertToFloat() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseFloat(val);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
}

angular
    .module('store')
    .directive('convertToNumber', convertToNumber)
    .directive('convertToFloat', convertToFloat);

