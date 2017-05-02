function valuesProduct (product){
	if (product.tipo && product.pesoNetto && product.larghezza && product.spessore){
		if (product.tipo.toLowerCase() == "coil" || product.tipo.toLowerCase() == "nastro"){
			product.lunghezza = (product.pesoNetto/((product.larghezza * product.spessore * 7.85)/1000)).toFixed(2);
		}
		if (product.tipo.toLowerCase() == "piana" || 
			product.tipo.toLowerCase() == "ondulata" || product.tipo.toLowerCase() == "grecata"){
			product.numFogli = Math.round(product.pesoNetto/((product.larghezza * product.lunghezza * product.spessore * 7.85)/1000000));
		}
		else {
			product.numFogli = 0;
		}
	}
	if (product.materiale != "zincato" && product.materiale != "preverniciato" && product.materiale != "inox") {
		product.finitura = undefined;
	}
	if (product.larghezza){
		var indexMin;
		min = Number.MAX_VALUE;
		var cLargh = [1000,1250,1500];
		for (var i=0; i<cLargh.length; i++) {
			if (Math.abs(cLargh[i] - product.larghezza)< min) {
				min = Math.abs(cLargh[i]-product.larghezza);
				indexMin = i;
			}
		}
		product.classeLarghezza = cLargh[indexMin];
	}
}

function calculateScarto (stockOld, stockNew, children){
	var pesoChildren = 0;
	var scarto = 0;
	for (c of children){
		pesoChildren = pesoChildren+c.pesoNetto;
	}
	var scarto = stockOld.pesoNetto - stockNew.pesoNetto - pesoChildren;
//	console.log("scarto="+stockOld.pesoNetto+"-"+stockNew.pesoNetto+"-"+pesoChildren+"="+scarto);
	return scarto;
}

function convertScarto (stock, lunghScarto) {
	var scarto = stock.spessore * stock.larghezza * lunghScarto * (7.85/1000000);
	return scarto;
}

function findDistinctRegion (data) {
	var regionArray = [];
	for(i = 0; i< data.length; i++){    
		if(regionArray.indexOf(data[i].region) === -1){
			regionArray.push(data[i].region);        
		}
	}
	return regionArray;
}

function findDistinctProvince (data) {
	var provinciaArray = [];
	for(i = 0; i< data.length; i++){    
		if(provinciaArray.indexOf(data[i].provincia) === -1){
			provinciaArray.push(data[i].provincia);        
		}
	}
	return provinciaArray;
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}