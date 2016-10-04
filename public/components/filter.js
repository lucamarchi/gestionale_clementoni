var store = angular.module('store');

store.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

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
	
  	return function(input, dataConsegna, region, provincia, clienteCod, ordineCod, materiale, tipo, spessore) {
		var output;
		if (input) {
			output = input.slice();
			if (dataConsegna) {
				output = output.filter(function(el){
					return (new Date(el.dataConsegna).getTime() == new Date(dataConsegna).getTime());
				});
			}
			if (clienteCod) {
				output = output.filter(function(el){
					return (el.clienteCod.toString().substring(0,clienteCod.length) == clienteCod.toString());
				});
			}
			if (region) {
				output = output.filter(function(el){
					return (el.region.toString().substring(0,region.length) == region.toString());
				});
			}
			if (provincia) {
				output = output.filter(function(el){
					return (el.provincia.toString().substring(0,provincia.length) == provincia.toString());
				});
			}
			if (ordineCod) {
				output = output.filter(function(el){
					return (el.ordineCod.toString().substring(0,ordineCod.length) == ordineCod.toString());
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

store.filter('filterexp', function() {
	
  	return function(input, dataPrevista, fornitore, materiale, tipo, spessore) {
		var output;
		if (input) {
			output = input.slice();
			if (dataPrevista) {
				output = output.filter(function(el){
					return (new Date(el.dataPrevista).getTime() == new Date(dataPrevista).getTime());
				});
			}
			if (fornitore) {
				output = output.filter(function(el){
					return (el.fornitore == fornitore);
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
