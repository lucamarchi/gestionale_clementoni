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

    },

    findById: function(id) {

    },

    findAll: function() {

    },

    findByIdentity: function(identity) {

    },

    saveNewCustomer: function(customer) {

    }

};