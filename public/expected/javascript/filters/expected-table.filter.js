function expectedFilter() {
	
  	return function(input, search) {
		var output;
		if (input) {
			output = input.slice();
            if (search) {
                if (search.fornitore) {
                    output = output.filter(function(el){
                        return (el.fornitore == search.fornitore);
                    });
                }
                if (search.dataPrevista) {
                    
                    output = output.filter(function(el){
                        return (new Date(el.dataPrevista).getTime() == new Date(search.dataPrevista).getTime());
                    });
                }
                if (search.materiale) {
                    output = output.filter(function(el){
                        return (el.materiale == search.materiale);
                    });
                }
                if (search.tipo) {
                    output = output.filter(function(el){
                        return (el.tipo == search.tipo);
                    });
                }
                if (search.spessore) {
                    output = output.filter(function(el){
                        return (el.spessore.toString() == search.spessore);
                    });
                }
            }
		}
		return output;
	}
};

angular
    .module('store')
    .filter('expectedFilter', expectedFilter);