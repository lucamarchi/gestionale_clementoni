var store = angular.module('store');

store.filter('filtercut', function() {
	
  	return function(input, codice, clienteCod, data) {
		var output;
		if (input) {
			output = input.slice();
			if (codice) {
				output = output.filter(function(el){
					return (el.codice.toString().substring(0,codice.length) == codice);
				});
			}
			if (clienteCod) {
				output = output.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod);
				});
			}
			if (data) {
				output = output.filter(function(el){
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
			if (ddt) {
				output = output.filter(function(el){
					return (el.ddt.toString().substring(0,ddt.length) == ddt);
				});
			}
			if (fornitore) {
				output = output.filter(function(el){
					return (el.fornitore == fornitore);
				});
			}
			if (dataDdt) {
				output = output.filter(function(el){
					return (new Date(el.dataDdt).getTime() == new Date(dataDdt).getTime());
				});
			}
		}
		return output;
	}

});

store.filter('filterstock', function() {
	
  	return function(input, numeroCollo, materiale, tipo, spessore, classeLarghezza) {
		var output;
		if (input) {
			output = input.slice();
			if (numeroCollo) {
				output = output.filter(function(el){
					return (el.numeroCollo.toString().substring(0,numeroCollo.length) == numeroCollo);
				});
			}
			if (materiale) {
				output = output.filter(function(el){
					return (el.materiale == materiale);
				});
			}
			if (tipo) {
				output = output.filter(function(el){
					return (el.tipo == tipo);
				});
			}
			if (spessore) {
				output = output.filter(function(el){
					return (el.spessore == spessore);
				});
			}
			if (classeLarghezza) {
				output = output.filter(function(el){
					return (el.classeLarghezza == classeLarghezza);
				});
			}
		}
		return output;
	}
});

store.filter('filterriep', function() {
	
  	return function(input, dataConsegna, ordineCod, clienteCod, materiale, tipo, spessore) {
		var output;
		if (input) {
			output = input.slice();
			if (dataConsegna) {
				output = output.filter(function(el){
					return (new Date(el.dataConsegna).getTime() == new Date(dataConsegna).getTime());
				});
			}
			if (ordineCod) {
				output = output.filter(function(el){
					return (el.ordineCod.toString().substring(0,ordineCod.length) == ordineCod.toString());
				});
			}
			if (clienteCod) {
				output = output.filter(function(el){
					console.log(el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod.toString());
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod.toString());
				});
			}
			if (materiale) {
				output = output.filter(function(el){
					return (el.materiale == materiale);
				});
			}
			if (tipo) {
				output = output.filter(function(el){
					return (el.tipo == tipo);
				});
			}
			if (spessore) {
				output = output.filter(function(el){
					return (el.spessore == spessore);
				});
			}
			
		}
		return output;
	}
});
