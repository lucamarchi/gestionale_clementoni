function prodOverviewFilter() {
	
  	return function(input, search) {
		var output;
		if (input) {
			output = input.slice();
            if (search) {
                if (search.dataConsegna) {
                    output = output.filter(function(el){
                        return (new Date(el.dataConsegna).getTime() == new Date(search.dataConsegna).getTime());
                    });
                }
                if (search.region) {
                    output = output.filter(function(el){
                        return (el.region.toString().substring(0,search.region.length) == search.region);
                    });
                }
                if (search.provincia) {
                    output = output.filter(function(el){
                        return (el.provincia.toString().substring(0,search.provincia.length) == search.provincia);
                    });
                }
                if (search.ordineCod) {
                    output = output.filter(function(el){
                        return (el.ordineCod.toString().substring(0,search.ordineCod.length) == search.ordineCod);
                    });
                }
                if (search.clienteCod) {
                    output = output.filter(function(el){
                        return (el.clienteCod.toString().substring(0,search.clienteCod.length) == search.clienteCod);
                    });
                }
            }
        }
		return output;
    }
}


angular
    .module('store')
    .filter('prodOverviewFilter', prodOverviewFilter);