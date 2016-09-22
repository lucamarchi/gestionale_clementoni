/**
 * Created by luca on 24/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');
var Stock = require('./stock');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    codArticolo: {type: Number},
    tipo: {type: String},
    note: {type: String},
    materiale: {type: String},
    sottoTipo: {type: String},
    quantita: {type: Number},
    prezzo: {type: String},
    spessore: {type: Number},
    lunghezza: {type: Number},
    larghezza: {type: Number},
    peso: {type: Number},
    pesoAttuale: {type: Number},
    dataConsegna: {type: Date},
    scarto: {type: Number, default: 0},
    stato: {type: String},
    stockId: {type: Schema.ObjectId, ref: 'Stock'},
    ordineCod: {type: Number},
    clienteCod: {type: Number},
    region: {type: String},
    provincia: {type: String}
});

articleModel = mongoose.model('Article', ArticleSchema);
module.exports = articleModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        articleModel.findOne(query).lean().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findById: function(id) {
        var query = {'_id': id};
        var article = this.findOne(query);
        return article;
    },

    findAll: function() {
        var deferred = Q.defer();
        articleModel.findAll().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findByStatus: function(status) {
        var deferred = Q.defer();
        var query = {'stato': status};
        articleModel.find(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findAllWithStatus: function() {
        var deferred = Q.defer();
        var query = {'stato': {$exists: true}};
        articleModel.find(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    saveNewArticle: function(article) {
        var deferred = Q.defer();
        var newArticle = new articleModel();
        newArticle.codArticolo = article.codArticolo;
        newArticle.tipo = article.tipo;
        newArticle.note = article.note;
        newArticle.materiale = article.materiale;
        newArticle.sottoTipo = article.sottoTipo;
        newArticle.quantita = article.quantita;
        newArticle.prezzo = article.prezzo;
        newArticle.spessore = article.spessore;
        newArticle.lunghezza = article.lunghezza;
        newArticle.larghezza = article.larghezza;
        newArticle.peso = article.peso;
        newArticle.pesoAttuale = article.pesoAttuale;
        newArticle.ordineCod = article.codice;
        newArticle.clienteCod = article.clienteCod;
        newArticle.dataConsegna = article.dataConsegna;
        newArticle.save(function(err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(newArticle);
            }
        });
        return deferred.promise;
    },

    updateArticle: function(articleId,query) {
        var deferred = Q.defer();
        articleModel.findByIdAndUpdate(articleId,query,{new: true}).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    modifyArticle: function(articleId, article) {
        var deferred = Q.defer();
        var query = {'_id': articleId};
        articleModel.findOne(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                if (result || result !== null) {
                    result.codArticolo = article.codArticolo;
                    result.tipo = article.tipo;
                    result.note = article.note;
                    result.materiale = article.materiale;
                    result.sottoTipo = article.sottoTipo;
                    result.quantita = article.quantita;
                    result.prezzo = article.prezzo;
                    result.spessore = article.spessore;
                    result.lunghezza = article.lunghezza;
                    result.larghezza = article.larghezza;
                    result.peso = article.peso;
                    result.pesoAttuale = article.pesoAttuale;
                    result.ordineCod = article.codice;
                    result.clienteCod = article.clienteCod;
                    result.dataConsegna = article.dataConsegna;
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

    addStockToArticle: function(articleId,stockId) {
        var query = {'stockId': stockId};
        var article = this.updateArticle(articleId, query);
        return article;
    },

    setArticleStatus: function(articleId,status) {
        var query = {$set: {'stato': status}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    setArticleComplete: function(articleId) {
        var query = {$set: {'stato': 'completato'}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    unsetStockToArticle: function(articleId) {
        var query = {$unset: {'stockId': ''}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    removeStockToArticle: function(stockId) {
        var deferred = Q.defer();
        var query = {$unset: {'stockId': ''}};
        articleModel.update({'stockId': stockId},query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    increaseScarto: function(articleId,scarto) {
        var query = {$inc: {'scarto': scarto}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    addRegionToArticle: function(articleId,region) {
        var query = {$set: {'region': region}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    addPRToArticle: function(articleId,pr) {
        var query = {$set: {'provincia': pr}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    addCodCutToArticle: function(articleId,pr) {
        var query = {$set: {'ordineCod': pr}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    updatePesoAttualeArticle: function(articleId,peso) {
        var query = {$set: {'pesoAttuale': peso}};
        var article = this.updateArticle(articleId,query);
        return article;
    }

};