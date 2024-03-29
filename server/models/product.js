/**
 * Created by luca on 23/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    numeroCollo: {type: String, require: true},
    matricola: {type: String},
    tipo: {type: String},
    materiale: {type: String},
    qualita: {type: String},
    scelta: {type: String},
    finitura: {type: String},
    colore: {type: String},
    ral: {type: String},
    spessoreNominale: {type: Number},
    spessoreEffettivo: {type: Number},
    larghezzaNominale: {type: Number},
    larghezzaEffettiva: {type: Number},
    lunghezza: {type: Number},
    pesoIniziale: {type: Number},
    pesoNetto: {type: Number},
    pesoLordo: {type: Number},
    superficie: {type: String},
    quantita: {type: Number},
    prezzo: {type: Number},
    difetti: {type: String},
    stabilimento: {type: String},
    ubicazione: {type: String},
    cliente: {type: String},
    numPezzi: {type: Number},
    stato: {type: String},
    fatherId: [{type: Schema.ObjectId, ref: 'Product'}],
    scarto: {type: Number, default: 0},
    anno: {type: String},
    lavorazione: {type: Number, default: 1},
    reso: {type: Number, default: 0}
});


var productModel = mongoose.model('Product', ProductSchema);
module.exports = productModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        productModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var product = this.findOne({'_id': id});
        return product;
    },

    findAll: function() {
        var deferred = Q.defer();
        productModel.find({"pesoNetto": {$gt: 0}}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findNewNumeroCollo: function() {
        var deferred = Q.defer();
        var year = new Date().getFullYear();
        var query = {'numeroCollo': {$exists: true}};
        productModel.findOne(query).sort({"numeroCollo": -1}).limit(1).exec(function(err,result) {
           if (err) {
               deferred.reject(err);
           } else {
               if (!result) {
                   var prefix = year.toString().slice(-2);
                   var matr = prefix + "0001";
                   matr = parseInt(matr);
                   deferred.resolve(matr);
               } else {
                   var workedProduct = false;
                   var tmpMatr = result.numeroCollo;
                   var j = 0;
                   for (var i in tmpMatr) {
                       if (tmpMatr[i] == "/") {
                           workedProduct = true;
                           j = i;
                       }
                   }
                   if (workedProduct) {
                       var matr = tmpMatr.substr(0,j);
                       var prefix = year.toString().slice(-2);
                       var number = matr.slice(-4);
                       var last = prefix + number;
                       var number = (parseInt(last)+1).toString();
                   } else {
                       var prefix = year.toString().slice(-2);
                       var number = tmpMatr.slice(-4);
                       var last = prefix + number;
                       var number = (parseInt(last)+1).toString();
                   }
                   deferred.resolve(number);
               }
           }
        });
        return deferred.promise;
    },

    saveNewProduct: function(product) {
        var deferred = Q.defer();
        var newProduct = new productModel();
        var year = new Date().getFullYear();
        newProduct.matricola = product.matricola;
        newProduct.anno = year;
        newProduct.tipo = product.tipo;
        newProduct.materiale = product.materiale;
        newProduct.qualita = product.qualita;
        newProduct.scelta = product.scelta;
        newProduct.finitura = product.finitura;
        newProduct.colore = product.colore;
        newProduct.ral = product.ral;
        newProduct.spessoreNominale = product.spessoreNominale;
        newProduct.spessoreEffettivo = product.spessoreEffettivo;
        newProduct.larghezzaNominale = product.larghezzaNominale;
        newProduct.larghezzaEffettiva = product.larghezzaEffettiva;
        newProduct.lunghezza = product.lunghezza;
        newProduct.pesoIniziale = product.pesoIniziale;
        newProduct.pesoNetto = product.pesoNetto;
        newProduct.pesoLordo = product.pesoLordo;
        newProduct.superficie = product.superficie;
        newProduct.quantita = product.quantita;
        newProduct.prezzo = product.prezzo;
        newProduct.difetti = product.difetti;
        newProduct.stabilimento = product.stabilimento;
        newProduct.ubicazione = product.ubicazione;
        newProduct.cliente = product.cliente;
        newProduct.numPezzi = product.numPezzi;
        if (!product.stato) {
            newProduct.stato = "sospeso";
        } else newProduct.stato = product.stato;
        newProduct.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newProduct);
            }
        });
        return deferred.promise;
    },

    updateProduct: function(productId, query) {
        var deferred = Q.defer();
        productModel.findByIdAndUpdate(productId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    updateNumeroCollo: function(productId,number) {
        var query = {'numeroCollo': number};
        var product = this.updateProduct(productId,query);
        return product;
    },

    deleteProduct: function(productId) {
        var deferred = Q.defer();
        var query = {'_id': productId};
        productModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    modifyProduct: function(productId, product) {
        var deferred = Q.defer();
        var query = {'_id': productId};
        productModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.matricola = product.matricola;
                    result.tipo = product.tipo;
                    result.materiale = product.materiale;
                    result.qualita = product.qualita;
                    result.scelta = product.scelta;
                    result.finitura = product.finitura;
                    result.colore = product.colore;
                    result.ral = product.ral;
                    result.spessoreNominale = product.spessoreNominale;
                    result.spessoreEffettivo = product.spessoreEffettivo;
                    result.larghezzaNominale = product.larghezzaNominale;
                    result.larghezzaEffettiva = product.larghezzaEffettiva;
                    result.lunghezza = product.lunghezza;
                    result.pesoIniziale = product.pesoIniziale;
                    result.pesoNetto = product.pesoNetto;
                    result.pesoLordo = product.pesoLordo;
                    result.superficie = product.superficie;
                    result.quantita = product.quantita;
                    result.prezzo = product.prezzo;
                    result.difetti = product.difetti;
                    result.stabilimento = product.stabilimento;
                    result.ubicazione = product.ubicazione;
                    result.cliente = product.cliente;
                    result.numPezzi = product.numPezzi;
                }
                result.save(function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(result);
                    }
                });
            }
        });
        return deferred.promise;
    },

    increaseLavorazione: function(productId) {
        var query = {$inc: {'lavorazione': 1}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    increaseScarto: function(productId,scarto) {
        var query = {$inc: {'scarto': scarto}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    addFatherId: function(productId,fatherId) {
        var query = {$push: {'fatherId': fatherId}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    setReso: function(productId,reso) {
        var query = {$inc: {'reso': reso}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    deleteStockNetto: function(productId) {
        var query = {$set: {'pesoNetto': 0}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    deleteStockLordo: function(productId) {
        var query = {$set: {'pesoLordo': 0}};
        var product = this.updateProduct(productId,query);
        return product;
    },

    createReso: function(product,reso) {
        var deferred = Q.defer();
        var newProduct = new productModel();
        newProduct.matricola = product.matricola;
        newProduct.numeroCollo = product.numeroCollo+"L";
        newProduct.anno = product.year;
        newProduct.tipo = product.tipo;
        newProduct.materiale = product.materiale;
        newProduct.qualita = product.qualita;
        newProduct.scelta = product.scelta;
        newProduct.finitura = product.finitura;
        newProduct.colore = product.colore;
        newProduct.ral = product.ral;
        newProduct.spessoreNominale = product.spessoreNominale;
        newProduct.spessoreEffettivo = product.spessoreEffettivo;
        newProduct.larghezzaNominale = product.larghezzaNominale;
        newProduct.larghezzaEffettiva = product.larghezzaEffettiva;
        newProduct.lunghezza = product.lunghezza;
        newProduct.pesoIniziale = reso;
        newProduct.pesoNetto = product.pesoNetto;
        newProduct.pesoLordo = product.pesoLordo;
        newProduct.superficie = product.superficie;
        newProduct.quantita = product.quantita;
        newProduct.prezzo = product.prezzo;
        newProduct.difetti = product.difetti;
        newProduct.stabilimento = product.stabilimento;
        newProduct.ubicazione = product.ubicazione;
        newProduct.cliente = product.cliente;
        newProduct.numPezzi = product.numPezzi;
        newProduct.save(function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(newProduct);
            }
        });
        return deferred.promise;
    },

    addClienteCodToProduct: function(productId, clienteCod) {
        var query = {$set: {'cliente': clienteCod}};
        var product = this.updateProduct(productId,query);
        return product;
    }

};