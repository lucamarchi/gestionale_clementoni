function outboundArticleFilter() {
	
  	return function(input, array, property) {
        var output;
		if (input) {
			output = input.slice();
            if (array && array.length > 0) {
                output = output.filter(function(el) {
                    return array.indexOf(el[property]) != -1 || array.indexOf(el[property.toUpperCase()]) != -1;
                })
            }
        }
        return output;
    }
}

//options[attributeO].hasOwnProperty(model.materiale))
angular
    .module('store')
    .filter('outboundArticleFilter', outboundArticleFilter)