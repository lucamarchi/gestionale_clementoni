function inboundTableFilter() {
	
  	return function(input, search) {
		var output;
		if (input) {
			output = input.slice();
            if (search) {
                if (search.ddt) {
                    output = output.filter(function(el){
                        return (el.ddt.toString().substring(0,search.ddt.length) == search.ddt);
                    });
                }
                if (search.fornitore) {
                    output = output.filter(function(el){
                        return (el.fornitore == search.fornitore);
                    });
                }
                if (search.dataDdt) {

                    output = output.filter(function(el){
                        return (new Date(el.dataDdt).getTime() == new Date(search.dataDdt).getTime());
                    });
                }
            }
		}
		return output;
	}
};

angular
    .module('store')
    .filter('inboundTableFilter', inboundTableFilter);