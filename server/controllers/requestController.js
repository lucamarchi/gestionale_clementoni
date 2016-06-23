/**
 * Created by luca on 27/05/16.
 */




/*
PROBLEMA AD ISTANZIARE CUT; METODI REQUEST TORNANO UN JSON CREATO CON UN'OGGETTO DEFINITO PRIMA IN QUESTO MODO
 var exjson = {'key':'value'}; ; I METODI TORNANO IL JSON E CUTCONTROLLER FA LE SOLITE OPERAZIONI; OCCHIO
 ARRAY PRODOTTI NON data[key]
 */


var Cut = require('./../models/cut');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var configs = require('./../configs/url');
var Q = require('q');
var request = require('request');

function TmpArticolo() {
    this.codArticolo = 'y',
    this.note = 'y',
    this.tipo = 'y',
    this.materiale = 'y',
    this.sottoTipo = 'y',
    this.quantita = 'y',
    this.prezzo = 'y',
    this.spessore = 'y',
    this.lunghezza = 'y',
    this.larghezza = 'y',
    this.peso = 'y',
    this.ordineCod = 'y',
    this.clienteCod = 'y',
    this.dataConsegna = 'y'
};

function TmpCut() { this.anno = 'x', this.codice = 'x', this.clienteCod = 'x', this.note = 'x', this.date = 'x', this.articoli = [] };

function TmpCustomer() { this.ident = 'x' };

module.exports = {

    request: function(url) {
        var deferred = Q.defer();
        request.get({
            url: url,
            json: true
        }, function(error,response,body) {
            if (error) {
                deferred.reject(error);
            } else if (!error && response.statusCode == 200) {
                deferred.resolve(body.data);
            } else {
                var err = new Error("Problema risposta api");
                err.status = 400;
                deferred.reject(err);
            }
        });
        return deferred.promise;
    },

    findNewCuts: function(date,cod) {
        var deferred = Q.defer();
        var api_agenti = configs.api_agenti;
        var api_codice = configs.api_cod;
        var url = api_agenti + date + api_codice + cod;
        this.request(url).then(function (results) {
            if (results.length > 0) {
                var parsedData = [];
                for (var i in results) {
                    var tmpCut = new TmpCut();
                    tmpCut.anno = results[i].Anno;
                    tmpCut.codice = results[i].Codice;
                    tmpCut.clienteCod = results[i].ClienteCod;
                    tmpCut.note = results[i].Note;
                    var tmpDate = (results[i].DataOrdine).split(' ');
                    var y = tmpDate[0].split('/');
                    var newDate = new Date(y[2], y[1] - 1, y[0]);
                    tmpCut.date = newDate;
                    var articoli = [];
                    for (var key in results[i].data) {
                        var ti = (results[i].data[key].DesArticolo).trim();
                        if (ti == 'NASTRI') {
                            ti = 'nastro'
                        } else if (ti == 'COILS') {
                            ti = 'coil'
                        } else if (ti == 'LAMIERA PIANA') {
                            ti = 'piana'
                        } else if (ti == 'LAMIERA PRESSOPIEGATA “OMEGA”') {
                            ti = 'pressopiegata omega'
                        } else if (ti == 'LAMIERA PRESSOPIEGATA “U”') {
                            ti = 'pressopiegata u'
                        } else {
                            ti = ti.toLowerCase();
                        }
                        var tmpArticolo = new TmpArticolo();
                        tmpArticolo.codArticolo = results[i].data[key].CodArticolo;
                        tmpArticolo.note = results[i].data[key].Note;
                        tmpArticolo.tipo = ti;
                        tmpArticolo.materiale = (results[i].data[key].TipoArticolo).toLowerCase();
                        tmpArticolo.sottoTipo = (results[i].data[key].SottoTipoArticolo).trim();
                        tmpArticolo.quantita = results[i].data[key].Quantita;
                        tmpArticolo.prezzo = results[i].data[key].Prezzo;
                        tmpArticolo.spessore = results[i].data[key].Spessore;
                        tmpArticolo.lunghezza = results[i].data[key].Lunghezza;
                        tmpArticolo.larghezza = results[i].data[key].Larghezza;
                        tmpArticolo.peso = (results[i].data[key].Peso).replace(",", ".") * 1000;
                        var tmpDate = (results[i].data[key].DataConsegna).split(' ');
                        var y = tmpDate[0].split('/');
                        var d = new Date(y[2], y[1] - 1, y[0]);
                        tmpArticolo.ordineCod = tmpCut.codice;
                        tmpArticolo.clienteCod = tmpCut.clienteCod;
                        tmpArticolo.dataConsegna = d;
                        articoli.push(tmpArticolo);

                    }
                    tmpCut.articoli = articoli;
                    parsedData.push(tmpCut);
                }
                deferred.resolve(parsedData);
            } else {
                deferred.resolve([]);
            }
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    findCustomer: function() {
        var deferred = Q.defer();
        var api_customer = configs.api_customer;
        this.request(api_customer).then(function(results) {
            var customers = [];
            for (var i in results) {
                var tmpCustomer = new TmpCustomer();
                tmpCustomer.ident = results[i].Id;
                tmpCustomer.agente = results[i].Agente;
                tmpCustomer.bancaAbi = results[i].BancaAbi;
                tmpCustomer.bancaCab = results[i].BancaCab;
                tmpCustomer.codFiscale = (results[i].CodFiscale).trim();
                tmpCustomer.fax = results[i].Fax;
                tmpCustomer.indirizzo = results[i].Indirizzo;
                tmpCustomer.localita = results[i].Localita;
                tmpCustomer.nome = results[i].Name;
                tmpCustomer.pagamento = results[i].Pagamento;
                tmpCustomer.partitaIva = (results[i].PartitaIva).trim();
                tmpCustomer.provincia = results[i].Provincia;
                tmpCustomer.regione = results[i].Regione;
                tmpCustomer.telefono = results[i].Telefono;
                tmpCustomer.email = results[i].eMail;
                customers.push(tmpCustomer);
            }
            deferred.resolve(customers)
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    findNewCustomerByIdentity: function(identity) {
        var deferred = Q.defer();
        this.findCustomer().then(function(results) {
            console.log("RESULTS: "+results)
            if (results.length > 0) {
                results.forEach(function(currCustomer) {
                    if (currCustomer.ident === identity) {
                        console.log(currCustomer.ident === identity)
                        deferred.resolve(currCustomer);
                    }
                });
            } else {
                var err = new Error("No customer with this identity");
                err.status = 400;
                deferred.reject(err);
            }
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }



};