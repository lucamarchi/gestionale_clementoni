/**
 * Created by nexse on 17/05/2017.
 */

function UtilityFactory () {

    var utilityFactory = {};

    utilityFactory.productValuesForType = function (product, peso, spessore, larghezza) {
        if (product.tipo && product[peso] && product[larghezza] && product[spessore]) {
            if (product.tipo.toLowerCase() == "coil" || product.tipo.toLowerCase() == "nastro") {
                product.lunghezza = (product[peso] / ((product[larghezza] * product[spessore] * 7.85) / 1000)).toFixed(2);
                product.quantita = 0;
            }
            else if (product.tipo.toLowerCase() == "piana" ||
                product.tipo.toLowerCase() == "ondulata" || product.tipo.toLowerCase() == "grecata") {
                product.quantita = Math.round(product[peso] / ((product[larghezza] * product.lunghezza * product[spessore] * 7.85) / 1000000));
            }
        }
        else {
            console.log("MANCANO ATTRIBUTI");
        }
        return;
    }

    return utilityFactory;
}

angular
    .module('store')
    .factory('UtilityFactory', UtilityFactory);