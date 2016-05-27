var store = angular.module('store');

store.filter('filtercut', function() {
	
  	return function(input, codice, clienteCod, data) {
		var output;
		if (input) {
			output = input.slice();
			if (codice && clienteCod && data) {
				output = input.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod && el.codice.toString().substring(0,codice.length) == codice && new Date(el.date).getTime() == new Date(data).getTime());
				});
			}
			else if (codice && clienteCod) {
				output = input.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod && el.codice.toString().substring(0,codice.length) == codice);
				});
			}
			else if (codice && data) {
				output = input.filter(function(el){
					return (el.codice.toString().substring(0,codice.length) == codice && new Date(el.date).getTime() == new Date(data).getTime());
				});
			}
			else if (clienteCod && data) {
				output = input.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod && new Date(el.date).getTime() == new Date(data).getTime());
				});
			}
			else if (codice) {
				output = input.filter(function(el){
					return (el.codice.toString().substring(0,codice.length) == codice);
				});
			}
			else if (clienteCod) {
				output = input.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod);
				});
			}
			else if (data) {
				output = input.filter(function(el){
					return (new Date(el.date).getTime() == new Date(data).getTime());
				});
			}
		}
		return output;
	}

});	

store.filter('filterca', function() {
	
  	return function(input, ddt, fornitore, dataDdt) {
		var output;
		if (input) {
			output = input.slice();
			if (ddt && fornitore && dataDdt) {
				output = input.filter(function(el){
					return (el.fornitore == fornitore && el.ddt.toString().substring(0,ddt.length) == ddt && new Date(el.dataDdt).getTime() == new Date(dataDdt).getTime());
				});
			}
			else if (ddt && fornitore) {
				output = input.filter(function(el){
					return (el.fornitore == fornitore && el.ddt.toString().substring(0,ddt.length) == ddt);
				});
			}
			else if (ddt && dataDdt) {
				output = input.filter(function(el){
					return (el.ddt.toString().substring(0,ddt.length) == ddt && new Date(el.dataDdt).getTime() == new Date(dataDdt).getTime());
				});
			}
			else if (fornitore && dataDdt) {
				output = input.filter(function(el){
					return (el.fornitore == fornitore && new Date(el.dataDdt).getTime() == new Date(dataDdt).getTime());
				});
			}
			else if (ddt) {
				output = input.filter(function(el){
					return (el.ddt.toString().substring(0,ddt.length) == ddt);
				});
			}
			else if (fornitore) {
				output = input.filter(function(el){
					return (el.fornitore == fornitore);
				});
			}
			else if (dataDdt) {
				output = input.filter(function(el){
					return (new Date(el.dataDdt).getTime() == new Date(dataDdt).getTime());
				});
			}
		}
		return output;
	}

});