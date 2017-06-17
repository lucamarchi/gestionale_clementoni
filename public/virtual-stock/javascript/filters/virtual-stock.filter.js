function stockFilter() {
	
  	return function(input, array) {
        var output;
		if (input) {
			output = input.slice();
            if (array && array.length > 0) {
                output = output.filter(function(el) {
                    return array.indexOf(el.key) != -1;
                })
            }
        }
        return output;
    }
}

angular
    .module('store')
    .filter('stockFilter', stockFilter);