/**
 * Created by luca on 06/04/17.
 */

var Q = require('q');
var Prod = require('./../models/prod');
var Article = require('./../models/article');
var articleController = require('./../models/article');

module.exports = {

    createProd: function(prod) {
        var deferred = Q.defer();
        Prod.findNewNumeroProd().then(function(number) {
            Prod.saveNewProd(prod,number).then(function(result) {
                deferred.resolve(result);
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    addArticlesToProd: function(prodId,articles) {
        var deferred = Q.defer();
        var promises = [];
        var peso = 0;
        articles.forEach(function(currArticle) {
            peso += currArticle.pesoAttuale;
            var newMethod = Prod.addArticleToProd(prodId,currArticle._id);
            promises.push(newMethod);
        });
        promises.push(Prod.setPesoSaldoProd(prodId,peso));
        promises.push(Prod.setPesoInizialeProd(prodId,peso));
        Q.all(promises).then(function() {
            deferred.resolve();
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },

    deleteProd: function(prodId) {
        var deferred = Q.defer();
        var promises = [];
        Prod.findById(prodId).then(function(prod) {
            if (prod.articoliId && prod.articoliId.length > 0) {
                var articles = prod.articoliId;
                articles.forEach(function(currArticle) {
                    promises.push(Article.setArticleStatusProd(currArticle,"libero"));
                });
            }
            promises.push(Prod.deleteProd(prodId));
            Q.all(promises).then(function() {
                deferred.resolve();
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    removeArticleToProd: function(prodId,articleId) {
        var deferred = Q.defer();
        Prod.findById(prodId).then(function() {
            Article.findById(articleId).then(function(article) {
                var peso = article.pesoAttuale;
                Article.setArticleStatusProd(articleId,"libero").then(function() {
                    Prod.setPesoInizialeProd(prodId,-peso).then(function() {
                        Prod.removeArticleToProd(prodId,articleId).then(function(result) {
                            deferred.resolve(result);
                        });
                    });
                });
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    },

    removeArticlesToProd: function(prodId,articlesId) {
        var deferred = Q.defer();
        Prod.findById(prodId).then(function() {
            var promises = [];
            articlesId.forEach(function(currArticle) {
                promises.push(Prod.removeArticleToProd(prodId,currArticle._id));
                promises.push(Prod.setPesoInizialeProd(prodId,-currArticle.pesoAttuale));
            });
            Q.all(promises).then(function(result) {
                deferred.resolve(result);
            });
        }).catch(function(err) {
           deferred.reject(err);
        });
        return deferred.promise;
    }

};