/**
 * Created by luca on 24/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    ident: {type: Number},
    agente: {type: Number},
    bancaAbi: {type: Number},
    bancaCab: {type: Number},
    codFiscale: {type: String},
    fax: {type: String},
    indirizzo: {type: String},
    localita : {type: String},
    nome: {type: String},
    pagamento: {type: String},
    partitaIva: {type: String},
    provincia: {type: String},
    regione: {type: String},
    telefono: {type: String},
    email: {type: String}
});

customerModel = mongoose.model('Customer', CustomerSchema);
module.exports = customerModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        customerModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var query = {'_id': id};
        var customer = this.findOne(query);
        return customer;
    },

    findAll: function() {
        var deferred = Q.defer();
        customerModel.find({}).exec(function (err, result) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findByIdentity: function(identity) {
        var query = {'ident': identity};
        var customer = this.findOne(query);
        return customer;
    },

    saveNewCustomer: function(customer) {
        var deferred = Q.defer();
        var newCustomer = new customerModel();
        newCustomer.ident = customer.ident;
        newCustomer.agente = customer.agente;
        newCustomer.bancaAbi = customer.bancaAbi;
        newCustomer.bancaCab = customer.bancaCab;
        newCustomer.codFiscale = customer.codFiscale;
        newCustomer.fax = customer.fax;
        newCustomer.indirizzo = customer.indirizzo;
        newCustomer.localita = customer.localita;
        newCustomer.nome = customer.nome;
        newCustomer.pagamento = customer.pagamento;
        newCustomer.partitaIva = customer.partitaIva;
        newCustomer.provincia = customer.provincia;
        newCustomer.regione = customer.regione;
        newCustomer.telefono = customer.telefono;
        newCustomer.email = customer.email;
        newCustomer.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newCustomer);
            }
        });
        return deferred.promise;
    },

    modifyCustomer: function(customerId, customer) {
        var deferred = Q.defer();
        var query = {'_id': customerId};
        customerModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.ident = customer.ident;
                    result.agente = customer.agente;
                    result.bancaAbi = customer.bancaAbi;
                    result.bancaCab = customer.bancaCab;
                    result.codFiscale = customer.codFiscale;
                    result.fax = customer.fax;
                    result.indirizzo = customer.indirizzo;
                    result.localita = customer.localita;
                    result.nome = customer.nome;
                    result.pagamento = customer.pagamento;
                    result.partitaIva = customer.partitaIva;
                    result.provincia = customer.provincia;
                    result.regione = customer.regione;
                    result.telefono = customer.telefono;
                    result.email = customer.email;
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

};