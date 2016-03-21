function valuesProduct (product){
	if (product.tipo.toLowerCase() == "coil" || product.tipo.toLowerCase() == "nastro"){
		product.lunghezza = (product.peso/((product.larghezza * product.spessore * 7.85)/1000)).toFixed(2);
		console.log("lunghezza = ", product.lunghezza);
	}
	if (product.tipo.toLowerCase() == "piana" || 
		product.tipo.toLowerCase() == "ondulata" || product.tipo.toLowerCase() == "grecata"){
		product.numFogli = Math.round(product.peso/((product.larghezza * product.lunghezza * product.spessore * 7.85)/1000000));
		console.log("numFogli = ", product.numFogli);
	}
	else {
		product.numFogli = 0;
		console.log("numFogli = ", product.numFogli);
	}
}

function calculateScarto (stockOld, stockNew, children){
	var pesoChildren = 0;
	var scarto = 0;
	for (c of children){
		pesoChildren = pesoChildren+c.peso;
	}
	var scarto = stockOld.peso - stockNew.peso - pesoChildren;
	console.log("scarto="+stockOld.peso+"-"+stockNew.peso+"-"+pesoChildren+"="+scarto);
	return scarto;
}