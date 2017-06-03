/**
 * Created by nexse on 17/05/2017.
 */

function UtilityFactory() {

    var utilityFactory = {};

    utilityFactory.productValuesForType = function (product, peso, spessore, larghezza) {
        if (product.tipo && product[peso] && product[larghezza] && product[spessore]) {
            if (product.tipo.toLowerCase() == "coil" || product.tipo.toLowerCase() == "nastro") {
                product.lunghezza = (product[peso] / ((product[larghezza] * product[spessore] * 7.85) / 1000)).toFixed(2);
            }
            else if (product.tipo.toLowerCase() == "piana" ||
                product.tipo.toLowerCase() == "ondulata" || product.tipo.toLowerCase() == "grecata") {
            }
            product.quantita = utilityFactory.calculateQuantity(product, peso, spessore, larghezza);
        }
        else {
            console.log("MANCANO ATTRIBUTI");
        }
        return;
    };

    utilityFactory.calculateQuantity = function (model, peso, spessore, larghezza) {
        var quantita = 0;
        if (model.tipo != "nastro" && model.tipo != "coil") {
            quantita = Math.round(model[peso] / ((model[larghezza] * model.lunghezza * model[spessore] * 7.85) / 1000000));
        };
        return quantita;
    };

    utilityFactory.producedProductFromStock = function (product, stock) {
        product.materiale = stock.materiale;
        //product.tipo = stock.tipo;
        if (stock.qualita) {
            product.qualita = stock.qualita;
        }
        product.spessoreNominale = stock.spessoreNominale.toString();
        product.spessoreEffettivo = stock.spessoreEffettivo;
        product.larghezzaNominale = stock.larghezzaNominale.toString();
        product.larghezzaEffettiva = stock.larghezzaEffettiva;
        if (stock.superficie) {
            product.superficie = stock.superficie;
        }
        if (stock.finitura) {
            product.finitura = stock.finitura;
        }
        if (stock.colore) {
            product.colore = stock.colore;
        }
        product.scelta = stock.scelta;
        return;
    };

    utilityFactory.inboundProductFromExpected = function (product, expected) {

        product.materiale = expected.materiale;
        product.qualita = expected.qualita;
        product.colore = expected.colore;
        product.finitura = expected.finitura;
        product.tipo = expected.tipo;
        if (product.tipo != 'coil' && product.tipo != 'nastro') {
            product.lunghezza = expected.lunghezza.toString();
        }
        if (expected.spessore) {
            product.spessoreNominale = expected.spessore.toString();
        }
        if (expected.larghezza) {
            product.larghezzaNominale = expected.larghezza.toString();
        }
        return;
    };

    return utilityFactory;
}

angular
    .module('store')
    .factory('UtilityFactory', UtilityFactory);