var store = angular.module('store');

store.factory('stockFactory', function ($resource) {
    return {
		resource: function (){
			return $resource('http://localhost:8080/api/stocks/:id',
				{
					id: "@id"
				}, 
				{
					update: {method:'PUT'},
					getAll: {method:'GET', isArray: false}
				}
		)},
		
		createMapProducts: function (products) {
			var materialArray = ['zincato', 'decapato', 'laf', 'preverniciato', 'caldo', 'aluzinc', 'alluminato', 'elettrozincato'];

			var typeArray = ['coil', 'nastro', 'piana', 'ondulata', 'grecata', 'collaboranteh55', 'collaboranteh55-s', 'collaboranteh75', 'collaboranteh75-s'];

			var spessorArray = [0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.20, 1.50, 1.80, 2.00, 2.50, 3.00, 4.00, 5.00, 6.00, 8.00, 10.00];

			var largArray = [1000, 1250, 1500]; 
			
			var monster = [];
			
			var i, j, k,z, temp;
			i=0;
			for (mt of materialArray){
				temp = products.filter(function(el){
					return (el.materiale === mt);
				});
				if(temp.length != 0){
					monster.push({key: mt, lung: 0, weight: 0, value: []}); //i per accedere
					j=0;
					for (tp of typeArray){
						temp = products.filter(function(el){
							return (el.materiale === mt) && (el.tipo === tp);
						});
						if(temp.length != 0){
							monster[i].value.push({key: tp, lung: 0, weight: 0, value: []}) //j per accedere
							k = 0;
							for (sp of spessorArray) {
								temp = products.filter(function(el){
									return (el.materiale === mt) && (el.tipo === tp) && (el.spessore === sp);
								});
								if(temp.length != 0){
									monster[i].value[j].value.push({key: sp, lung: 0, weight: 0, value: []}); //k per accedere 
									z = 0;
									for (lg of largArray) {
										temp = products.filter(function(el){
											return (el.materiale === mt) && (el.tipo === tp) && (el.spessore === sp) && (el.classeLarghezza === lg);
										});

										if(temp.length != 0){
											monster[i].value[j].value[k].value.push({key: lg, lung: 0, weight: 0, value: temp}); //z per accedere
											monster[i].value[j].value[k].value[z].lung = temp.length;
											monster[i].value[j].value[k].lung = monster[i].value[j].value[k].lung + temp.length;
											monster[i].value[j].lung = monster[i].value[j].lung + temp.length;
											monster[i].lung = monster[i].lung + temp.length;
											for (t of temp) {
												monster[i].value[j].value[k].value[z].weight = monster[i].value[j].value[k].value[z].weight + t.peso;
												monster[i].value[j].value[k].weight = monster[i].value[j].value[k].weight + t.peso; 
												monster[i].value[j].weight = monster[i].value[j].weight + t.peso;
												monster[i].weight = monster[i].weight + t.peso;
											}
											z++;
										}
									}
									k++;
								}
							}
							j++;
						}
					}
					i++;
				}
			}
			return monster;
		}
	}
});	


store.filter('material', function() {
	return function(input, materiale) {
//		console.log("INPUT ", input);
//		console.log("MATERIALE ",materiale);
		var output = input.slice();
		if (materiale != undefined && materiale != "") {
			for (var i = output.length -1; i>=0; i--){
				if (output[i].key != materiale){	
					output.splice(i,1);
				}
			}
		}
		return output;
	}
});

store.filter('type', function(stockFactory) {
	return function(input, tipo) {
//		console.log("INPUT ", input);
//		console.log("TIPO ", tipo);
		var output = input.slice();
		if(tipo != undefined && tipo != ""){
			for (var i = output.length -1; i>=0; i--){
				for (var j = output[i].value.length -1; j>=0; j--){
					if (output[i].value[j].key != tipo){	
						output[i].value.splice(j,1);
						output[i].lung--;
					}
				}
			}
		}
		return output;
	}
});