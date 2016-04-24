var store = angular.module('store');

store.factory('stockFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
    return {
		resource: function (){
			return $resource(myConfig.url+'/api/stocks/:id',
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
												monster[i].value[j].value[k].value[z].weight = monster[i].value[j].value[k].value[z].weight + t.pesoNetto;
												monster[i].value[j].value[k].weight = monster[i].value[j].value[k].weight + t.pesoNetto; 
												monster[i].value[j].weight = monster[i].value[j].weight + t.pesoNetto;
												monster[i].weight = monster[i].weight + t.pesoNetto;
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
}]);	