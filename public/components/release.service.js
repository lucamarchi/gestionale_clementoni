var store = angular.module('store');

store.factory('releaseFactory', ['$resource', 'myConfig', function ($resource, myConfig) {
	return {
		resourceGroup: function() {
			return $resource(myConfig.url+'/api/releases', 
				{},
				{
					getAll: {method:'GET', isArray: false},
				}
			);
		},
		resource: function() {
			return $resource(myConfig.url+'/api/release/:id', 
				{
					id:"@id"
				},
				{			 
					update: {method:'PUT'}
				}			 
			);
		},
		
		createMapArticles: function (articles) {
			
			var regionArray = findDistinctRegion(articles);
			var provinciaArray = findDistinctProvincia(articles);
			
			var monster = [];
			console.log ("111 ", regionArray, "222 ", provinciaArray);
			i=0;
			for (rg of regionArray){
				temp = articles.filter(function(el){
					return (el.region == rg);
				});
				if(temp.length != 0){
					monster.push({key: rg, lung: 0, weight: 0, value: []}); //i per accedere
					j=0;
					for (pr of provinciaArray){
						temp = articles.filter(function(el){
							return (el.region == rg) && (el.provincia == pr);
						});
						if(temp.length != 0){
							monster[i].value.push({key: pr, lung: 0, weight: 0, value: temp}); //j per accedere
							for (t of temp) {
								monster[i].value[j].weight = monster[i].value[j].weight + t.peso;
								monster[i].weight = monster[i].weight + t.peso; 
							}
							j++;
						}
					}
					i++;
				}
			}
			console.log("monster ", monster);
			return monster;
		}
	}
}]);