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
    dataConsegna: {type: Date},
    scarto: {type: Number, default: 0},
    stato: {type: String},
    stockId: {type: Schema.ObjectId, ref: 'Stock'},
    ordineCod: {type: Number},
    clienteCod: {type: Number}
});

articleModel = mongoose.model('Article', ArticleSchema);
module.exports = articleModel;

module.exports = {

    findOne: function(query) {
        var deferred = Q.defer();
        articleModel.findOne(query).lean().exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } if(!result) {
                var err = new Error("Article not found");
                err.status = 400;
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
            } if(!result) {
                var err = new Error("Article not found");
                err.status = 400;
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
            } if (!result) {
                var err = new Error("No article with status");
                err.status = 400;
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
            } if (!result) {
                var err = new Error("No article with status");
                err.status = 400;
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
        var query = {$set: {'stato': 'completato'}} + {$unset: {'stockId': ''}};
        var article = this.updateArticle(articleId,query);
        return article;
    }
};