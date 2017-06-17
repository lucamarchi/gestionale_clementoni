function prodStateTableFilter() {

 	return function(input, search) {
		var output;
		if (input) {
			output = input.slice();
           if (search) {

               if (search.numero) {
                   output = output.filter(function(el){
                       return (el.numero.toString().substring(0,search.numero.length) == search.numero);
                   });
               }
               if (search.dataCreazione) {

                   output = output.filter(function(el){
                       return (new Date(el.dataCreazione).getTime() == new Date(search.dataCreazione).getTime());
                   });
               }
           }
       }
		return output;
   }
}


angular
   .module('store')
   .filter('prodStateTableFilter', prodStateTableFilter);