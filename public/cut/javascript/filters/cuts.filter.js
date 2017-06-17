function cutsFilter() {
	
  	return function(input, search) {
		var output;
		if (input) {
			output = input.slice();
            if (search) {
                if (search.codice) {
                    output = output.filter(function(el){
                        return (el.codice.toString().substring(0,search.codice.length) == search.codice);
                    });
                }
                if (search.clienteCod) {
                    output = output.filter(function(el){
                        return (el.clienteCod.toString().substring(0,search.clienteCod.length) == search.clienteCod);
                    });
                }
                if (search.date) {
                    output = output.filter(function(el){
                        return (new Date(el.date).getTime() == new Date(search.date).getTime());
                    });
                }
            }
        }
		return output;
    }
}


angular
    .module('store')
    .filter('cutsFilter', cutsFilter);