/**
 * Created by luca on 27/05/16.
 */

var Cut = require('./../models/cut');
var Article = require('./../models/article');
var Customer = require('./../models/customer');
var configs = require('./../configs/url');
var Q = require('q');
var request = require('request');


module.exports = {

    request: function(url) {
        var deferred = Q.defer();
        request.get({
            url: url,
            json: true,
        }, function(error,response,body) {
            if (error) {
                deferred.reject(err);
            } else if (!error && response.statusCode == 200 && body.data.length > 0) {
                deferred.resolve(body.data);
            }
        });
        return deferred.promise;
    },

    findNewCuts: function(date,cod) {
        var deferred = Q.defer();
        var api_agenti = configs.api_agenti;
        var api_codice = configs.api_cod;
        var api_customer = configs.api_customer;
        var url = api_agenti + date + api_codice + cod;
        this.request(url).then(function(results) {
            var cuts = [];
            for (var i in results) {
                var cut = results[i];
                cuts.push(cut);
                console.log("ORDINE: "+cut.Codice);
                for (var key in results[i].data) {
                    console.log("ARTICOLO : "+results[i].data[key].TipoArticolo);
                }
                deferred.resolve(cuts);
            }
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;

    },



};