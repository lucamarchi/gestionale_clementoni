/**
 * Created by luca on 24/05/16.
 */

var mongoose = require('mongoose');
var Q = require('q');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    codArticolo: {type: Number},
    tipo: {type: String},
    note: {type: String},
    materiale: {type: String},
    sottoTipo: {type: String},
    quantita: {type: Number},
    qualita: {type: String},
    prezzo: {type: String},
    spessore: {type: Number},
    lunghezza: {type: Number},
    larghezza: {type: Number},
    lunghezzaAssegnata: {type: Number},
    larghezzaAssegnata: {type: Number},
    pesoSaldo: {type: Number, default: 0},
    pesoIniziale: {type: Number},
    pesoAttuale: {type: Number},
    dataConsegna: {type: Date},
    scarto: {type: Number, default: 0},
    statoProduzione: {type: String},
    statoEvasione: {type: String},
    productId: {type: Schema.ObjectId, ref: 'Product'},
    ordineCod: {type: Number},
    clienteCod: {type: Number},
    nomeCod: {type: String},
    region: {type: String},
    provincia: {type: String},
    descrizione: {type: String},
    reso: {type: Number, default: 0}
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

    findByStatusProd: function(status) {
        var deferred = Q.defer();
        var query = {'statoProduzione': status};
        articleModel.find(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },

    findByStatusEvas: function(status) {
        var deferred = Q.defer();
        var query = {'statoEvasione': status};
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
        var query = {$and: [{'statoProduzione': {$exists: true}},{'statoEvasione': {$exists: true}}]};
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
        newArticle.pesoIniziale = article.pesoIniziale;
        newArticle.pesoAttuale = article.pesoAttuale;
        newArticle.ordineCod = article.codice;
        newArticle.clienteCod = article.clienteCod;
        newArticle.dataConsegna = article.dataConsegna;
        newArticle.descrizione = article.descrizione;
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

    deleteArticle: function(id) {
        var deferred = Q.defer();
        var query = {'_id': id};
        articleModel.remove(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err)
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
                    result.lunghezzaAssegnata = article.lunghezzaAssegnata;
                    result.larghezzaAssegnata = article.larghezzaAssegnata;
                    result.qualita = article.qualita;
                    result.pesoIniziale = article.pesoIniziale;
                    result.pesoAttuale = article.pesoAttuale;
                    result.ordineCod = article.codice;
                    result.clienteCod = article.clienteCod;
                    result.dataConsegna = article.dataConsegna;
                    result.descrizione = article.descrizione;
                    result.save(function(err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(result);
                        }
                    });
                } else return deferred.reject();
            }
        });
        return deferred.promise;
    },

    addProductToArticle: function(articleId,productId) {
        var query = {'productId': productId};
        var article = this.updateArticle(articleId, query);
        return article;
    },

    setArticleStatusProd: function(articleId,status) {
        var query = {$set: {'statoProduzione': status}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    setArticleStatusEvas: function(articleId,status) {
        var query = {$set: {'statoEvasione': status}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    setArticleComplete: function(articleId) {
        var query = {$set: {'statoProduzione': 'completato'}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    unsetProductToArticle: function(articleId) {
        var query = {$unset: {'productId': ''}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    removeProductToArticle: function(productId) {
        var deferred = Q.defer();
        var query = {$unset: {'productId': ''}};
        articleModel.update({'productId': productId},query).exec(function(err,result) {
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

    addCodNameToArticle: function(articleId,pr) {
        var query = {$set: {'nomeCod': pr}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    updatePesoAttualeArticle: function(articleId,peso) {
        var query = {$set: {'pesoAttuale': peso}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    setReso: function(articleId,reso) {
        var query = {$inc: {'reso': reso}};
        var article = this.updateArticle(articleId,query);
        return article;
    },

    findAllWithLength: function() {
        var deferred = Q.defer();
        var query = {'lunghezzaAssegnata': {$exists: true}};
        articleModel.find(query).exec(function(err,result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

};